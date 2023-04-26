<template>
    <v-app>

        <v-main class="entry-body white--text">

            <div class="mx-3 my-5">

                <h1 class="entry my-3">
                    メールアドレスを登録しました
                </h1>

                <div class="py-3">
                    <div class="my-3">
                        ご登録頂いたメールアドレスに、ログインのための情報をお送りしました。<br>
                        しばらく待ってもメールが届かない場合、「<a href="https://www.hack.kitami-it.ac.jp/about/contact/" target="_blank">こちら</a>」からお問い合わせ下さい。
                    </div>

                </div>

                <v-btn
                    class="pa-5"
                    color="white"
                    block
                    @click="toDetailInput"
                >
                    <span class="black--text">
                        閉じる
                    </span>
                </v-btn>

            </div>
        </v-main>
    </v-app>
</template>

<script>
export default {
    methods: {
        toDetailInput: function() {
            //location.href = this.$store.state.url
            window.close();
        },
    },
}
</script>

<style>
</style>
