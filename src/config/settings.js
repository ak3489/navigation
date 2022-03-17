/**
 * @copyright
 * @description 全局变量配置
 */
module.exports = {
  // 默认的接口地址 如果是开发环境和生产环境可以用本地地址，当然你也可以选择自己配置成需要的接口地址 // 还需要改 main-prod.js 中的redirectUri
  baseURL: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'preview' ? 'http://127.0.0.1:8072' : 'https://api.momen.vip',
  //配后端数据的接收方式application/json;charset=UTF-8或者application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
  //消息框消失时间
  messageDuration: 3000,
  //最长请求时间
  requestTimeout: 5000,
  //操作正常code
  successCode: 200,
  //登录失效code
  invalidCode: 402,
  //无权限code
  noPermissionCode: 401,
  //需要加loading层的请求，防止重复提交
  debounce: ['edit', 'send'],
}
