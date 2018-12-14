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
        <Button type="primary" @click="handleSubmit('formData')">注 册</Button>
      </Form>
  </div>
</template>

<script>
import { headList } from '@/assets/headList'
import { registerRequest } from '@/api/user';

export default {
  data() {
    return {
      formData: {
        userName: '',
        realName: '',
        password: '',
        gender: '',
        headImg: '',
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
