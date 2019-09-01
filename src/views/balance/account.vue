<template>
  <div class="card-list" ref="content">
    <a-list
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="accounts"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed" @click="showModal">
            <a-icon type="plus"/>
            新增账户
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta>
              <div style="margin-bottom: 3px" slot="title">{{ item.name }}</div>
              <a-avatar
                class="card-avatar"
                slot="avatar"
                src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png"
                size="large"/>
              <div class="meta-content" slot="description">{{ item.comment }}</div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <Button type="link" @click="showAccountUpdate(item)">
                <a-icon type="edit"/>
              </Button>
              <Button type="link" @click="deleteAccount(item)">
                <a-icon type="delete"/>
              </Button>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>

    <collection-create-form
      ref="collectionForm"
      :visible="visibleOfCreate"
      @cancel="handleCancel"
      @create="handleCreate"
    />

    <a-modal
      title="Title"
      :visible="visibleOfUpdate"
      @ok="handleAccountUpdate"
      :confirmLoading="loadingOfUpdate"
      @cancel="cancelAccountUpdate"
    >
      <a-form>
        <a-form-item
          label="账户名字"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input placeholder="account name" v-model="updateAccount.name" ref="accountNameInut">
          </a-input>
        </a-form-item>
        <a-form-item
          label="账户描述"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input placeholder="account comment" v-model="updateAccount.comment" ref="accountNameInut">
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script>
import { getAccountList, createAccount, deleteAccount, updateAccount } from '@/api/balance'
import { Icon } from 'ant-design-vue'

const CollectionCreateForm = {
  props: ['visible', 'account'],
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  template: `
  <a-modal
    :visible="visible"
    title='创建新账户'
    okText='Create'
    @cancel="() => { $emit('cancel') }"
    @ok="() => { $emit('create') }"
  >
    <a-form layout='vertical' :form="form">
      <a-form-item label='账户名'>
        <a-input
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '请输入账户名!' }],
            }
          ]"
        />
      </a-form-item>
      <a-form-item label='描述'>
        <a-input
          type='textarea'
          v-decorator="['comment']"
        />
      </a-form-item>
      <a-form-item class='collection-create-form_last-form-item'>
        <a-radio-group
          v-decorator="[
            'type',
            {
              initialValue: 'asset',
            }
          ]"
        >
            <a-radio value='asset'>资产</a-radio>
            <a-radio value='debt'>负债</a-radio>
          </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
`
}

export default {
  name: 'Account',
  components: { Icon, CollectionCreateForm },
  data () {
    return {
      description: '段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态， 提供跨越设计与开发的体验解决方案。',
      linkList: [
        { icon: 'rocket', href: '#', title: '快速开始' },
        { icon: 'info-circle-o', href: '#', title: '产品简介' },
        { icon: 'file-text', href: '#', title: '产品文档' }
      ],
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      accounts: [],
      visibleOfCreate: false,
      modalAccount: {},

      visibleOfUpdate: false,
      updateAccount: {
        name: '',
        comment: '',
        id: 0
      },
      loadingOfUpdate: false
    }
  },
  created () {
    this.reload()
  },
  methods: {
    reload () {
      getAccountList().then(resp => {
        this.accounts.splice(0, this.accounts.length)
        this.accounts.push(null)
        for (var i = 0; i < resp.result.length; i++) {
          this.accounts.push(resp.result[i])
        }
        console.log(resp)
      })
    },
    showModal () {
      this.visibleOfCreate = true
    },
    handleCancel () {
      this.visibleOfCreate = false
    },
    handleCreate () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', values)
        createAccount(values).then(resp => {
          this.reload()
        })
        form.resetFields()
        this.visibleOfCreate = false
      })
    },
    showAccountUpdate (item) {
      this.updateAccount = this.$lodash.cloneDeep(item)
      this.visibleOfUpdate = true
    },
    handleAccountUpdate () {
      var _t = this
      this.$confirm({
        title: '确定更新账户么？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          _t.visibleOfUpdate = false
          updateAccount(_t.updateAccount).then(resp => {
            _t.$message.info(resp.message)
            _t.reload()
          })
        }
      })
    },
    cancelAccountUpdate () {
      console.log('update cancel')
      this.visibleOfUpdate = false
    },
    deleteAccount (account) {
      var _t = this
      this.$confirm({
        title: '确定删除账户：' + account.name + '?',
        content: '删除操作不可逆',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          deleteAccount(account.id).then(resp => {
            _t.$message.info(resp.message)
            _t.reload()
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;
    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
