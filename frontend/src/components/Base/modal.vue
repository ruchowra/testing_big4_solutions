<template>
  <div class="modal" :class="[isVisible === true ? 'is-active' : '']">
    <div class="modal-background"></div>
    <template v-if="isCard !== false">
      <div class="modal-card">
        <header class="modal-card-head">
          <p>{{title}}</p>
        </header>
        <section class="modal-card-body">
          <slot></slot>
        </section>
        <footer class="modal-card-foot flex-end">
          <div class="buttons">
              <button v-if="primaryText !== ''" class="button"
                :class="[primaryClass
                ? `is-${primaryClass}`
                : 'is-success']" @click="emitPrimary">{{primaryText}}</button>
              <button v-if="hasCloseBtn" class="button" @click="emitClose">{{close}}</button>
          </div>
        </footer>
      </div>
    </template>

    <template v-if="isCard === false">
      <div class="modal-content" :class="[noScroll ? 'no-scroll' : '']">
        <slot></slot>
      </div>
    </template>
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
export default class Modal extends Vue {
  @Prop({ default: true }) private hasCloseBtn!: boolean;

  @Prop({ default: false }) private noScroll!: boolean;

  @Prop({ default: false }) private isVisible!: string;

  @Prop({ default: '' }) private title!: string;

  @Prop({ default: false }) private isCard!: boolean;

  @Prop({ default: 'is-success' }) private primaryClass!: string;

  @Prop({ default: '' }) private primaryText!: string;

  @Prop({ default: 'Close' }) private close!: string;

  @Emit('primary')
  public emitPrimary(): void { }// eslint-disable-line

  @Emit('close')
  public emitClose(): void { } // eslint-disable-line
}
</script>

<style lang="scss">
</style>
