<template>
    <v-app>

        <v-app-bar color="#3DB0F3" class="text-center"
            elevation="0"
            dense
            app
        >
            <v-btn icon @click="movePage('/input6')">
                <v-icon class="white--text"
                    link
                >mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-app-bar-title class="white--text">
                あなたの健康について(7/8)
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <!-- ここは将来的にはdisableにする。 -->
            <v-btn icon @click="movePage('/break')">
                <v-icon class="white--text"
                    link
                >mdi-arrow-right</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <div class="mx-3 my-5">
                <h1 class="my-3">
                    <ruby>過去<rt>かこ</rt></ruby>14日<ruby>以内<rt>いない</rt></ruby>に<ruby>下記<rt>かき</rt></ruby>の<ruby>場所<rt>ばしょ</rt></ruby>を<br>
                    <ruby>訪<rt>おと</rt></ruby>れたことがありますか？
                </h1>

                <p>
                    <ruby>
                    該当<rt>がいとう</rt></ruby>
                    する
                    <ruby>
                    場所<rt>ばしょ</rt></ruby>
                    にチェックしてください。
                </p>

                <v-form
                    class="ma-3"
                    ref="baseform"
                    v-model="valid"
                    lazy-validation
                >

                    <v-container
                        class="ma-0 pa-1"
                        v-for="(p, i) in locationList"
                        :key="i"
                    >
                        <v-row>
                            <v-checkbox
                                :label="p.label"
                                v-model="p.checked"
                                dense
                            >
                            </v-checkbox>
                        </v-row>
                        <template v-if="p.checked && p.label != '該当しない'">
                            <p>いつ訪れましたか？</p>
                            <v-checkbox
                                class="ma-0 pa-0"
                                v-for="(d, i) in p.dateList"
                                :key="i"
                                :label="d.date"
                                v-model="d.checked"
                                dense
                                >
                            </v-checkbox>
                        </template>
                    </v-container>

                </v-form>

                <v-btn
                    class="white--text"
                    color="#3DB0F3"
                    @click="movePage('/break', true)"
                    block
                >
                    <h3>
                        次へすすむ
                    </h3>
                </v-btn>

            </div>
        </v-main>

    </v-app>
</template>

<script>
import utils from '@/common/utils.js'

const focusedLocations = [
    // 外部から入力
    // 名称,エリア,クラスター認定日,住所
    // XXX 外部から読み込めるようにする。
    { label: '該当しない', area: '', date: '', address: '' },
    { label: '飲み会', area: '', date: '', address: '' },
    { label: 'カラオケ', area: '', date: '', address: '' },
    { label: 'ライブやクラブ等', area: '', date: '', address: '' },
    { label: 'その他、発声の伴う集会', area: '', date: '', address: '' },
]

export default {
    data() {
        return {
            valid: false,
            formData: {},
                /*
                ## presenceRecord
                - locationsは、クラスター発生箇所のリスト。
                    + 行っていなければ<LABEL>は存在しない。
                    + 発症日から遡って14日分の<BOO>値をリストで持つ。
                        * そこに存在していれば Trueにする。
                    + 遡る基準日は、input1のonseDate(必須)を使用する。
                    + XXX 要検討: 発症日が、クラスター認定日(YYYY-MM-DD)
                    よりも十分後ならならば表示しないとか？

                formData.presenceRecord = {
                    locations: {
                        // 14日分, 0, -1, -2, ..., -13
                        '<LABEL>': [ <BOOL>, <BOOL>, ..., <BOOL> ]
                        ,...
                    }
                }

                */
            locationList: undefined,
                /*
                locationList: [
                    {
                        label: <LABEL>,
                        checked: <BOOL>,
                        dateList: [ { date: <DATE>, checked: <BOOL> }, ... ]
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
        // initialize formData.
        if (!this.formData.locations) {
            this.formData.locations = {}
        }
        // create locationList
        if (!this.workData.locationList) {
            this.workData.locationList = []
            let w = this.workData.locationList
            for (let i = 0; i < focusedLocations.length; i++) {
                let place = focusedLocations[i]
                let dlist = utils.generatePastDateList(this.formData.onsetDate)
                    .map((v,j) => ({
                        date: `${v.local} ${v.annotate}`,
                        checked: this.formData.locations[place.label] === undefined ? false : this.formData.locations[place.label][j]
                    }))
                let checked = this.formData.locations[place.label] === undefined ? false : true
                w.push({
                    label: place.label,
                    checked: checked,
                    dateList: dlist,
                })
            }
        }
        this.locationList = this.workData.locationList
    }
}
</script>

<style>
</style>
