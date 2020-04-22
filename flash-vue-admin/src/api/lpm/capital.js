import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/capital/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/capital',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/capital',
    method: 'delete',
    params: {
      id: id
    }
  })
}
