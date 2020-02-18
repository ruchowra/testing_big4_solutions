<template>
  <div v-if="hasToken">
    <modal :is-card="true" :is-visible="showLogout"
      title="Really logout?"
      :primary-text="'Yes, logout.'"
      :primary-class="'danger'"
      @primary="logout"
      @close="showLogout = false">
      <p>Are you sure you wish to logout?</p>
    </modal>
    <main class="container">
      <user-row @logout="showLogoutPrompt" v-if="hasToken"></user-row>
      <div class="hero section is-size-1" v-if="messages.length == 0 && !loading">
        No posts here!
      </div>
      <post v-for="message in sortedMessages"
      :key="message._id"
      :id="message._id"
      :author="message.author"
      :replies="message.replies"
      :message="message.message"
      :created="message.created"
      @delete-message="deleteMessage"
      @delete-reply="deleteReply"
      ></post>
      <article class="media">
        <figure class="media-left">
          <p class="image is-64x64 has-background-light">
          </p>
        </figure>
        <div class="media-content">
          <div class="field">
            <div class="control" :class="[sending ? 'is-loading' : '']">
              <textarea class="textarea has-fixed-size"
                placeholder="Write a message" rows=5 v-model="messageText"
                :disabled='sending'></textarea>
            </div>
            <div class="buttons">
              <button class="button is-success is-outlined"
                ref='send' :disabled='sending' @click="postMessage">Post</button>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<script lang="ts">
import Axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import UserRow from '@/components/Base/user-row.vue';
import Modal from '@/components/Base/modal.vue';
import Post from '@/components/Posts/post.vue';
import CONF from '@/components/Common/constant';

interface MessageObject {
  _id: string;
  author: {
    _id: string;
    name: string;
  };
  message: string;
  replies?: MessageObject[];
  created: string;
}

@Component({
  components: {
    UserRow,
    Modal,
    Post,
  },
})
export default class Posts extends Vue {
  private messages: MessageObject[] = [];
  private showLogout = false;
  private loading = false;
  private messageText = '';
  private sending = false;

  private mounted() {
    this.$root.$on('logged-in', this.loadMessages);
    if (this.hasToken) {
      this.loadMessages();
    }
  }

  private loadMessages() {
    this.loading = true;
    Axios.get(`${CONF.BASE_URL}/api/posts/`).then((response) => {
      this.loading = false;
      this.messages = response.data.data;
    }).catch((error) => {
      this.loading = false;
      this.logout();
    });
  }

  private get hasToken() {
    return this.$store.state.token && this.$store.state.token !== '';
  }

  public postMessage() { // eslint-disable-line
    const body = {
      message: this.messageText,
    };
    this.sending = true;
    Axios.post(`${CONF.BASE_URL}/api/posts`, body).then((res) => {
      console.log(`data from created Post ${res}`);
      const response = res.data;
      this.messages.push(response.data);
      this.messageText = '';
      this.sending = false;
    }).catch((err) => {
      this.sending = false;
    });
  }

  public showLogoutPrompt() {
    this.showLogout = true;
  }

  public logout() {
    this.messages = [];
    this.$store.commit('logout');
    this.showLogout = false;
  }

  public deleteMessage(message: string) {
    Axios.delete(`${CONF.BASE_URL}/api/posts/${message}`).then((resp) => {
      this.messages.splice(this.messages.findIndex((element) => (element._id === message)), 1); // eslint-disable-line
    }).catch((err) => {
      console.log(err);
    });
  }

  public deleteReply(message: string, index: number) {
    Axios.delete(`${CONF.BASE_URL}/api/posts/${message}/${index}`).then((resp) => {
      const msg = this.messages.find((element) => (element._id === message)); // eslint-disable-line
      if (msg && msg.replies) {
        msg.replies.splice(index, 1);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  public get sortedMessages(): MessageObject[] {
    return this.messages.sort((a, b) => (Number(b.created) - Number(a.created)));
  }
}
</script>
