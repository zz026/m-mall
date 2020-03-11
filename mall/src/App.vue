<template>
  <div id="app">
    <Layout>
      <Header>
        <div class="user">
          <span>{{realName}}</span>
          <span @click="showModal=true" v-if="!realName">登录</span>
          <span @click="logOut" v-if="realName">退出登录</span>
          <router-link to="/goods/cart" v-if="realName" style="color: #fff">
            <Icon type="md-cart" :size="20" />
          </router-link>
        </div>
      </Header>
      <Content>
        <div id="nav">
          <router-link to="/">Home</router-link>
          <Divider type="vertical" />
          <router-link to="/goods/list">商品列表</router-link>
          <Divider type="vertical" />
          <router-link to="/goods/add">添加商品</router-link>
        </div>
        <router-view />
      </Content>
      <Footer class="layout-footer-center">
        <div>2019 &copy; 郑威威的商城</div>
        <a href="http://www.beian.miit.gov.cn">粤ICP备18043661号</a>
      </Footer>
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
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="请填写密码" @keyup.enter="handleSubmit">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="goRegister">立即注册</Button>
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
      realName: '',
      showModal: false,
      formInline: {
        userName: '',
        password: ''
      },
      ruleInline: {
        userName: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 去注册
    goRegister() {
      this.showModal = false;
      this.$router.push({ path: '/register' })
    },
    handleSubmit () {
      this.$refs.formInline.validate(async (valid) => {
        if (valid) {
          const res = await loginRequest(this.formInline);
          if (!res.errCodeTip) {
            this.$Message.success('登录成功！');
            this.realName = res.realName;
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
        this.realName = '';
        this.$Message.success('退出成功！');
        this.$router.push({ path: '/' })
      }
    },
    async checkLogin() {
      const res = await checkLoginRequest()
      if (!res.errCodeTip) {
        this.realName = res.realName
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
