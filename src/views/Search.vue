<template>
  <form class="form" action="#" method="get" accept-charset="utf-8">
    <div class="form-bd">
      <div class="form-bar">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-search"></use>
        </svg>
        <input type="search" placeholder="一千个伤心的理由">
      </div>
      <a class="form-cancel" href="javascript:;">Cancel</a>
    </div>
    <router-link class="form-btn" to="/search" exact>Search</router-link>
  </form>
</template>

<style lang="scss">
.form {
  padding: 1rem .6rem;
  &-bd {
    display: flex;
    align-items: center;
  }
  &-bar {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    border-radius: .3rem;
    overflow: hidden;
    background-color: #eeeeef;
    .icon {
      width: .88rem;
      height: .88rem;
      color: #8e8e92;
    }
    input {
      flex: 1;
      padding: .26rem .12rem;
      font-size: 16px;
      border: none;
      background-color: transparent;
    }
  }
  &-cancel {
    padding: .2rem .4rem;
    padding-right: 0;
    font-size: 16px;
    color: var(--T-0);
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  &-btn {
    position: relative;
    display: block;
    width: 184px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
    padding: 8px 24px;
    box-sizing: border-box;
    font-weight: 700;
    font-size: 17px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 1.41176471;
    border-radius: 4px;
    overflow: hidden;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    background-color: var(--T-1);
    &:active {
      background-color: var(--T-0);
    }
  }
}
</style>
