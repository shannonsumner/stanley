<template>
  <div class="carousel-widget">
    <button
      class="carousel-widget__arrow carousel-widget__previous-arrow"
      @click="previousSlide"
    >
      &#8249;
    </button>
    <div
      v-for="(slide, index) in slides"
      :key="slide"
      :class="`carousel-widget__slide ${
        index === 0 ? 'carousel-widget__active-slide' : ''
      }`"
      :style="`--carousel-widget-slide-transform: ${
        (index - slideIndex) * 100
      }%`"
    >
      <img :src="slide" alt="" />
    </div>
    <button
      class="carousel-widget__arrow carousel-widget__next-arrow"
      @click="nextSlide"
    >
      &#8250;
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Carousel',
    inheritAttrs: false,
    setup() {
      const slides = [
        'https://source.unsplash.com/random?landscape,mountain',
        'https://source.unsplash.com/random?landscape,cars',
        'https://source.unsplash.com/random?landscape,night',
        'https://source.unsplash.com/random?landscape,city',
      ];
      return { slides };
    },
    data() {
      return {
        slideIndex: 0,
      };
    },
    methods: {
      nextSlide() {
        if (this.slideIndex === this.slides.length - 1) {
          this.slideIndex = 0;
        } else {
          this.slideIndex += 1;
        }
      },
      previousSlide() {
        if (this.slideIndex === 0) {
          this.slideIndex = this.slides.length - 1;
        } else {
          this.slideIndex -= 1;
        }
      },
    },
  });
</script>

<style>
  :root {
    --carousel-widget-slide-transform: 0%;
  }

  .carousel-widget {
    block-size: 352px;
    border-radius: 24px;
    inline-size: 800px;
    max-inline-size: 100%;
    overflow: hidden;
    position: relative;
  }

  .carousel-widget__arrow {
    background-color: #fff;
    block-size: 4rem;
    border: none;
    cursor: pointer;
    display: flex;
    font-size: 3rem;
    inline-size: 2rem;
    inset-block: 0;
    margin-block: auto;
    margin-inline: auto;
    opacity: 0.5;
    padding-block: 0;
    padding-inline: 0;
    position: absolute;
    transition: opacity 100ms;
    z-index: 1;
  }

  .carousel-widget__arrow:hover,
  .carousel-widget__arrow:active {
    opacity: 1;
  }

  .carousel-widget__previous-arrow {
    border-radius: 0 32px 32px 0;
    inset-inline-start: 0;
    padding-inline-start: 4px;
  }

  .carousel-widget__next-arrow {
    border-radius: 32px 0 0 32px;
    inset-inline-end: 0;
    padding-inline-start: 12px;
  }

  .carousel-widget__slide {
    block-size: 350px;
    inline-size: 800px;
    max-inline-size: 100%;
    position: absolute;
    transform: translateX(var(--carousel-widget-slide-transform));
    transition: all 0.5s;
  }

  .carousel-widget__slide img {
    block-size: 100%;
    inline-size: 100%;
    object-fit: cover;
  }

  .aem-GridColumn:has(.carousel-widget) {
    align-items: center;
    display: flex;
    flex-flow: column nowrap;
  }
</style>
