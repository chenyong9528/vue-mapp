<template>
  <div class="l-loading" :style="{ visibility: status == 'none' ? 'hidden' : 'visible' }">
    <p>
      <i v-if="status == 'loading'" class="icon-loading"></i>
      <span>{{ text }}</span>
    </p>
    <a href="location.reload(true)" v-if="isShow">点击重试</a>
  </div>
</template>
<script>
export default {
  name: 'LoadingLocal',
  props: {
    /* loading(载入中)---no(提示没有了)---none(隐藏) */
    status: {
      type: String,
    }
  },
  computed: {
    text() {
      switch (this.status) {
        case 'loading':
          return '拼命载入中...'
        case 'no':
          return '没有了，亲！'
        case 'none':
          return ''
        default:
          return this.status
      }
    },
    isShow() {
      return this.status != 'loading' && this.status != 'no' && this.status != 'none'
    }
  }
}
</script>
<style lang="scss">
.l-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    height: 1.3rem;
    display: flex;
    align-items: center;
    .icon-loading {
      display: inline-block;
      width: .7rem;
      height: .7rem;
      margin-right: .12rem;
      animation: Lloading 1s steps(12, end) infinite;
    }
    span {
      display: inline-block;
      max-width: 10rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #8b8b8b;
    }
  }
  a {
    padding: .15rem .3rem;
    font-weight: 500;
    color: var(--T-0);
  }
}

@keyframes Lloading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

</style>
