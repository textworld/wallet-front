import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const history = (options) => {
  console.log('options', options)

  const parameters = getQueryParameters(options)

  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)

  const records = [ {
    id: 1,
    date: '2019-05-21 11:34:32',
    money: 22.3
  } ]

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: 1,
    totalPage: 1,
    data: records
  })
}

Mock.mock(/\/api\/payment\/history/, 'get', history)