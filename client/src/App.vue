<template>
  <v-app>
    <v-app-bar class="primary" dark app clipped-left>
      <router-link to="/" exact>
        <v-img
          src="@/assets/KATA1.svg"
          position="left center"
          contain
          max-height="50"
          max-width="112"
        ></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <v-btn
        to="/Explore"
        style="padding: 1%"
        class="primary text-button"
        exact
        plain
      >
        Explore
      </v-btn>
      <v-btn
        to="/Workshops"
        style="padding: 1%"
        class="primary text-button"
        exact
        plain
      >
        Workshops
      </v-btn>

      <v-btn
        v-if="!$store.state.isLoggedIn"
        to="/Authentication"
        class="primary text-button"
        style="padding: 1%"
        exact
        plain
      >
        Login
      </v-btn>

      <v-menu open-on-hover bottom dark offset-y v-if="$store.state.isLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            style="padding: 1%"
            class="primary text-button"
            plain
            v-bind="attrs"
            v-on="on"
            to="/Account"
            exact
          >
            {{ name }}
          </v-btn>
        </template>

        <v-list class="primary">
          <v-list-item to="/Account" exact>
            <v-list-item-title class="text-button"
              >Account Info</v-list-item-title
            >
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title class="text-button">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import * as auth from './services/AuthService';
export default {
  beforeCreate() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        this.$vuetify.theme.dark = e.matches;
      });
    this.$store.dispatch('authenticate');
  },
  computed: {
    name() {
      if (!this.$store.state.name) {
        return 'User';
      }
      return this.$store.state.name.split(' ')[0];
    },
  },
  methods: {
    logout() {
      auth.logout();
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

