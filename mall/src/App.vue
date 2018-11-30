<template>
  <div id="app">
    <Layout>
      <Header>
        <div class="user">
          <span>{{userName}}</span>
          <span @click="showModal=true" v-if="!userName">登录</span>
          <span @click="logOut" v-if="userName">退出登录</span>
          <router-link to="/goods/cart" v-if="userName" style="color: #fff">
            <Icon type="md-cart" :size="20" />
          </router-link>
        </div>
      </Header>
      <Content :style="{padding: '0 50px'}">
        <div id="nav">
          <router-link to="/">Home</router-link>
          <Divider type="vertical" />
          <router-link to="/goods/list">商品列表</router-link>
          <Divider type="vertical" />
          <router-link to="/goods/add">添加商品</router-link>
        </div>
        <router-view />
      </Content>
      <Footer class="layout-footer-center">2011-2016 &copy; TalkingData</Footer>
    </Layout>

    <Modal
      v-model="showModal"
      :mask-closable="false"
      width="300"
      title="登录"
    >
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="userName">
          <Input type="text" v-model.trim="formInline.userName" placeholder="请填写用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="userPwd">
          <Input type="password" v-model="formInline.userPwd" placeholder="请填写密码" @keyup.enter="handleSubmit">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formInline')">登 录</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { loginRequest, logoutRequest, checkLoginRequest } from '@/api/user';

export default {
  data() {
    return {
      userName: '',
      showModal: false,
      formInline: {
        userName: '',
        userPwd: ''
      },
      ruleInline: {
        userName: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.formInline.validate(async (valid) => {
        if (valid) {
          const res = await loginRequest(this.formInline);
          if (!res.errCodeTip) {
            this.$Message.success('登录成功！');
            this.userName = res.userName;
            this.showModal = false;
          }
        } else {
          this.$Message.error('请输入内容!');
        }
      })
    },
    async logOut() {
      const res = await logoutRequest();
      if (!res.errCodeTip) {
        this.userName = '';
        this.$Message.success('退出成功！');
        this.$router.push({ path: '/' })
      }
    },
    async checkLogin() {
      const res = await checkLoginRequest()
      if (!res.errCodeTip) {
        this.userName = res.userName
      }
    }
  },
  created() {
    this.checkLogin()
  },
}
</script>

<style lang="scss" scoped>
#nav {
  padding: 30px;
  text-align: center;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.ivu-layout-header {
  color: #fff;
  display: flex;
  justify-content: flex-end;
  .user {
    width: 200px;
    span {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
.ivu-layout-content {
  min-height: 80vh;
}
.ivu-layout-footer {
  text-align: center;
}
</style>
