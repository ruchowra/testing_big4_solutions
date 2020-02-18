<template>
  <article class="media">
    <figure class="media-left">
        <p class="image is-64x64 has-background-light">
        </p>
    </figure>
    <div class="media-content">
      <p class="is-size-7 has-text-grey">On {{formatDate(created)}} {{author.name}} wrote:</p>
      <div class="content">
        <p>{{message}}</p>
        <nav class="level" v-if="canDelete(this)">
          <div class="level-left">
            <div class="level-item">
              <a class="button is-danger is-small is-outlined"
                @click="deleteMessage(id)"
                title="Delete message">
                <span class="icon"><i class="mdi mdi-18px mdi-close"></i></span>
              </a>
            </div>
          </div>
        </nav>
      </div>
      <article class="media" v-for="(reply,i) in replies" :key="i">
        <figure class="media-left">
          <p class="image is-64x64 has-background-light">
          </p>
        </figure>
        <div class="media-content">
          <p class="is-size-7 has-text-grey">On {{
              formatDate(reply.created)
            }} {{
              reply.author.name
            }} replied with:</p>
          <div class="content"><p>{{reply.message}}</p></div>
          <nav class="level" v-if="canDelete(reply)">
            <div class="level-left">
              <div class="level-item">
                <a class="button is-danger is-small is-outlined"
                  @click="deleteReply(id, i)"
                  title="Delete message">
                  <span class="icon"><i class="mdi mdi-18px mdi-close"></i></span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </article>
      <article class="media">
        <figure class="media-left">
          <p class="image is-64x64 has-background-light">
          </p>
        </figure>
        <div class="media-content">
          <div class="level" v-if="!showReply">
            <div class="level-left">
              <div class="level-item">
                <div>
                  <p>
                    <a @click="showReply = true" class="
                      button
                      is-outlined
                      is-info
                      has-icons-right
                      is-small"
                      title="Reply"
                      aria-valuetext="Reply">
                        <span>Reply</span>
                        <span class="icon is-small">
                          <i class="mdi mdi-comment-edit mdi-18px"></i>
                        </span>
                      </a>
                    </p>
                </div>
              </div>
            </div>
          </div>
          <div class="field" v-if="showReply">
            <div class="control" :class="[sending ? 'is-loading' : '']">
              <textarea class="textarea has-fixed-size"
                placeholder="Write a reply" rows=5 v-model="replyText"
                :disabled='sending'></textarea>
            </div>
            <div class="buttons">
              <button class="button is-success is-outlined"
                ref='send' :disabled='sending' @click="postReply">Post reply</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </article>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
  Emit,
} from 'vue-property-decorator';
import Axios from 'axios';

interface Author {
   _id: string;
   name: string;
   'is-admin': boolean;
}

interface Reply {
  author: Author;
  message: string;
  created: string;
}

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

@Component
export default class Post extends Vue {
  private replyText = '';
  private sending = false;

  private showReply = false;

  @Prop({ default: '0' }) private id!: string;

  @Prop({ default: () => [] }) private replies!: Reply[];

  @Prop({ default: () => ({ _id: '', name: '', 'is-admin': false }) }) private author!: object;

  @Prop({ default: '' }) private message!: string;

  @Prop({ default: '' }) private created!: string;

  private weekday(daynum: number) { // eslint-disable-line
    switch (daynum) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      default:
        return 'Saturday';
    }
  }

  private month(monthnum: number) { // eslint-disable-line
    switch (monthnum) {
      case 0:
        return 'Jan';
      case 1:
        return 'Fen';
      case 2:
        return 'Mar';
      case 3:
        return 'Apr';
      case 4:
        return 'May';
      case 5:
        return 'Jun';
      case 6:
        return 'Jul';
      case 7:
        return 'Aug';
      case 8:
        return 'Sep';
      case 9:
        return 'Oct';
      case 10:
        return 'Nov';
      default:
        return 'Dec';
    }
  }

  private postReply() {
    const body = {
      reply: this.replyText,
    };
    this.sending = true;
    Axios.put(`/api/posts/${this.id}`, body).then((response) => {
      const curDate = new Date();
      this.replies.push({
        author: this.$store.state.tokenPayload.user,
        message: this.replyText,
        created: `${curDate.toDateString()} ${curDate.getHours()}:${curDate.getMinutes()}`,
      });
      this.replyText = '';
      this.showReply = false;
      this.sending = false;
    }).catch((err) => {
      this.sending = false;
    });
  }

  private formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${this.weekday(date.getDay())} ${date.getDate()} ${this.month(date.getMonth())} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
  }

  @Emit()
  private deleteMessage(message: string) {} // eslint-disable-line

  @Emit()
  private deleteReply(message: string, index: number) {} // eslint-disable-line

  private canDelete(message: MessageObject): boolean {
    return this.$store.state.tokenPayload.user['is-admin']
      || Number(this.$store.state.tokenPayload.user._id) === Number(message.author._id); // eslint-disable-line
  }
}
</script>

<style lang="scss">
.author-name {
  width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
