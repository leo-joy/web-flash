import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/three/meeting/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/three/meeting',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/three/meeting',
    method: 'delete',
    params: {
      id: id
    }
  })
}