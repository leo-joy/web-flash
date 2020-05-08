import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/lpm/company/modify/list',
        method: 'get',
        params
    })
}


export function save(params) {
    return request({
        url: '/lpm/company/modify',
        method: 'post',
        params
    })
}

export function remove(id) {
    return request({
        url: '/lpm/company/modify',
        method: 'delete',
        params: {
            id: id
        }
    })
}
