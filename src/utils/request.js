import axios from 'axios'
import { baseURL, contentType, invalidCode, messageDuration, noPermissionCode, requestTimeout, successCode, debounce } from '@/config/settings'
import { Loading, Message } from 'element-ui'
import qs from 'qs'
import _ from 'lodash'

const service = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
})
let loadingInstance
service.interceptors.request.use(
  config => {
    /* 过滤所有为空、0、false的key */

    // if (config.data) {
    //   config.data = _.pickBy(config.data, _.identity)
    // }

    if (process.env.NODE_ENV !== 'test') {
      if (contentType === 'application/x-www-form-urlencoded;charset=UTF-8') {
        if (config.data && !config.data.param) {
          config.data = qs.stringify(config.data)
        }
      }
    }
    const needLoading = () => {
      let status = false
      debounce.forEach(item => {
        if (_.includes(config.url, item)) {
          status = true
        }
      })
      return status
    }
    if (needLoading()) {
      loadingInstance = Loading.service()
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

const errorMsg = message => {
  return Message({
    message: message,
    type: 'error',
    duration: messageDuration,
  })
}

service.interceptors.response.use(
  response => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    const { data, config } = response
    const { code, msg } = data
    if (code !== successCode) {
      console.log('codecodecode', code);
      switch (code) {
        case invalidCode:
          errorMsg(msg || `后端接口${code}异常`)
          break
        case noPermissionCode:
          errorMsg(msg + '，请重新登录！')
          // `没有权限访问`
          break
        default:
          errorMsg(msg || `后端接口${code}异常`)
          break
      }
      return Promise.reject('请求异常拦截:' + JSON.stringify({ url: config.url, code, msg }) || 'Error')
    } else {
      return data
    }
  },
  error => {
    if (loadingInstance) {
      loadingInstance.close()
    }
    /*网络连接过程异常处理*/
    let { message } = error
    if (message == 'Network Error') {
      message = '后端接口连接异常'
    }
    if (message.includes('timeout')) {
      message = '后端接口请求超时'
    }
    if (message.includes('Request failed with status code')) {
      message = '后端接口' + message.substr(message.length - 3) + '异常'
    }
    errorMsg(message || '后端接口未知异常')
    return Promise.reject(error)
  }
)
export default service
