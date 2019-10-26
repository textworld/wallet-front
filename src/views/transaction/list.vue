<template>
  <div>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="记账">

      <a-button slot="extra" type="primary" @click="createTransaction">新增</a-button>

      <a-table :columns="columns" :dataSource="trList" rowKey="id">
        <span slot="status" slot-scope="status">
          {{ getTransactionStatus(status) }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template v-if="record.status == 0">
            <a-button-group>
              <a-button size="small" @click="toIndex(record.id)">记账</a-button>
              <a-button size="small" @click="commit(record.id)">提交</a-button>
              <a-button size="small" @click="showUpdateTimeModal = true">修改记账时间</a-button>
            </a-button-group>
          </template>
          <template v-if="record.status == 1">
            <a-button-group>
              <a-button size="small" @click="toIndex(record.id)">查看</a-button>
            </a-button-group>

          </template>
        </span>

      </a-table>

    </a-card>
  </div>
</template>

<script>
import HeadInfo from '@/components/tools/HeadInfo'
import * as trService from '@/api/transaction'
const columns = [
  {
    title: '时间',
    dataIndex: 'gmt_create',
    key: 'gmt_create'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '资产',
    dataIndex: 'asset',
    key: 'asset'
  },
  {
    title: '负债',
    dataIndex: 'debt',
    key: 'debt'
  },
  {
    title: '净资产',
    dataIndex: 'rest_money',
    key: 'rest_money'
  },
  {
    title: '变化',
    dataIndex: 'variation',
    key: 'variation'
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'StandardList',
  components: {
    HeadInfo
  },
  data () {
    return {
      showUpdateTimeModal: false,
      pagination: {},
      loading: false,
      trList: [
        {
          id:0,
          gmt_create: '2019-10-10 00:00:00',
          status: 0,
          asset: 78923.0,
          debt: 2236.4,
          rest_money: 75434.5,
          variation: 1344
        }
      ],
      columns
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      trService.getAll().then(resp => {
        this.trList.splice(0, this.trList.length)
        this.$lodash.forEach(resp.result, item => {
          this.trList.push(item)
        })
      })
    },
    getTransactionStatus (t) {
      return trService.getTransactionStatus(t).label
    },
    createTransaction () {
      trService.beginTransaction().then(resp => {
        console.log(resp)
        this.$message.info('创建成功')
        this.loadData()
      })
    },
    toIndex (id) {
      this.$router.push({
        path: '/transaction/' + id
      })
      console.log("tz")
      console.log(id)
    },
    commit (trId) {
      let _t = this
      this.$confirm({
        title: '确认',
        content: '确认提交该次记账么?',
        onOk() {
          trService.commit(trId).then(resp => {
            _t.$message.info('保存成功')
            _t.init()
          })
        },
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
  }

  .list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span {
      line-height: 20px;
    }
    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
  }
</style>
