import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/annals/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/annals',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/annals',
    method: 'delete',
    params: {
      id: id
    }
  })
}
