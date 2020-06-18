import request from '@/utils/request'

export function tree() {
  return request({
    url: '/org/tree',
    method: 'get'
  })
}

export function list() {
  return request({
    url: '/org/list',
    method: 'get'
  })
}

export function save(params) {
  return request({
    url: '/org',
    method: 'post',
    params: params
  })
}

export function del(id) {
  return request({
    url: '/org',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function parentorg(id) {
  return request({
    url: '/org/parentorg',
    method: 'get',
    params: {
      id: id
    }
  })
}
