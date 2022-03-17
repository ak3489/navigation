import request from '@/utils/request'

let accessToken = localStorage.getItem('accessToken');

// 获取站点列表
export function getSiteList(params) {
  return request({
    url: '/link/getList',
    method: 'get',
    params: {
      code:params.code,
    },
  })
}

// 类型列表
export function getTypeList(params) {
  return request({
    url: '/link/getTypeList',
    method: 'get',
    params: {
      code:params.code,
    },
  })
}



// 新增类别
export function addType(data) {
  return request({
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    url: '/link/createType',
    method: 'post',
    data,
  })
}

// 新增网址
export function addLink(data) {
  return request({
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    url: '/link/createlink',
    method: 'post',
    data,
  })
}

// 修改网址
export function editLink(data) {
  console.log('data',typeof data);
  return request({
    headers: {'Content-Type': 'application/json',Authorization:'Bearer ' + accessToken},
    url: '/link/editLink',
    method: 'post',
    data,
  })
}

// 链接点击
export function clickLink(id) {
  return request({
    url: '/link/clicks',
    method: 'get',
    params: {
      id,
    },
  })
}

// 删除网址
export function delLink(data) {
  return request({
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    url: '/link/delLink',
    method: 'post',
    data,
  })
}