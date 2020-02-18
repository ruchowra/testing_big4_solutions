<template>
<div>
  <div class="message is-danger" v-if="showError">
    <div class="message-header">
      <p>Error when registering.</p>
      <button class="delete" aria-label="delete" @click="dismissError"></button>
    </div>
    <div class="message-body">
      <p>Please check your credentials and try again.</p>
    </div>
  </div>
  <div class="field">
    <label class="label">Email</label>
    <div class="control has-icons-left has-icons-right">
      <input class="input" type="text" placeholder="Email-address" v-model="email"
        :class="[invalidEmail ? 'is-danger' : '']">
      <span class="icon is-small is-left">
        <i class="mdi mdi-account mdi-24px"></i>
      </span>
      <span class="icon is-small is-right has-text-danger" v-if="invalidEmail">
        <i class="mdi mdi-close mdi-18px"></i>
      </span>
    </div>
  </div>
  <div class="field">
    <label class="label">Password</label>
    <div class="control has-icons-left has-icons-right">
      <input class="input" type="password" placeholder="******"
        v-model="pass" :class="[invalidPassword ? 'is-danger' : '']">
      <span class="icon is-small is-left">
        <i class="mdi mdi-key-variant mdi-24px"></i>
      </span>
      <span class="icon is-small is-right has-text-danger" v-if="invalidPassword">
        <i class="mdi mdi-close mdi-18px"></i>
      </span>
    </div>
  </div>
  <div class="field">
    <label class="label">Name</label>
    <div class="control has-icons-left has-icons-right">
      <input class="input" type="text" placeholder="Full Name"
        v-model="name" :class="[emptyName ? 'is-danger' : '']">
      <span class="icon is-small is-left">
        <i class="mdi mdi-account-card-details mdi-24px"></i>
      </span>
      <span class="icon is-small is-right has-text-danger" v-if="emptyName">
        <i class="mdi mdi-close mdi-18px"></i>
      </span>
    </div>
  </div>
  <div class="level">
    <div class="level-item is-left has-icons-right">
      <div class="field">
        <label class="label">Is Admin</label>
        <input type="checkbox" v-model="isAdmin" />
      </div>
    </div>
    <div class="level-item buttons is-right">
      <button class="button is-success" @click="register">Register</button>
    </div>
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
export default class RegisterForm extends Vue {
  private email: string = '';
  private pass: string = '';
  private name: string = '';
  private isAdmin: boolean = false;

  get showError(): boolean {
    return this.$store.state.showRegisterError;
  }

  get invalidEmail(): boolean {
    return this.email.length === 0 || this.email.match(/[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+/g) === null;
  }

  get emptyName(): boolean {
    return this.name.length === 0;
  }

  get invalidPassword(): boolean {
    return this.pass.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/g) === null || this.pass.length < 8;
  }

  private dismissError() {
    this.$store.commit('showRegisterError', false);
  }

  public register(): void {
    if (this.invalidEmail || this.invalidPassword || this.emptyName) {
      return;
    }
    this.$emit('register', {
      email: this.email,
      password: this.pass,
      name: this.name,
      isAdmin: this.isAdmin,
    });
  }
}
</script>
