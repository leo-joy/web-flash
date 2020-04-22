import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/enterpriseinfo/list',
    method: 'get',
    params
  })
}

export function getEnterpriseList(params) {
  return request({
    url: '/lpm/enterpriseinfo/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/enterpriseinfo',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/enterpriseinfo',
    method: 'delete',
    params: {
      id: id
    }
  })
}
