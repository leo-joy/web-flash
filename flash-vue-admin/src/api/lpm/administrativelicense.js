import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/administrative/license/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/administrative/license',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/administrative/license',
    method: 'delete',
    params: {
      id: id
    }
  })
}
