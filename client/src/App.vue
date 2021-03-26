<template>
  <v-app>
    <v-app-bar class="primary" dark app>
      <router-link to="/" exact>
        <v-toolbar-title class="accent--text font-weight-bold">
          Kata
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
        class="primary text-button"
        exact
        plain
      >
        {{ route.name }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  beforeCreate() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.$vuetify.theme.dark = e.matches;
      });
  },
  computed: {
    routes() {
      return this.$router.options.routes.filter((r) => r.path !== '/');
    },
  },
};
</script>
