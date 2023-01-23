<template>
  <a
    :href="href"
    v-bind="otherAttributes"
    @click.prevent="navigate"
    v-html="text"
  />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'AemAnchor',
    inheritAttrs: false,
    props: {
      href: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const router = useRouter();
      const routes: string[] = [];
      router.getRoutes().forEach((route) => {
        routes.push(route.path);
      });
      return { routes };
    },
    computed: {
      inCqAuthor() {
        let inCqAuthor = false;
        const documentElementClassList = document.documentElement.classList;
        for (let index = 0; index < documentElementClassList.length; index++) {
          const documentElementClass = documentElementClassList[index];
          if (documentElementClass.startsWith('aem-AuthorLayer-')) {
            inCqAuthor = true;
            break;
          }
        }
        return inCqAuthor;
      },
      otherAttributes() {
        return this.$attrs;
      },
    },
    methods: {
      navigate() {
        if (this.inCqAuthor || !this.routes.includes(this.href)) {
          window.location.href = this.href;
        } else {
          this.$router.replace(this.href);
        }
      },
    },
  });
</script>
