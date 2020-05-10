const baseUrl = 'http://localhost:3000'

export default {
  apiMvRanking: (limit = 30, offset = 0, area = '') => `${baseUrl}/top/mv?limit=${limit}&offset=${offset}&area=${area}`,
  apiMvUrl: (id) => `${baseUrl}/mv/url?id=${id}`,
  apiRankList: () => `${baseUrl}/toplist/detail`,
  apiTopList: (idx) => `${baseUrl}/top/list?idx=${idx}`,
  apiAudioUrl: (id) => `${baseUrl}/song/url?id=${id}`,
  apiAudioDetail: (id) => `${baseUrl}/song/detail?ids=${id}`,
}
