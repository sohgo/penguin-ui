<template>
    <v-app>

        <v-main class="biginning-body black--text">

            <div class="mx-3 my-5">

                <h1 class="entry image-wrapper pb-0 mb-5">
                    <img src="@/assets/img/ui_logo.png" alt="Logo" class="header__logo">
                </h1>

                <div class="px-3">
                    <div class="mb-3">
                        このシステムは、新型コロナウイルス感染症に「感染した」、「感染者(陽性者)と接触した」、「体調がわるい」 といった情報を、保健管理センターへと届け出るためのシステムです。
                    </div>

                    <div class="my-5">
                        報告は、以下の3ステップで進めて頂きます。
                    </div>

                    <div class="my-3">
                        1. 連絡の付くメールアドレスを登録する<br />
                        2. 届いたメールに記されたリンクをクリックする<br />
                        3. 症状や活動状況を入力し、センターに提出する<br />
                        4. 必要に応じて、2のリンクから登録情報を修正する
                    </div>

                    <div class="my-3">
                        入力して頂いた情報は、本学における感染対策に役立てる他、統計処理したうえで研究発表に用いさせて頂きます。
                    </div>

                    <div class="my-3">
                        ご賛同いただける方は、<br />以下よりメールアドレスを入力して下さい。
                    </div>
                </div>

                <v-btn class="pa-5"
                    color="#3DB0F3"
                    block
                    to="/Step1Input">
                    <span class="white--text">
                        メールアドレスを入力する
                    </span>
                </v-btn>

                <div class="px-3 text-right">
                    <div class="my-5">
                        <a href="#">本システムを用いた報告を望まない方は、こちら</a>
                    </div>
                    <div class="my-3">
                        問い合わせ先:<br />
                        北見工業大学 保健管理センター<br />
                        電話: xxxx-xxx-xxx<br />
                        メール: xxxxxxxx
                    </div>
                </div>
            </div>
        </v-main>
    </v-app>
</template>

<script>
</script>

<style>
</style>
