import axios from "axios"

const request = axios.create({
    baseURL: '/api',
    timeout: 600000
})

// axios响应
request.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        return Promise.reject(error)
    }
)

export default request