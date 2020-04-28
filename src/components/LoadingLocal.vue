<template>
  <div v-show="status != 'none'" class="l-loading">
    <i v-if="status == 'loading'" class="icon-loading"></i>
    <span>{{ text }}</span>
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
      return this.status == 'loading' ? '拼命载入中...' : '没有了，亲！'
    }
  }
}
</script>
<style lang="scss">
.l-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.3rem;
  .icon-loading {
    display: inline-block;
    width: .7rem;
    height: .7rem;
    margin-right: .12rem;
    animation: Lloading 1s steps(12, end) infinite;
  }
  span {
    font-size: 14px;
    color: #8b8b8b;
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
