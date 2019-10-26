import { axios } from '@/utils/request'

const api = {
  transactionUrl: '/v1/transaction',
  accountRecordUrl: '/v1/transaction/record'
}

const types = [
  {
    id: 1,
    label: '资产',
    avatar: 'https://tva1.sinaimg.cn/large/006y8mN6ly1g8bh86u34uj30b40b4aa4.jpg'
  },
  {
    id: 2,
    label: '负债',
    avatar: 'https://tva1.sinaimg.cn/large/006y8mN6ly1g8bh7zhoj0j30b40b43yi.jpg'
  }
]

const status = [
  {
    type: 0,
    label: '记账中'
  },
  {
    type: 1,
    label: '已完成'
  }
]

export default api

export function getUnrecordAccounts (transactionId) {
  return axios({
    url: api.transactionUrl + '/' + transactionId + '/unRecordAccounts',
    method: 'get'
  })
}

export function getRecordedAccounts (transactionId) {
  return axios({
    url: api.transactionUrl + '/' + transactionId + '/records',
    method: 'get'
  })
}

export function getOne (transactionId) {
  return axios({
    url: api.transactionUrl + '/' + transactionId ,
    method: 'get'
  })
}

export function createAccountRecord (body) {
  return axios({
    url: api.accountRecordUrl,
    method: 'post',
    data: body
  })
}

export function deleteAccountRecord (id) {
  return axios({
    url: api.accountRecordUrl + '/' + id,
    method: 'delete'
  })
}

export function getAll () {
  return axios({
    url: api.transactionUrl,
    method: 'get'
  })
}

export function getRecords (id) {
  return axios({
    url: api.transactionUrl + '/' + id + '/records',
    method: 'get'
  })
}

export function rollback (id) {
  return axios({
    url: api.transactionUrl + '/' + id + '/rollback',
    method: 'post'
  })
}

export function beginTransaction () {
  return axios({
    url: api.transactionUrl + '/begin',
    method: 'post'
  })
}

export function commit (id) {
  return axios({
    url: api.transactionUrl + '/' + id + '/commit',
    method: 'post'
  })
}

export function getTypeDetail (t) {
  for (var i = 0; i < types.length; i++) {
    if (types[i].id === t) {
      return types[i]
    }
  }
  return null
}

export function getTransactionStatus (trStatus) {
  for (var i = 0; i < status.length; i++) {
    if (status[i].type === trStatus) {
      return status[i]
    }
  }
  return null
}
