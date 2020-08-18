import request from '@/utils/request'
import Qs from 'qs'

export function getList(params) {
  return request({
    url: '/lpm/company/modify/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/company/modify',
    method: 'post',
    data: Qs.stringify(params) // 解决url中参数过长导致的414错误

  })
}

export function remove(id) {
  return request({
    url: '/lpm/company/modify',
    method: 'delete',
    params: {
      id: id
    }
  })
}
