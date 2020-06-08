import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.2.104:3000'
// http://192.168.16.101:3000
// http://192.168.2.104:3000
// http://localhost:3000

axios.defaults.timeout = 5000

axios.interceptors.response.use(function(response) {

  return response.status === 200 ? response : Promise.reject(new Error(response.status))

}, function(error) {
  return Promise.reject(error)
});

export default axios
