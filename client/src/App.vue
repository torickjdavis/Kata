<template>
  <v-app>
    <v-app-bar class="primary" dark app>
      <v-toolbar-title class="accent--text font-weight-bold">
        Kata
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/explore">Explore</router-link>
      <router-link to="/editor">Editor</router-link>
      <router-link to="/login">Login</router-link>
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
};
</script>
