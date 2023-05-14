<template>
    <v-app>

        <v-app-bar color="#3DB0F3" class="text-center"
                   elevation="0"
                   dense
                   app>
            <v-btn icon disabled></v-btn>
            <v-spacer></v-spacer>
            <v-app-bar-title class="white--text">
                届出システム
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="movePage('/input2', false)">
                <v-icon class="white--text"
                    link
                >mdi-arrow-right</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <div class="mx-3 my-5">
                <h1 class="my-3">
                    届出システム(1/8)
                </h1>

                <v-form
                    class="ma-3"
                    ref="baseform"
                    v-model="valid"
                    lazy-validation
                >

                    <div v-for="(g, i) in sickList" :key="i">
                        <v-container
                            class="ma-0 pa-0"
                            v-if="g.question && g.label == '種別' || g.label == '氏名' || g.label == '所属' || g.label == '学籍番号/職員番号'"
                        >
                            <template class="my-3 pa-1">
                                <v-row style="margin:0;">
                                    <v-checkbox
                                        class="d-none"
                                        :label="g.label"
                                        v-model="g.checked"
                                        checked="true"
                                        aria-checked="true"
                                        dense
                                    >
                                    </v-checkbox>
                                    <div v-if="g.label == '種別'" @load="toggleAreaPositive(g.text)">
                                        <v-radio-group v-model="g.text" @change="toggleAreaPositive(g.text)">
                                            <v-radio
                                                label="陽性報告"
                                                id="option1"
                                                value="1"
                                            ></v-radio>
                                            <v-radio
                                                label="濃厚接触報告"
                                                id="option2"
                                                value="2"
                                            ></v-radio>
                                            <v-radio
                                                label="有症状報告（匿名可）"
                                                id="option3"
                                                value="3"
                                            ></v-radio>
                                        </v-radio-group>
                                    </div>
                                    <template v-else
                                        class="area-positive"
                                    >
                                        <v-text-field
                                            :label="g.question"
                                            v-model="g.text"
                                            :placeholder="g.checked ? g.placeholder : ''"
                                            dense
                                            v-show="isAreaPositiveVisible"
                                        >
                                        </v-text-field>
                                    </template>
                                </v-row>
                            </template>
                        </v-container>
                    </div>

                </v-form>

                <v-dialog
                    class="pa-5 white--text mb-10"
                    max-width="80%"
                    max-height="70%"
                    >
                    <template 
                        class=""
                        v-slot:activator="{ on, attrs }"
                        >
                        <v-btn
                            color="#28a745"
                            v-bind="attrs"
                            v-on="on"
                            class="area-positive pa-5 white--text"
                            v-show="isAreaPositiveVisible"
                        >
                            陽性証明添付
                        </v-btn>
                    </template>

                    <v-card>
                        <v-container class="responsive-style">
                            <iframe
                                :src="ffhsUrl"
                                class="cert-iframe"
                                height="100%"
                                width="100%"
                                frameborder="0"
                                allowfullscreen
                            ></iframe>
                        </v-container>
                    </v-card>

                </v-dialog>

                <v-btn
                    class="mt-10 pa-5 white--text"
                    color="#3DB0F3"
                    @click="movePage('/input2', true)"
                    block
                >
                    <span>
                        次へすすむ
                    </span>
                </v-btn>

            </div>
        </v-main>

    </v-app>
</template>

<script type="module" src="/common/healthProfile.js" async defer></script>
<script>
import utils from '@/common/utils.js'
import healthProfile from "@/common/healthProfile.js" 

