import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/main/member/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/main/member',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/main/member',
    method: 'delete',
    params: {
      id: id
    }
  })
}
