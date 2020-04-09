<template>
  <div>
    <h3>注册账号</h3>
    <Form ref="formData" :model="formData" :rules="ruleInline" :label-width="80">
        <FormItem prop="userName" label="账号：">
          <Input type="text" v-model.trim="formData.userName" placeholder="请填写账号" />
        </FormItem>
        <FormItem prop="realName" label="昵称：">
          <Input type="text" v-model.trim="formData.realName" placeholder="请填写昵称" />
        </FormItem>
        <FormItem prop="password" label="密码：">
          <Input type="password" v-model="formData.password" placeholder="请填写密码" />
        </FormItem>
        <FormItem prop="gender" label="性别：">
          <RadioGroup v-model="formData.gender">
            <Radio :label="0">男</Radio>
            <Radio :label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="headImg" label="头像：">
          <RadioGroup v-model="formData.headImg" class="headImg">
            <Radio v-for="(item, index) in headList" :key="index" :label="item.url">
              <img :src="item.url" />
            </Radio>
          </RadioGroup>
        </FormItem>

        <FormItem prop="phone" label="验证码">
          <Input v-model.trim="formData.phone" placeholder="请输入手机号" style="width:200px" />
          <Button @click="sendCode">发送验证码</Button>
        </FormItem>

        <Button type="primary" @click="handleSubmit('formData')">注 册</Button>
      </Form>
  </div>
</template>

<script>
import { headList } from '@/assets/headList'
import { registerRequest, sendSmsRequest } from '@/api/user';

export default {
  data() {
    return {
      formData: {
        userName: '',
        realName: '',
        password: '',
        gender: '',
        headImg: '',
        phone: ''
      },
      ruleInline: {
        userName: [
          { required: true, message: '请填写账号' }
        ],
        realName: [
          { required: true, message: '请填写昵称' }
        ],
        password: [
          { required: true, message: '请填写密码' }
        ],
        gender: [
          { required: true, message: '请选择性别' }
        ],
        headImg: [
          { required: true, message: '请选择头像' }
        ],
        phone: [
          { required: true, message: '请填写手机号' }
        ],
      },
      headList: headList
    }
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await registerRequest(this.formData);
          if (!res.errCodeTip) {
            this.$Message.success('注册成功！');
            // this.realName = res.realName;
            // this.showModal = false;
          }
          console.log(this.formData)
        } else {
          this.$Message.error('请输入内容!');
        }
      })
    },
    async sendCode() {
      this.$refs.formData.validateField('phone');
      if (!this.formData.phone) { return this.$Message.error('请填写手机号!'); }
      const res = await sendSmsRequest(this.formData);
      if (!res.errCodeTip) {
        this.$Message.success('验证码已发送！已留意手机短信');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h3 {
  text-align: center;
  margin-bottom: 30px;
}
.ivu-form {
  width: 650px;
  margin: 0 auto;
}
.headImg {
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}
</style>
