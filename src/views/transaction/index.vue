<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，欢迎记账~</div>
      <div>记账日期: {{ detail.gmt_create }}，事务编号：{{ detail.id }}， 状态：{{getTransactionStatus(detail.status) ? getTransactionStatus(detail.status).label : ""}}</div>
    </div>
    <div slot="extra">
      <a-button-group>
        <a-button>刷新</a-button>
        <a-button type="primary" @click="commit" v-if="detail.status == 0">保存</a-button>
      </a-button-group>
    </div>
    <div>
      <a-row :gutter="24">
        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="净资产" :total="'￥' + detail.rest_money">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <trend flag="up" style="margin-right: 16px;">
                <span slot="term">周同比</span>
                12%
              </trend>
              <trend flag="down">
                <span slot="term">日同比</span>
                11%
              </trend>
            </div>
          </chart-card>
        </a-col>

        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="资产" :total="'￥' + detail.asset">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <trend flag="up" style="margin-right: 16px;">
                <span slot="term">周同比</span>
                12%
              </trend>
              <trend flag="down">
                <span slot="term">日同比</span>
                11%
              </trend>
            </div>
          </chart-card>
        </a-col>

        <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="负债" :total="'￥' + detail.debt">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <trend flag="up" style="margin-right: 16px;">
                <span slot="term">周同比</span>
                12%
              </trend>
              <trend flag="down">
                <span slot="term">日同比</span>
                11%
              </trend>
            </div>
          </chart-card>
        </a-col>
      </a-row>

      <div class="card-list" ref="content">
        <div v-for="(typeItem, typeIndex) in types" :key="'type_div_' + typeIndex">
          <a-divider>{{ typeItem.label }}</a-divider>
          <a-list
            :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
            :dataSource="records"
          >
            <a-list-item slot="renderItem" slot-scope="item" v-if="item.account_type == typeItem.val">
              <template>
                <a-card :hoverable="true">
                  <a-card-meta>
                    <div style="margin-bottom: 3px" slot="title">{{ item.account_name }}</div>
                    <a-avatar
                      class="card-avatar"
                      slot="avatar"
                      src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
                      size="large"/>
                    <div class="meta-content" slot="description">
                      <div style="min-height: 50px;">
                        <template v-if="!item.id">
                          未记账
                        </template>
                        <template v-else>
                          当前金额：{{ item.money }}<br/>
                          记账时间：{{ item.gmt_create }}
                        </template>
                      </div>

                    </div>
                  </a-card-meta>
                  <template class="ant-card-actions" slot="actions">
                    <a-button type="link" @click="showModal(item)">
                      <a-icon type="edit"/>
                    </a-button>
                    <!--<a-popconfirm title="真的要删除该记录么?" @confirm="deleteRecord(item.id)" okText="Yes" cancelText="No">
                      <Button type="link">
                        <a-icon type="delete"/>
                      </Button>
                    </a-popconfirm>-->

                  </template>
                </a-card>
              </template>
            </a-list-item>
          </a-list>
        </div>

        <a-modal
          :visible="visibleModal"
          @ok="postRecord"
          @cancel="cancelRecord">
          <a-form>
            <a-form-item
              label="账户名"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }">
              <a-input placeholder="account name" v-model="record.account_name" disabled ref="accountNameInut">
              </a-input>
            </a-form-item>

            <a-form-item
              label="余额"
              :label-col="{ span: 5 }"
              :wrapper-col="{ span: 12 }">
              <a-input placeholder="当前余额" ref="record.money" v-model="record.money">
              </a-input>
            </a-form-item>
          </a-form>
        </a-modal>

      </div>

    </div>
  </page-view>

</template>

<script>
import { PageView } from '@/layouts'
import * as trService from '@/api/transaction'
import DetailList from '@/components/tools/DetailList'
import { ChartCard, Trend } from '@/components'
import { timeFix } from '@/utils/util'
const DetailListItem = DetailList.Item


export default {
  name: 'Index',
  components: {
    DetailList,
    DetailListItem,
    PageView,
    ChartCard,
    Trend
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: "https://tva1.sinaimg.cn/large/006y8mN6ly1g8bh86u34uj30b40b4aa4.jpg",
      loading: true,
      visibleModal: false,
      record: {
        id: 0,
        account_id: 0,
        transaction_id: 0,
        account_name: '',
        money: 0.0,
      },
      detail: {
        rest_money: 0.0,
        balance: 0.0,
        asset: 0,
        debt: 0,
        variation: 0.0,
        status: 1
      },
      types: [
        {
          val: 1,
          label: '资产'
        },
        {
          val: 2,
          label: '负债'
        }
      ],
      records: [],
      transactionId: 0
    }
  },
  created () {
    this.transactionId = this.$route.params.id
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      trService.getOne(this.transactionId).then(resp => {
        if(resp.status == 0) {
          this.detail = resp.result
          this.loading = false
        }
      })

      trService.getRecords(this.$route.params.id).then(resp => {
        console.log(resp)
        if(resp.status === 0) {
          this.records = resp.result
        }
      })
    },

    showModal (account) {
      this.record.id = account.id
      this.record.account_id = account.account_id
      this.record.account_name = account.account_name
      this.record.transaction_id = this.$route.params.id
      this.record.money = account.money
      console.log(account)
      console.log(this.record)
      this.visibleModal = true
    },

    postRecord () {
      var _t = this
      this.$confirm({
        content: '确认修改么？',
        onOk () {
          trService.createAccountRecord(_t.record).then(resp => {
            _t.init()
            _t.$message.info('记录成功')
            _t.visibleModal = false
          })
        },
        onCancel () {}
      })
    },
    cancelRecord () {
      this.visibleModal = false
    },
    getTypeDetail (id) {
      const td = getTypeDetail(id)
      console.log(td)
      return td
    },
    getTransactionStatus (id) {
      return trService.getTransactionStatus(id)
    },
    rollback () {
      trService.rollback(this.$route.params.id).then(resp => {
        this.$message.info('回滚成功')
        this.init()
      })
    },
    commit () {
      for(var i = 0; i < this.records.length; i++) {
        console.log(this.records[i].money)
        if(this.$lodash.isUndefined(this.records[i].money) || this.$lodash.isNull(this.records[i].money)) {
          this.$message.error("尚有账户未有记录！")
          return
        }
      }
      let _t = this
      this.$confirm({
        title: '确认',
        content: '确认提交该次记账么?',
        onOk() {
          trService.commit(_t.transactionId).then(resp => {
            _t.$message.info('保存成功')
            _t.init()
          })
        },
      })
    }
  }
}
</script>

<style scoped>

</style>
