<template>
  <div>
    <Form ref="formData" :model="formData" inline>
        <FormItem prop="name">
          <Input type="text" v-model="formData.name" placeholder="商品名" />
        </FormItem>
        <FormItem prop="minPrice">
          <Input type="text" v-model="formData.minPrice" placeholder="最小值" />
        </FormItem>
        <FormItem prop="maxPrice">
          <Input type="text" v-model="formData.maxPrice" placeholder="最大值" />
        </FormItem>
        <FormItem prop="sort" label="价格：" :label-width="60">
          <RadioGroup v-model="formData.sort">
            <Radio :label="-1">高→低</Radio>
            <Radio :label="1">低→高</Radio>
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
          <p slot="title">{{item.name}}</p>
          <img :src="item.image" :alt="item.name">
          <p>{{item.price}} 元</p>
          <Button type="primary" icon="ios-add-circle-outline"
            size="small" @click="addCart(item)"
          >加入购物车</Button>
        </Card>
      </Col>
    </Row>
    <Page :total="pageConfig.total" :page-size="pageConfig.pageSize" @on-change="pageChange" v-if="list.length" />
  </div>
</template>

<script>
import { queryGoodsListRequest, addCartRequest } from '@/api/good';

export default {
  data() {
    return {
      list: [],
      formData: {
        name: '',
        minPrice: '',
        maxPrice: '',
        sort: -1,
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
        id: item.id,
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
  text-align: center;
  img {
    width: 100px;
    height: 100px;
  }
  .ivu-btn {
    margin: 10px 0;
  }
}
.ivu-btn {
  margin-right: 10px;
}

</style>
