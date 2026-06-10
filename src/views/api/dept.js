import request from '@/views/utils/request'

// 查询全部部门信息
export const queryAllApi = ()=>{
    return request.get('/depts')
} 

// 添加部门
export const addDeptApi = (dept) => {
    return request.post('/depts', dept)
}

// 根据id查询部门
export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`)
}

// 修改部门
export const updateDeptByIdApi = (dept)  => {
    return request.put('/depts', dept)
}

// 删除部门
export const deleteByIdApi = (id) => {
    return request.delete(`/depts?id=${id}`)
}