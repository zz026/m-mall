<template>
  <Table
    stripe border size="small" highlight-row
    :loading="loading" :height="600"
    :columns="columns1" :data="tableList"
    @on-selection-change="selectionChange"
  />
</template>

<script>
import { getCartRequest, delCartRequest, editCartRequest } from '@/api/good';
import { elConfirm, elLoading } from '@/utils/tipTools';

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
      loading: false,
      tableList: [],
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
        _id: item._id
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
        _id: item._id,
        num: item.num,
      })
      loading.close()
      if (!res.errCodeTip) {
        this.getList()
      }
    },
    // 选择框改变事件
    selectionChange (item) {
      this.cartSelect = item;
      console.log(this.cartSelect)
    }
  },
  created() {
    this.getList()
  },
}
</script>
