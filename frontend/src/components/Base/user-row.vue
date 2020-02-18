<template>
  <header class="level section card">
    <div class="level-left">
      <div class="level-item">
        <img src="images/logo_rattspar.jpg" />
      </div>
      <div class="level-item">
        <div>
          <p class="header">{{userName}}</p>
          <p class="is-size-7" v-if="userIsAdmin">Administrator</p>
        </div>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <p><a href="#" @click="logout">Log out</a></p>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';

@Component
export default class UserRow extends Vue {
  public get hasToken() {
    return this.$store.state.token !== '';
  }

  public get userName() {
    return this.$store.state.tokenPayload.user
      ? this.$store.state.tokenPayload.user.name
      : '';
  }

  public get userIsAdmin() {
    return this.$store.state.tokenPayload.user
      ? this.$store.state.tokenPayload.user.isAdmin
      : false;
  }

  @Emit()
  public logout(): void {  } // eslint-disable-line
}
</script>

<style lang="scss">
</style>
