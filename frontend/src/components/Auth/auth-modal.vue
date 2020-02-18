<template>
  <modal :no-scroll="true" :is-visible="!hasToken" >
    <div class="columns is-centered">
      <div class="column is-7">
        <div class="box is-paddingless" v-if="!isLoading">
          <section class="hero has-background-grey-lighter">
            <div class="hero-footer">
              <div class="tabs is-boxed is-fullwidth">
                <ul>
                  <li :class="[loginActive ? 'is-active' : '']"
                    @click="clickLogin"><a>Login</a></li>
                  <li :class="[loginActive ? '' : 'is-active']"
                    @click="clickRegister"><a>Register</a></li>
                </ul>
              </div>
            </div>
          </section>
          <div class="container section">
            <login-form v-if="loginActive" @login="loginAttempt" ref="loginForm">
            </login-form>
            <register-form v-if="!loginActive" @register="registerAttempt">
            </register-form>
          </div>
        </div>
        <div class="box is-paddingless has-background-grey-lighter" v-if="isLoading">
          <div class="container section">
            <label class="label">{{loadingMessage}}</label>
            <progress class="progress is-small is-primary" max="100"></progress>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import Axios, { AxiosResponse } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/Auth/login-form.vue';
import RegisterForm from '@/components/Auth/register-form.vue';
import Modal from '@/components/Base/modal.vue';
import CONF from '@/components/common/constant'
@Component({
  components: {
    Modal,
    LoginForm,
    RegisterForm,
  },
})
export default class AuthModal extends Vue {
  private loginActive: boolean = true;
  private isLoading: boolean = false;
  private loadingMessage: string = 'Loading, please wait...';

  public clickRegister() {
    if (this.loginActive) {
      this.loginActive = false;
    }
  }

  public clickLogin() {
    if (!this.loginActive) {
      this.loginActive = true;
    }
  }

  public get hasToken() {
    return this.$store.state.token !== '';
  }

  public loginAttempt(e: { email: string, password: string}) { // eslint-disable-line
    this.loadingMessage = 'Logging in, please wait...';
    this.isLoading = true;
    Axios.post(`${CONF.BASE_URL}/api/login`, {
      email: e.email,
      password: e.password,
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response: AxiosResponse) => {
      this.isLoading = false;
      this.$store.commit('setAuthToken', response.data.data.token);
      this.$store.commit('setRefreshToken', response.data.data.refreshToken);
      this.$root.$nextTick().then(() => {
        this.$root.$emit('logged-in', {});
      });
    }).catch((err) => {
      this.isLoading = false;
      this.$store.commit('showLoginError', true);
    });
  }

  public mounted() {
    this.$store.commit('showLoginError', false);
    this.$store.commit('showRegisterError', false);
  }

  public registerAttempt(e: { // eslint-disable-line
    email: string,
    password: string,
    name: string,
    isAdmin: boolean
    }) {
    this.loadingMessage = 'Registering, please wait...';
    this.isLoading = true;
    Axios.post(`${CONF.BASE_URL}/api/login/register`, {
      email: e.email,
      password: e.password,
      name: e.name,
      isAdmin: e.isAdmin,
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response: AxiosResponse) => {
      this.loginAttempt({ email: e.email, password: e.password });
    }).catch((err) => {
      this.isLoading = false;
      this.$store.commit('showRegisterError', true);
    });
  }
}
</script>

<style lang="scss">
</style>
