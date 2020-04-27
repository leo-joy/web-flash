import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/seal/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/seal',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/seal',
    method: 'delete',
    params: {
      id: id
    }
  })
}