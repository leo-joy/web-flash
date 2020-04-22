import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/modifylog/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/modifylog',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/modifylog',
    method: 'delete',
    params: {
      id: id
    }
  })
}
