<template>
  <div>
    <Table
      stripe border size="small" highlight-row
      :loading="loading" :height="600"
      :columns="columns1" :data="tableList"
    />
  </div>
</template>

<script>
import { getOrderListRequest, changeOrderStatusRequest, removeOrderRequest } from '@/api/order'
import { elConfirm } from '@/utils/tipTools';

export default {
  data() {
    return {
      loading: false,
      tableList: [],
      columns1: [
        {
          title: '订单号',
          align: 'center',
          key: 'id'
        },
        {
          title: '收货地址',
          align: 'center',
          key: 'address',
          render: (h, params) => {
            const { province, city, area, address } = params.row.addressInfo;
            return h('span', {
              attrs: {
              }
            }, province + ' ' + city + ' ' + area + ' ' + address)
          }
        },
        {
          title: '收货人',
          align: 'center',
          key: 'name',
          render: (h, params) => {
            return h('span', {
              attrs: {
                style: 'color: red'
              }
            }, params.row.addressInfo.name)
          }
        },
        {
          title: '订单总价',
          align: 'center',
          key: 'totalprice'
        },
        {
          title: '订单状态',
          align: 'center',
          key: 'status',
          render: (h, params) => {
            // 1待支付 2 支付成功 3支付超时 4 取消订单
            const statusFilter = {
              1: {
                value: '待支付',
                color: 'primary'
              },
              2: {
                value: '支付成功',
                color: 'success'
              },
              3: {
                value: '支付超时',
                color: 'warning'
              },
              4: {
                value: '取消订单',
                color: 'error'
              },
            }
            return h('Tag', {
              props: {
                color: statusFilter[params.row.status].color,
                type: 'border',
              }
            }, statusFilter[params.row.status].value)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.changeStatus(params.row, 2, '支付成功')
                  }
                }
              }, '支付成功'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.changeStatus(params.row, 4, '取消订单')
                  }
                }
              }, '取消订单'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleRemove(params.row)
                  }
                }
              }, '删除订单')
            ]);
          }
        }
      ],
    };
  },
  methods: {
    async getList() {
      this.loading = true;
      const res = await getOrderListRequest()
      this.loading = false;
      if (!res.errCodeTip) {
        this.tableList = res.list
      }
    },
    async changeStatus(item, status, msg) {
      await elConfirm(`确认${msg} ?`)
      const res = await changeOrderStatusRequest(
        {
          orderId: item.id,
          status
        }
      )
      if (!res.errCodeTip) {
        console.log('res', res)
        this.$Message.success(`订单修改成功！`);
        this.getList()
      }
    },
    async handleRemove(item) {
      await elConfirm(`确认删除订单 ${item.id} ?`)
      const res = await removeOrderRequest(
        {
          orderId: item.id
        }
      )
      if (!res.errCodeTip) {
        console.log('res', res)
        this.$Message.success(`订单删除成功！`);
        this.getList()
      }
    },
  },
  filters: {},
  props: {},
  created() {
    this.getList()
  },
};
</script>

<style lang='scss' scoped>
</style>
