import Mock from 'mockjs2'
import { builder } from '../util'
const mockAccountData = [{
  'id': 4,
  'name': '招商银行借记卡',
  'gmt_transaction': '2019-08-31T22:02:00',
  'type': 1,
  'comment': '借记卡'
}, {
  'id': 3,
  'name': '招商银行信用卡',
  'gmt_transaction': '2019-08-31T22:02:00',
  'type': 2,
  'comment': '信用卡'
},
{
  'id': 2,
  'name': '交通银行信用卡',
  'gmt_transaction': '2019-08-31T22:02:00',
  'type': 2,
  'comment': '信用卡'
},
{
  'id': 1,
  'name': '现金',
  'gmt_transaction': '2019-08-31T22:04:04',
  'type': 1,
  'comment': '现金'
}]
const accountList = () => {
  return builder(mockAccountData)
}

const addAccount = (req) => {
  console.log('req')
  console.log(req)
  mockAccountData.push(JSON.parse(req.body))
  console.log(mockAccountData)
  return builder({}, 'success')
}

Mock.mock(/\/api\/v1\/account/, /get/i, accountList())
Mock.mock(/\/api\/v1\/account/, /post/i, addAccount)
