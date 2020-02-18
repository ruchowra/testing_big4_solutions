<template>
<div>
  <div class="message is-danger" v-if="showError">
    <div class="message-header">
      <p>Error when logging in.</p>
      <button class="delete" aria-label="delete" @click="dismissError"></button>
    </div>
    <div class="message-body">
      <p>Please check your credentials and try again.</p>
    </div>
  </div>
  <div class="field">
    <label class="label">Email</label>
    <div class="control has-icons-left">
      <input class="input" type="text" placeholder="Email-address" v-model="email">
      <span class="icon is-small is-left">
        <i class="mdi mdi-account mdi-24px"></i>
      </span>
    </div>
  </div>
  <div class="field">
    <label class="label">Password</label>
    <div class="control has-icons-left">
      <input class="input" type="password" placeholder="******" v-model="pass">
      <span class="icon is-small is-left">
        <i class="mdi mdi-key-variant mdi-24px"></i>
      </span>
    </div>
  </div>
  <div class="buttons is-right">
    <button class="button is-success is-outlined" @click="login">Login</button>
  </div>
</div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Emit,
} from 'vue-property-decorator';

@Component
export default class LoginForm extends Vue {
  private email: string = '';
  private pass: string = '';

  @Emit()
  public login(): { email: string, password: string } {
    return {
      email: this.$data.email,
      password: this.$data.pass,
    };
  }

  get showError(): boolean {
    return this.$store.state.showLoginError;
  }

  public dismissError(): void {
    this.$store.commit('showLoginError', false);
  }
}
</script>
