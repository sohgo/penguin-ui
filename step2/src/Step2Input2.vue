<template>
    <v-app>

        <v-app-bar color="#3DB0F3" class="text-center"
                   elevation="0"
                   dense
                   app>
            <v-btn icon @click="movePage('/input2')">
                <v-icon class="white--text"
                    link
                >mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-app-bar-title class="white--text">
                あなたの健康について(3/8)
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="movePage('/input4')">
                <v-icon class="white--text"
                    link
                >mdi-arrow-right</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <div class="mx-3 my-5">
                <h1 class="my-3">
                    あなたの基礎疾患<br>
                    についてお伺いします。
                </h1>

                <p>
                    該当する疾患についてチェックしてください。
                </p>

                <v-form
                    class="ma-3"
                    ref="baseform"
                    v-model="valid"
                    lazy-validation
                >

                    <v-container
                        class="ma-0 pa-0"
                        v-for="(g, i) in sickList"
                        :key="i"
                    >
                        <div v-if="g.label != '既往歴' && g.label != '接種回数' && g.label != 'ワクチンの種類' && g.label != '感染歴' && g.label != '感染ルート' && g.label != '種別' && g.label != '氏名' && g.label != '所属' && g.label != '学籍番号/職員番号' && g.label != '電話番号'"
                            class="ma-0 pa-1"
                        >
                            <v-row>
                                <v-checkbox
                                    :label="g.label"
                                    v-model="g.checked"
                                    :disabled="i !== 0 && sickList[0].checked"
                                    dense
                                >
                                </v-checkbox>
                            </v-row>
                            <template v-if="g.question && g.checked">
                                <v-row>
                                    <v-textarea
                                        :label="g.question"
                                        rows="2"
                                        v-model="g.text"
                                        :disabled="!g.checked"
                                        :placeholder="g.checked ? g.placeholder : ''"
                                        dense
                                    >
                                    </v-textarea>
                                </v-row>
                            </template>
                        </div>
                        <div v-else class="d-none" style="margin:0;padding:0;">
                            <v-checkbox
                                :label="g.label"
                                v-model="g.checked"
                            >
                            </v-checkbox>
                        </div>
                    </v-container>

                </v-form>

                <v-btn
                    class="pa-5 white--text"
                    color="#3DB0F3"
                    @click="movePage('/input4')"
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
//import utils from '@/common/utils.js'
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
        movePage: function(pageName) {
            if (this.$refs.baseform.validate()) {
                this.updateFormData()
                this.$router.push(pageName)
            }
        },
    },
    mounted: function() {
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
                    w.push(Object.assign({}, profile, {
                        checked: obj.text !== null ? true : false,
                        text: obj.text,
                    }))
                } else if (ks.length > 1) {
                    throw `ERROR: label=${profile.label} ks.length = ${ks.length}`
                } else {
                    // ks == []: LABELが存在しなかった。
                    // ks == undefined: サーバからhealthRecordを渡された。
                    w.push(Object.assign({}, profile, {
                        checked: false,
                        text: null,
                    }))
                }
            }
        }
        this.sickList = this.workData.sickList
    }
}
</script>

<style>
</style>
