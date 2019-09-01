<template>
  <div class="card-list" ref="content">
    <a-list
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="accounts"
    >
      <a-list-item slot="renderItem" slot-scope="item">
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
              <Button type="link">
                <a-icon type="edit"/>
              </Button>
              <Button type="link">
                <a-icon type="delete"/>
              </Button>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { getAccountList, createAccount, deleteAccount, updateAccount } from '@/api/balance'
import { Icon } from 'ant-design-vue'

export default {
  name: 'Index',
  data () {
    return {
      accounts: []
    }
  },
  created () {

  }
}
</script>

<style scoped>

</style>
