<template>
    <v-app>

        <v-app-bar color="#3DB0F3" class="text-center"
                   elevation="0"
                   dense
                   app>
            <v-btn icon @click="movePage('/input3')">
                <v-icon class="white--text"
                    link
                >mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-app-bar-title class="white--text">
                あなたの健康について(4/8)
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="movePage('/input5')">
                <v-icon class="white--text"
                    link
                >mdi-arrow-right</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <div class="mx-3 my-5">
                <h1 class="my-3">
                    あなたの既往歴<br>
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
                        class="ma-0 pa-1"
                        v-for="(a, j) in medicalList"
                        :key="j"
                    >
                        <template>
                            <v-row>
                                <v-checkbox
                                    ref="checks"
                                    :label="a.label"
                                    v-model="a.checked"
                                    @change="changeMedical(a)"
                                    dense
                                >
                                </v-checkbox>
                            </v-row>
                        </template>
                    </v-container>

                    <div v-for="(g, i) in sickList" :key="i">
                        <v-div
                            class="ma-0 pa-1"
                            v-if="g.question && g.label == '既往歴'"
                        >
                            <template class="my-3">
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
                                    <v-text-field
                                        class="d-none"
                                        :label="g.question"
                                        v-model="g.text"
                                        :placeholder="g.checked ? g.placeholder : ''"
                                        dense
                                    >
                                    </v-text-field>
                                </v-row>
                            </template>
                        </v-div>
                    </div>
                </v-form>

                <v-btn
                    class="pa-5 white--text"
                    color="#3DB0F3"
                    @click="movePage('/input5')"
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

const medicalHistories = [
    // 外部から入力
    {label:'該当しない',question:'',placeholder:'',error:'', checked:false},
    {label:'新型コロナウィルス（COVID-19）',question:'',placeholder:'',error:'', checked:false},
    {label:'脳卒中',question:'',placeholder:'',error:'', checked:false},
    {label:'狭心症',question:'',placeholder:'',error:'', checked:false},
    {label:'心筋梗塞',question:'',placeholder:'',error:'', checked:false},
    {label:'心不全',question:'',placeholder:'',error:'', checked:false},
    {label:'虚血性心疾患',question:'',placeholder:'',error:'', checked:false},
    {label:'その他の心疾患',question:'',placeholder:'',error:'', checked:false},
    {label:'慢性的な腎不全',question:'',placeholder:'',error:'', checked:false},
    {label:'人工透析',question:'',placeholder:'',error:'', checked:false},
    {label:'貧血',question:'',placeholder:'',error:'', checked:false},
    {label:'高血圧',question:'',placeholder:'',error:'', checked:false},
    {label:'低血圧',question:'',placeholder:'',error:'', checked:false},
    {label:'不整脈',question:'',placeholder:'',error:'', checked:false},
    {label:'高脂質血症',question:'',placeholder:'',error:'', checked:false},
    {label:'高尿酸血症',question:'',placeholder:'',error:'', checked:false},
    {label:'腎不全以外の腎疾患',question:'',placeholder:'',error:'', checked:false},
    {label:'糖尿病',question:'',placeholder:'',error:'', checked:false},
    {label:'肝臓病',question:'',placeholder:'',error:'', checked:false},
    {label:'胃・十二指腸潰瘍',question:'',placeholder:'',error:'', checked:false},
    {label:'うつ',question:'',placeholder:'',error:'', checked:false},
    {label:'骨粗鬆症',question:'',placeholder:'',error:'', checked:false},
    {label:'その他の顕著な既往歴あり',question:'',placeholder:'',error:'', checked:false},
]

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
            medicalList: medicalHistories,
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
        changeMedical: function(item) {
            var str = '';
            for (let i = 0; i < this.medicalList.length; i++) {
                if (this.medicalList[i].checked) {
                    str += this.medicalList[i].label + ",";
                }
            }

            for (let j = 0; j < this.sickList.length; j++) {
                if (this.sickList[j].label == '既往歴') {
                    this.sickList[j].text = str;
                }
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
