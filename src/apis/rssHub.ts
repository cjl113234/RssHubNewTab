// 导入axios实例
import httpRequest from '../request/index'

// // 定义接口的传参
// interface IParam {
//   userID: string,
//   userName: string
// }

export function apiGet(url: string) {
  return httpRequest({
    url: '/api/' + url,
    method: 'get',
  })
}
