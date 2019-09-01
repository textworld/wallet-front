import { axios } from '@/utils/request'

const api = {
  accountList: '/v1/account'
}

export default api

export function getAccountList (parameter) {
  return axios({
    url: api.accountList,
    method: 'get',
    params: parameter
  })
}

export function createAccount (body) {
  return axios({
    url: api.accountList,
    method: 'post',
    data: body
  })
}

export function deleteAccount (accountId) {
  return axios({
    url: api.accountList + '/' + accountId,
    method: 'delete'
  })
}

export function updateAccount (account) {
  return axios({
    url: api.accountList + '/' + account.id,
    method: 'put',
    data: account
  })
}
