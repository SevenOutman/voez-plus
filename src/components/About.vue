<template>
    <div class="vplus-about">
        <article>
            <h2>关于 VOEZ+</h2>
            <p>VOEZ+ （下称『本站』）由薊开发建设，不是《兰空VOEZ》游戏的开发及运营团队所授权的官方站点。</p>
            <p>浏览器的隐私模式/无痕模式可能影响本站部分功能的正常使用。</p>
            <p>iOS 用户请将本站添加到主屏幕，随时获取最新版本。</p>
            <p>使用中遇到的问题或建议欢迎随时向薊反馈。</p>

            <h2>关于『我的 VOEZ+』</h2>
            <p>您可以使用您的 VOEZ 账号登录本站，并使用『我的VOEZ+』功能（邀请测试中）。</p>
            <p>使用您的 VOEZ 账号进行登录，即代表您已知晓并同意以下条款。</p>
            <p>1. 本站将会记录、存储您的 VOEZ 账号和密码。</p>
            <p>2. 本站不会冒用您的信息，不会使用您的 VOEZ 账号和密码进行除您在本站手动操作范围以外的任何活动。</p>
            <p>3. 登录将会占用您 VOEZ 账号的绑定设备数。</p>
            <p>4. 您知晓以下风险并将自行承担可能带来的后果：</p>
            <p>本站遭到第三方攻击而造成您的 VOEZ 账号和密码泄露。</p>
            <p>VOEZ 官方的接口改变而导致本站部分或全部功能无法继续使用。</p>

            <h2>关于『关于』</h2>
            <p>本站仍在持续开发建设中，此『关于』条款随时会发生变更和修订。</p>
            <p>本站将在每次『关于』内容变化之时于首页通知您，您继续使用本站即代表您已阅读、知晓并同意最新的『关于』。</p>
        </article>
    </div>
</template>
<script>
    export default {
        route: {
            activate() {
                localStorage.setItem('lastabout', Date.now())
            }
        }
    }
</script>
<style lang="less" rel="stylesheet/less">
    .vplus-about {
        box-sizing: border-box;
        padding: 10px 15px 30px;
        color: #000000;
        background-color: #ffffff !important;
        h2 {
            font-size: 18px;
            text-align: center;
            margin-top: 15px;
            margin-bottom: 10px;
        }
        p {
            margin-top: 1em;
            font-size: 14px;
        }
    }
    .detail-box {
        .vplus-about {
            padding: 15px 30px 30px;
        }
    }
</style>