<template>
  <div>
    <Button type="primary" @click="sumbitOrders">提交订单</Button>
    <Tag type="dot" color="primary" class="fr">总计：{{total}} 元</Tag>
    <Table
      stripe border size="small" highlight-row
      :loading="loading" :height="600"
      :columns="columns1" :data="tableList"
      @on-selection-change="selectionChange"
    />
  </div>
</template>

<script>
import { getCartRequest, delCartRequest, editCartRequest } from '@/api/good';
import { elConfirm, elLoading } from '@/utils/tipTools';
import { orderSubmitRequest } from '@/api/order'

export default {
  data() {
    return {
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品名',
          align: 'center',
          key: 'name'
        },
        {
          title: '图片',
          align: 'center',
          key: 'image',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.image, style: 'width: 100px;height: 100px;border-radius: 2px;'
              }
            });
          }
        },
        {
          title: '价格',
          align: 'center',
          key: 'price'
        },
        {
          title: '数量',
          align: 'center',
          key: 'num',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                min: 1,
                max: 10,
                value: params.row.num,
                size: 'small'
              },
              on: {
                'on-change': (val) => {
                  // that.tableList[params.index].num = val
                  params.row.num = val
                  this.handleChangeNum(params.row)
                }
              }
            });
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'md-remove-circle',
              },
              on: {
                click: () => {
                  this.handleDelect(params.row)
                }
              }
            }, '删除')
          }
        }
      ],
      loading: false,
      // 表格
      tableList: [],
      // 总价
      total: 0,
      // 表格选中内容
      cartSelect: []
    }
  },
  methods: {
    // 获取列表
    async getList () {
      this.loading = true;
      const res = await getCartRequest()
      this.loading = false;
      if (!res.errCodeTip) {
        this.tableList = res.list
      }
    },
    // 删除商品
    async handleDelect (item) {
      await elConfirm(`确认删除 ${item.name} ? `)
      const res = await delCartRequest({
        id: item.id
      });
      if (!res.errCodeTip) {
        this.$Message.success(`${item.name}删除成功！`);
        this.getList()
      }
    },
    // 编辑商品数量
    async handleChangeNum (item) {
      const loading = elLoading()
      const res = await editCartRequest({
        id: item.id,
        num: item.num,
      })
      loading.close()
      if (!res.errCodeTip) {
        this.getList()
      }
    },
    // 选择框改变事件
    selectionChange (item) {
      let total = 0
      this.cartSelect = item.map(val => {
        total = val.price * val.num;
        return {
          id: val.id,
          num: val.num
        }
      });
      this.total = total
    },
    // 提交订单
    async sumbitOrders() {
      if (!this.cartSelect.length) return this.$Message.warning(`请先勾选商品！`);
      const res = await orderSubmitRequest({
        orderList: this.cartSelect
      });
      if (!res.errCodeTip) {
        console.log(res)
        this.$Message.success('订单创建成功!')
        this.$router.push({ path: '/order/detail/' + res.orderId })
      }
    }
  },
  created() {
    this.getList()
  },
}
</script>
