import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/fileMgr/list',
    method: 'get',
    params
  })
}

export function getEnterpriseFiles(params) {
  return request({
    url: '/fileMgr/enterpriseFiles',
    method: 'get',
    params
  })
}

export function getListIds(params) {
  return request({
    url: '/fileMgr/listIds',
    method: 'get',
    params
  })
}
