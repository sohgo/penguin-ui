<template>
    <v-app>

        <v-app-bar color="#3DB0F3" class="text-center"
                   elevation="0"
                   dense
                   app>
            <v-btn icon @click="movePage('/input5', false)">
                <v-icon class="white--text"
                    link
                >mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-app-bar-title class="white--text">
                入力6
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="movePage('/input7', false)">
                <v-icon class="white--text"
                    link
                >mdi-arrow-right</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <div class="mx-3 my-5">
                <h1 class="my-3">
                    感染ルートは判明していますか？
                </h1>

                <v-form
                    class="ma-3"
                    ref="baseform"
                    v-model="valid"
                    lazy-validation
                >

                    <div v-for="(g, i) in sickList" :key="i">
                        <v-container
                            class="ma-0 pa-1"
                            v-if="g.question && g.label == '感染ルート'"
                        >
                            <template>
                                <v-row>
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
                                        :label="g.question"
                                        v-model="g.text"
                                        :placeholder="g.checked ? g.placeholder : ''"
                                        dense
                                    >
                                    </v-text-field>
                                </v-row>
                            </template>
                        </v-container>
                    </div>

                </v-form>

                <v-btn
                    class="pa-5 white--text"
                    color="#3DB0F3"
                    @click="movePage('/input7', false)"
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

<!--script src="/s/healthProfile.js" async defer></script-->
<script>
import utils from '@/common/utils.js'

const healthProfile = [
    {label:'該当しない',question:'',placeholder:'',error:''},
    {label:'妊娠',question:'妊娠何週目ですか？',placeholder:'',error:''},
    {label:'喫煙',question:'何歳から１日あたり何本吸いますか？',placeholder:'例) 20本',error:''},
    {label:'糖尿病',question:'具体的に教えてください',placeholder:'例)2型糖尿病でインスリン注射をしている。',error:''},
    {label:'呼吸器疾患（喘息・COPD・その他）',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'腎疾患',question:'透析はしていますか？',placeholder:'',error:''},
    {label:'肝疾患',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'心疾患',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'神経筋疾患',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'血液疾患（貧血等）',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'免疫不全（HIV、免疫抑制剤使用含む）',question:'HIV、免疫抑制剤使用含む。具体的に教えてください。',placeholder:'',error:''},
    {label:'悪性腫瘍（がん）',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'その他',question:'具体的に教えてください',placeholder:'',error:''},
    {label:'ワクチン',question:'ワクチンの接種回数を入力してください',placeholder:'未接種の場合は0と入力してください',error:'',text:'', checked:'ture'},
    {label:'感染歴',question:'感染回数を入力してください',placeholder:'1度も無い場合は0と入力してください',error:'',text: '', checked:'ture'}, 
    {label:'感染ルート',question:'感染ルートは判明していますか？',placeholder:'「はい」か「いいえ」、正確に判明している場合具体的に入力してください',error:'',text: '', checked:'ture'}, 
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
