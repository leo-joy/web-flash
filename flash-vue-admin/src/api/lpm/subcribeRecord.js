import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/lpm/subcribe/record/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/lpm/subcribe/record',
    method: 'post',
    params
  })
}

export function remove(id) {
  return request({
    url: '/lpm/subcribe/record',
    method: 'delete',
    params: {
      id: id
    }
  })
}
