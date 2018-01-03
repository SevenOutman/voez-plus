<template>
  <div class="vplus-login">
    <toast :show.sync="toast.show" :type="toast.type">{{ toast.text }}</toast>
    <div class="vplus-login-banner"></div>
    <group>
      <x-input title="账号" :value.sync="form.username" placeholder="兰空VOEZ 账号"
               :required="false"></x-input>
      <x-input title="密码" :value.sync="form.password" placeholder="兰空VOEZ 密码" type="password"
               :required="false"></x-input>
      <x-input title="邀请码" :value.sync="form.code" placeholder="8位邀请码" :show-clear="false" :max="8"
               :required="false"></x-input>
    </group>
    <divider style="font-size: 12px">您正在游玩的《兰空VOEZ》游戏将下线</divider>
    <div style="margin: 0 10px">
      <x-button type="primary" plain :disabled="submitButton.disabled" @click="submitLogin">
        <spinner type="dots" v-show="submitButton.disabled" style="fill: #04BE02; stroke: #04BE02"></spinner>
        <span v-show="!submitButton.disabled">{{ submitButton.text }}</span>
      </x-button>
    </div>
  </div>
</template>
<script type="text/babel">
  import Group from 'vux/src/components/group/index.vue'
  import XInput from 'vux/src/components/x-input/index.vue'
  import XButton from 'vux/src/components/x-button/index.vue'
  import Spinner from 'vux/src/components/spinner/index.vue'
  import Divider from 'vux/src/components/divider/index.vue'
  import Toast from 'vux/src/components/toast/index.vue'
  import vuexActions from '../../vuex/actions'

  export default {
    components: {
      Group,
      XInput,
      XButton,
      Spinner,
      Toast,
      Divider
    },
    data () {
      return {
        toast: {
          show: false,
          type: 'text',
          text: ''
        },
        form: {
          username: localStorage.getItem('auth_name') || '',
          password: '',
          code: ''
        },
        submitButton: {
          text: '登录『我的 VOEZ+』',
          disabled: false
        }
      }
    },
    vuex: {
      actions: vuexActions
    },
    methods: {
      formValidate () {
        return !!this.form.username && !!this.form.password
      },
      submitLogin () {
        if (this.formValidate()) {
          this.submitButton.disabled = true
          this.$http.post('account/login', this.form).then((response) => {
            let res = JSON.parse(response.body)
            this.submitButton.disabled = false
            if (res.result && res.code === 0) {
              if (res.info.auth_name && res.info.auth_token) {
                localStorage.setItem('auth_name', res.info.auth_name)
                localStorage.setItem('auth_token', res.info.auth_token)
              }
              this.storeUpdateUser(res.info.user)
              this.showToast('success', '登录成功')
              this.$dispatch('login:success')
            } else {
              this.showToast('warn', res.errmsg)
            }
          }, response => {
            this.submitButton.disabled = false
            this.showToast('cancel', '服务错误')
          })
        }
      },
      showToast (type, content) {
        this.toast.type = type
        this.toast.text = content
        this.toast.show = true
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .vplus-login {
    .vplus-login-banner {
      width: 100%;
      height: 0;
      padding-top: 56.25%;
      background: url('http://voez.sevenoutman.com/voez/cover/default/750') center;
      background-size: cover;

      & + * > .weui_cells {
        margin-top: 0;
      }
    }
  }
</style>
