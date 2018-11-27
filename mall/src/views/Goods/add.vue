<template>
  <div>
    <Card title="商品添加">
      <Form ref="formData" :model="formData" :rules="ruleValidate"
        :label-width="80" label-position="right"
      >
        <FormItem prop="name" label="商品名">
          <Input type="text" v-model="formData.name" placeholder="商品名" />
        </FormItem>
        <FormItem prop="price" label="售价">
          <Input v-model.number="formData.price" placeholder="商品售价" />
        </FormItem>
        <FormItem prop="image" label="商品图片">
          <Input type="text" v-model="formData.image" placeholder="商品图片" />
        </FormItem>
        <FormItem>
          <Poptip placement="right" v-if="formData.image">
            <Button>图片预览</Button>
            <div class="api" slot="content">
              <img :src="formData.image" alt="">
            </div>
        </Poptip>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit">确定</Button>
          <Button @click="handleReset">重置</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import { validatePrice } from '@/utils/elValidate';
import { addGoodRequest } from '@/api/good'

export default {
  data() {
    return {
      formData: {
        name: '',
        price: '',
        image: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        price: [
          { required: true, validator: validatePrice, trigger: 'blur' }
          // { required: true, message: '请输入商品价格', trigger: 'change' }
        ],
        image: [
          { required: true, message: '请输入商品图片链接', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.addGood()
        }
      })
    },
    handleReset (name) {
      this.$refs.formData.resetFields();
    },
    async addGood() {
      const res = await addGoodRequest({
        ...this.formData
      })
      if (!res.errCodeTip) {
        this.$Message.success('添加商品成功！');
        this.handleReset()
      }
    }
  },
  props: {},
  created() {}
};
</script>

<style lang='scss' scoped>
.ivu-card {
  max-width: 800px;
  margin: 0 auto;
  img {
    max-width: 80vw;
    max-height: 80vh;
  }
}
</style>
