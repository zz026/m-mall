<template>
  <Table :columns="columns1" :data="tableList" />
</template>

<script>
import { getCartRequest, delCartRequest } from '@/api/good'

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
          key: 'productName'
        },
        {
          title: '图片',
          key: 'productImage',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.productImage, style: 'width: 100px;height: 100px;border-radius: 2px;'
              }
            });
          }
        },
        {
          title: '价格',
          key: 'salePrice'
        },
        {
          title: '数量',
          key: 'productNum',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                max: 10,
                value: params.row.productNum,
                size: 'small'
              }
            });
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'primary',
                size: 'small'
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
      tableList: []
    }
  },
  methods: {
    async getList() {
      const res = await getCartRequest()
      if (!res.errCodeTip) {
        console.log(res)
        this.tableList = res.list
      }
    },
    async handleDelect(item) {
      console.log('item', item)
      const res = await delCartRequest({
        productId: item.productId
      });
      if (!res.errCodeTip) {
        console.log(res)
      }
    }
  },
  created() {
    this.getList()
  },
}
</script>
