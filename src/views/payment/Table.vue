<template>
  <a-card :bordered="false">
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData">
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="checkRecord(record)">check</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getRoleList, getPaymentHistory } from '@/api/manage'


export default {
  name: 'Table',
  components: {
    STable
  },
  data () {
    return {
      data: [],
      pagination: {},
      loading: false,
      columns: [
        {
          title: '日期',
          dataIndex: 'date'
        },
        {
          title: '金额',
          dataIndex: 'money'
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
            return res.result
          })
      }
    }
  },
  methods: {
    checkRecord (record) {
      console.log(record)
    }
  }
}
</script>

<style scoped>

</style>
