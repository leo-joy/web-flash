import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/administrative/punish/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/administrative/punish',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/administrative/punish',
    method: 'delete',
    params: {
      id: id
    }
  })
}
