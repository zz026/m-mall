<template>
  <div>
    <div>商品列表</div>
    <Form ref="formData" :model="formData" inline>
        <FormItem prop="productName">
          <Input type="text" v-model="formData.productName" placeholder="商品名" />
        </FormItem>
        <FormItem prop="minPrice">
          <Input type="text" v-model="formData.minPrice" placeholder="最小值" />
        </FormItem>
        <FormItem prop="maxPrice">
          <Input type="text" v-model="formData.maxPrice" placeholder="最大值" />
        </FormItem>
        <FormItem prop="sort">
          <RadioGroup v-model="formData.sort">
            <Radio :label="1">正序</Radio>
            <Radio :label="-1">倒序</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formData')">搜索</Button>
          <Button @click="handleReset('formData')">重置</Button>
        </FormItem>
    </Form>
    <Row style="background:#eee;padding:20px">
      <Col span="5" offset="1" v-for="item in list" :key="item.productId">
        <Card shadow>
          <p slot="title">{{item.productName}}</p>
          <img :src="item.productImage" :alt="item.productName">
          <p>{{item.salePrice}} 元</p>
          <Button type="primary" icon="ios-add-circle-outline"
            size="small" @click="addCart(item)"
          >加入购物车</Button>
        </Card>
      </Col>
    </Row>
    <Page :total="pageConfig.total" :page-size="pageConfig.pageSize" @on-change="pageChange" />
  </div>
</template>

<script>
import { queryGoodsListRequest, addCartRequest } from '@/api/good';

export default {
  data() {
    return {
      list: [],
      formData: {
        productName: '',
        minPrice: '',
        maxPrice: '',
        sort: 1,
      },
      pageConfig: {
        pageIndex: 1,
        pageSize: 8,
      }
    }
  },
  methods: {
    pageChange(pageIndex) {
      this.pageConfig.pageIndex = pageIndex;
      this.getList()
    },
    async getList() {
      const res = await queryGoodsListRequest({
        pageIndex: this.pageConfig.pageIndex,
        pageSize: this.pageConfig.pageSize,
        ...this.formData
      })
      if (!res.errCodeTip) {
        this.list = res.list;
        this.pageConfig = res.pageConfig;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.getList()
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
      this.getList()
    },
    async addCart(item) {
      const res = await addCartRequest({
        productId: item.productId,
      })
      if (!res.errCodeTip) {
        this.$Message.success('添加购物车成功！');
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.ivu-col {
  margin-bottom: 20px;
}
.ivu-btn {
  margin-right: 10px;
}
.ivu-page {
  margin: 20px 0;
}
</style>
