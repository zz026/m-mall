<template>
  <div>
    <Button type="primary" @click="openModal">提交订单</Button>
    <Tag type="dot" color="primary" class="fr">总计：{{total}} 元</Tag>
    <Table
      stripe border size="small" highlight-row
      :loading="loading" :height="600"
      :columns="columns1" :data="tableList"
      @on-selection-change="selectionChange"
    />
    <Modal
      v-model="showModal"
      :mask-closable="false"
      width="600"
      title="订单地址"
    >
      <Form ref="formData" :model="formData" :rules="ruleInline" :label-width="80">
        <FormItem prop="name" label="收货人">
          <Input type="text" v-model.trim="formData.name" placeholder="请填写收货人" />
        </FormItem>
        <FormItem prop="phone" label="电话">
          <Input type="text" v-model.trim="formData.phone" placeholder="请填写收货电话" />
        </FormItem>
        <FormItem prop="area" label="地区">
          <v-distpicker :province="formData.province" :city="formData.city" :area="formData.area" @selected="onSelected" />
        </FormItem>
        <FormItem prop="address" label="收货地址">
          <Input type="textarea" :rows="4" v-model.trim="formData.address" placeholder="请填写收货地址" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formData')">确 认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getCartRequest, delCartRequest, editCartRequest } from '@/api/good';
import { elConfirm, elLoading } from '@/utils/tipTools';
import { checkMobile } from '@/utils/elValidate';
import { orderSubmitRequest } from '@/api/order'
import VDistpicker from 'v-distpicker'

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
                src: params.row.image, style: 'margin: 10px 0;width: 100px; height: 80px;border-radius: 2px;'
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
      showModal: false,
      // 表格选中内容
      cartSelect: [],
      formData: {
        name: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: ''
      },
      ruleInline: {
        name: [
          { required: true, message: '请填写收货人', trigger: 'blur' },
          { max: 10, message: '长度最多为10', trigger: 'blur' },
        ],
        phone: [
          // { required: true, message: '请填写收货电话', trigger: 'blur' },
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择地区', trigger: 'change' },
          { max: 10, message: '长度最多为10', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请填写收货地址', trigger: 'blur' },
          { max: 50, message: '长度最多为50', trigger: 'blur' },
        ],
      }
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
    // 打开模态框
    openModal () {
      if (!this.cartSelect.length) return this.$Message.warning(`请先勾选商品！`);
      this.handleReset()
      this.showModal = true
    },
    // 地区选择器选择事件
    onSelected(data) {
      this.formData.province = data.province.value;
      this.formData.city = data.city.value;
      this.formData.area = data.area.value;
    },
    // 提交订单
    handleSubmit () {
      if (!this.cartSelect.length) return this.$Message.warning(`请先勾选商品！`);
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (!this.formData.province || !this.formData.city || !this.formData.area) {
            return this.$Message.warning('请选择地区')
          }
          this.sumbitOrders()
        } else {
          this.$Message.error('请输入内容!');
        }
      })
    },
    // 重置表单
    handleReset () {
      this.$refs.formData.resetFields();
      this.formData.province = '';
      this.formData.city = '';
      this.formData.area = '';
    },
    // 提交订单
    async sumbitOrders() {
      const loading = elLoading()
      const res = await orderSubmitRequest({
        orderList: this.cartSelect,
        ...this.formData
      });
      loading.close()
      if (!res.errCodeTip) {
        this.showModal = false;
        this.$Message.success('订单创建成功!')
        this.$router.push({ path: '/order/detail/' + res.orderId })
      }
    }
  },
  created() {
    this.getList()
  },
  components: { VDistpicker }
}
</script>
