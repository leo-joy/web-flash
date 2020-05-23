import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/tallage/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/tallage',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/tallage',
    method: 'delete',
    params: {
      id: id
    }
  })
}
