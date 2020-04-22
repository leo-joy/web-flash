import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/property/pledge/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/property/pledge',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/property/pledge',
    method: 'delete',
    params: {
      id: id
    }
  })
}
