# vue-mapp
本项目基于[vue](https://github.com/vuejs/vue)全家桶，仿ios网易云音乐app，有问题欢迎Issues，一起讨论学习QAQ，后端API使用的[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)。

## 使用指南(确保安装了[nodeJs](https://nodejs.org/en/)和[git](https://npm.taobao.org/mirrors/git-for-windows/))

1. 首先把后端API跑起来

```
$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
$ cd NeteaseCloudMusicApi
$ npm install

$ node app.js
```

2. 然后克隆安装并运行本项目就可以在浏览器中访问了`http://localhost:8080/`

```
$ git clone https://github.com/chenyong9528/vue-mapp.git
$ cd vue-mapp
$ npm install

$ npm run serve
```

3. Tips

```javascript
// 如果需要手机访问，找到src/http/axios.js
// 把http://localhost:3000 修改为http://[自己电脑的ip]:3000，然后通过http://[自己电脑的ip]:8080/访问

// 如果不使用git也可以直接下载
```

## 技术栈

- [vue](https://github.com/vuejs/vue)
- [vuex](https://github.com/vuejs/vuex)
- [vue-router](https://github.com/vuejs/vue-router)
- [vue-cli](https://github.com/vuejs/vue-cli)
- [axios](https://github.com/axios/axios)
- [velocityJs V1](https://github.com/julianshapiro/velocity)
- [sass](https://github.com/sass/sass)

## 预览

![Mv](https://img-cdn.7typ.cn/FjgLdmBiSkUJweCGi5IrgGb9dJAW)
![排行](https://img-cdn.7typ.cn/FpaM8buYERQXb_XvWY8kaPkWUrJX)
![搜索](https://img-cdn.7typ.cn/FruCznDtosxoDoOSMyLQBFNNb_Ws)
