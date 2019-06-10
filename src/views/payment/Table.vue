<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option :value="0">未记录</a-select-option>
                <a-select-option :value="1">已记录</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData">
      <span slot="date" slot-scope="text">
        {{ text.substring(0, 10) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="setRecordStatus(record, 1)" v-if="record['status'] == 0"><a-icon type="check" /></a>
          <a-divider type="vertical" />
          <a @click="setRecordStatus(record, 2)" v-if="record['status'] == 0"><a-icon type="stop" /></a>
          <a @click="setRecordStatus(record, 0)" v-if="record['status'] != 0"><a-icon type="rollback" /></a>
        </template>
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="source" slot-scope="text">
        {{ text | sourceFilter }}
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getPaymentHistory, updatePaymentHistory } from '@/api/manage'

const statusMap = {
  0: {
    status: 'warning',
    text: '未记录'
  },
  1: {
    status: 'success',
    text: '已记录'
  },
  2: {
    status: 'error',
    text: '略过'
  }
}

const sourceMap = {
  'alipay': {
    text: '支付宝'
  }
}
export default {
  name: 'Table',
  components: {
    STable
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        status: 0
      },
      data: [],
      pagination: {},
      loading: false,
      columns: [
        {
          title: '日期',
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '金额',
          dataIndex: 'money'
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '交易状态',
          dataIndex: 'trade_status'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '来源',
          dataIndex: 'source',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getPaymentHistory(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
            return res
          })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    sourceFilter (source) {
      return sourceMap[source].text
    }
  },
  methods: {
    setRecordStatus (record, status) {
      console.log(record)
      record['status'] = status
      updatePaymentHistory(record).then(res => {
        console.log(res)
        this.$refs.table.refresh(false)
      })
    }
  }
}
</script>

<style scoped>

</style>
