import request from '@/utils/request'
import Qs from 'qs'

export function getList(params) {
  return request({
    url: '/lpm/businesslicense/haslist',
    method: 'post',
    data: Qs.stringify(params) // 解决url中参数过长导致的400错误
  })
  // return request({
  //   url: '/lpm/businesslicense/list',
  //   method: 'get',
  //   params
  // })
}

export function hasList(params) {
  return request({
    url: '/lpm/businesslicense/haslist',
    method: 'post',
    data: Qs.stringify(params) // 解决url中参数过长导致的400错误
  })
}

export function getOne(params) {
  return request({
    url: '/lpm/businesslicense/one',
    method: 'get',
    params
  })
}

// 修改后
export function save(params) {
  return request({
    url: '/lpm/businesslicense',
    method: 'post',
    data: Qs.stringify(params) // 解决url中参数过长导致的400错误
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  })
}

export function remove(id) {
  return request({
    url: '/lpm/businesslicense',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function get(id) {
  return request({
    url: '/lpm/businesslicense',
    method: 'get',
    params: {
      id: id
    }
  })
}

