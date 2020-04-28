const baseUrl = 'http://localhost:3000'

export default {
  apiMvRanking: (limit = 30, offset = 0, area = '') => `${baseUrl}/top/mv?limit=${limit}&offset=${offset}&area=${area}`,
  apiMvDetail: (id) => `${baseUrl}/mv/detail?mvid=${id}`,
}