export default {
    data() {
        return {
            valid: false,
            formData: {}, // reference to $state.formData
                /*
                ## formData.healthRecord
                - <LABEL>で一意になる健康状態のオブジェクト。
                - <LABEL>と<QUESTION>は healthProfile.labelから得る。
                    + healthProfileは外部から得る。
                - <TEXT>はGUIから入力される。前後の空白文字は削除する。
                - healthRecordは以下のリストを保持する。
                    + healthProfileに定義されていて、チェックされた項目。
                    + healthRecordに含まれていた項目。
                - healthProfileに定義された全ての項目を持たないと、healthProfileが変更された事がわからなくなるが、簡便さを取る。
                - questionとtextを保持する。
                    + textだけだと、質問が変更されると答えと合わなくなるため。
                - LABELに対して複数の質問があるかもしれないが、textが自由形式なのと、LABELを増やすことで対応してもらう。
                - データモデル
                    + <TEXT> === null: チェックしていない。
                    + <TEXT> === '': チェックしている, 詳細なし。
                    + <TEXT> !== '': チェックしている。詳細あり。

                formData.healthRecord = {
                    <LABEL> : {
                            text: <TEXT>,
                            question: <QUESTION>,
                        }, ...
                }
                */
            sickList: undefined,
                // $state.workData.sickList
                //healthRecordの作業用オブジェクト
                /*
                    healthProfile + 
                    sickList = [
                        {
                            label: 
                            question:
                            placeholder
                            checked:
                            text:
                        }, ...
                    ]
                */
            ffhsUrl: '',
            isAreaPositiveVisible: false
        }
    },
    methods: {
        updateFormData: function() {
            // copy workData.sickList back into formData.healthRecord.
            if (this.$refs.baseform.validate()) {
                let w = this.workData.sickList
                for (let i = 0; i < w.length; i++) {
                    if (w[i].checked === true) {
                        this.formData.healthRecord[w[i].label] = {
                            text: w[i].text === null ? '' : w[i].text,
                            question: w[i].question,
                        }
                    } else {
                        delete(this.formData.healthRecord[w[i].label])
                    }
                }
                // update formData
                //this.$store.commit('updateFormData', this.formData)
            }
        },
        movePage: function(pageName, doSubmit) {
            this.updateFormData()
            if (doSubmit) {
                utils.async_post(`${process.env.VUE_APP_SERVER_URL}/2`,
                    JSON.parse(JSON.stringify(this.formData)))
                    .then(ret => {
                        if (ret.code == 200) {
                            this.$router.push(pageName)
                        } else {
                            this.$store.state.responseData = ret
                            this.$router.push('/error')
                        }
                    })
            } else {
                this.$router.push(pageName)
            }
        },
        toggleAreaPositive: function(radioButtonValue) {
            if (radioButtonValue === '1') {
                this.isAreaPositiveVisible = true
            } else {
                this.isAreaPositiveVisible = false
            }
        },
    },
    mounted: function() {
        //this.toggleAreaPositive(0);

        this.formData = this.$store.state.formData
        this.workData = this.$store.state.workData
        // initialize healthRecord
        if (!this.formData.healthRecord) {
            this.formData.healthRecord = {}
        }
        // create sickList
        if (!this.workData.sickList) {
            this.workData.sickList = []
            let w = this.workData.sickList
            for (let i = 0; i < healthProfile.length; i++) {
                let profile = healthProfile[i]
                let ks = Object.keys(this.formData.healthRecord).filter(k => k === profile.label)
                if (ks.length == 1) {
                    let obj = this.formData.healthRecord[ks[0]]
                    // found the label in formData.healthRecord
                    if (obj.label == '既往歴' || obj.label == '接種回数' || obj.label == '感染ルート' || obj.label == 'ワクチンの種類' || obj.label == '種別' || obj.label == '氏名' || obj.label == '所属' || obj.label == '学籍番号/職員番号' || obj.label == '電話番号') {
                        w.push(Object.assign({}, profile, {
                            checked: true,
                            text: '',
                        }))
                    } else {
                        w.push(Object.assign({}, profile, {
                            checked: obj.text !== null ? true : false,
                            text: obj.text,
                        }))
                    }
                } else if (ks.length > 1) {
                    throw `ERROR: label=${profile.label} ks.length = ${ks.length}`
                } else {
                    // ks == []: LABELが存在しなかった。
                    // ks == undefined: サーバからhealthRecordを渡された。
                    if (profile.label == '既往歴' || profile.label == '接種回数' || profile.label == '感染ルート' || profile.label == 'ワクチンの種類' ||  profile.label == '種別' || profile.label == '氏名' || profile.label == '所属' || profile.label == '学籍番号/職員番号' || profile.label == '電話番号') {
                        w.push(Object.assign({}, profile, {
                            checked: true,
                            text: '',
                        }))
                    } else {
                        w.push(Object.assign({}, profile, {
                            checked: false,
                            text: null,
                        }))
                    }
                }
            }
        }
        this.sickList = this.workData.sickList
        let ffhs_url = `${process.env.VUE_APP_FFHS_URL}` + 'api/epidemiologic_research/cert_uploads?email=' + this.formData.emailAddr
        console.log(ffhs_url)
        this.ffhsUrl = ffhs_url;
    }
}
</script>

<style lang="scss" scoped>
.responsive-style{
    position:relative;
    width:100%;
    height:0;
    padding-top:50%;
}
.responsive-style iframe{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
}
</style>
