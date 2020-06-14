import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/sys/interface/manage/list',
        method: 'get',
        params
    })
}


export function save(params) {
    return request({
        url: '/sys/interface/manage',
        method: 'post',
        params
    })
}

export function remove(id) {
    return request({
        url: '/sys/interface/manage',
        method: 'delete',
        params: {
            id: id
        }
    })
}
