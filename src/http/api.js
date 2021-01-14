export default {
  apiMvRanking: (area, offset = 0, limit = 10) => `/top/mv?limit=${limit}&offset=${offset}&area=${area}`,
  apiMvUrl: (id) => `/mv/url?id=${id}`,
  apiRankList: () => `/toplist/detail`,
  apiTopList: (id) => `/playlist/detail?id=${id}`,
  apiAudioUrl: (id) => `/song/url?id=${id}`,
  apiLyric: (id) => `/lyric?id=${id}`,
  apiSongDetail: (id) => `/song/detail?ids=${id}`,
  apiDefaultSearch: () => `/search/default`,
  apiHotSearch: () => `/search/hot/detail`,
  apiSearchSuggest: (key) => `/search/suggest?keywords=${key}&type=mobile`,
  apiSearch: (key, limit = 20, offset = 0, type = 1) => `/search?keywords=${key}&limit=${limit}&offset=${offset}&type=${type}`,
}
