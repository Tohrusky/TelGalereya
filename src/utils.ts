import { IRequest } from 'itty-router/Router'

export async function extractBaseUrl(request: IRequest) {
  const url = new URL(request.url)
  // 提取出协议、主机和端口部分，不包括路径和查询参数
  return `${url.protocol}//${url.host}`
}

export async function removeBaseUrl(request: IRequest) {
  const url = new URL(request.url)
  // 获取路径和查询参数部分，而不包括基本 URL
  return url.pathname + url.search
}
