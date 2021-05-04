<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="info">
          <v-card-title class="card-title">
            <v-tabs
              grow
              v-model="tabIndex"
              color="secondary"
              active-class="primary"
            >
              <v-tab v-for="(tab, i) in tabs" :key="`tab-${i}`">
                {{ tab }}
              </v-tab>
            </v-tabs>
          </v-card-title>
          <v-theme-provider dark>
            <v-form v-model="valid" lazy-validation>
              <v-container class="pa-4">
                <v-row v-if="!isLogin">
                  <v-col>
                    <v-text-field
                      v-model="fname"
                      label="First Name"
                      filled
                    ></v-text-field>
                    <v-text-field
                      v-model="lname"
                      label="Last Name"
                      filled
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  label="UVU Email"
                  v-model="email"
                  type="email"
                  filled
                  :rules="[(v) => !!v || 'Email is required']"
                  :error-messages="duplicateEmailError"
                  required
                ></v-text-field>
                <v-text-field
                  label="Password"
                  v-model="password"
                  type="password"
                  :rules="[(v) => !!v || 'Password is required']"
                  :error-messages="invalidError"
                  filled
                  required
                ></v-text-field>
              </v-container>
            </v-form>
          </v-theme-provider>
          <v-card-actions>
            <v-btn class="secondary" block @click="submit">{{ tab }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as auth from '@/services/AuthService';

export default {
  name: 'Authentication',
  data() {
    return {
      valid: true,
      fname: '',
      lname: '',
      email: '',
      password: '',
      tabIndex: null,
      tabs: ['Login', 'Register'],
      duplicateEmailError: '',
      invalidError: '',
    };
  },
  computed: {
    tab() {
      return this.tabs[this.tabIndex];
    },
    isLogin() {
      return this.tab === 'Login';
    },
  },
  watch: {
    tabIndex(newVal, oldVal) {
      console.log('ole val', oldVal);
      console.log('new val', newVal);
    },
    tab(val) {
      this.duplicateEmailError = '';
    },
  },
  methods: {
    async submit() {
      if (this.tabIndex) {
        let user = {
          name: {
            first: this.fname,
            last: this.lname,
          },
          email: this.email,
          password: this.password,
        };
        try {
          await auth.registerUser(user);
        } catch (error) {
          console.log(error);
          this.duplicateEmailError =
            'This email is already registered. Please Log In';
        }
        await auth.login(user);
        this.$router.push('/');
      } else {
        let user = {
          email: this.email,
          password: this.password,
        };
        try {
          await auth.login(user);
          this.$router.push('/');
        } catch (error) {
          this.invalidError = 'Username or password is incorrect';
        }
      }
    },
  },
  mounted() {
    this.tabIndex = this.$route.params.register ? 1 : 0;
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  padding: 0;
}
</style>
