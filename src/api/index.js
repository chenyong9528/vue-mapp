const baseUrl = 'http://localhost:3000'

export default {
  apiMvRanking: (limit = 30, offset = 0, area = '') => `${baseUrl}/top/mv?limit=${limit}&offset=${offset}&area=${area}`,
  apiMvUrl: (id) => `${baseUrl}/mv/url?id=${id}`,
  apiRankList: () => `${baseUrl}/toplist/detail`,
  apiTopList: (idx) => `${baseUrl}/top/list?idx=${idx}`,
  apiAudioUrl: (id) => `${baseUrl}/song/url?id=${id}`,
  apiSongDetail: (id) => `${baseUrl}/song/detail?ids=${id}`,
  apiDefaultSearch: () => `${baseUrl}/search/default`,
  apiHotSearch: () => `${baseUrl}/search/hot/detail`,
  apiSearchSuggest: (key) => `${baseUrl}/search/suggest?keywords=${key}&type=mobile`,
  apiSearch: (key, limit = 20, offset = 0, type = 1) => `${baseUrl}/search?keywords=${key}&limit=${limit}&offset=${offset}&type=${type}`,
}
