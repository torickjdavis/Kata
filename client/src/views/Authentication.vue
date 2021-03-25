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
            <v-form>
              <v-container class="pa-4">
                <v-row v-if="!isLogin">
                  <v-col>
                    <v-text-field label="First Name" filled></v-text-field>
                    <v-text-field label="Last Name" filled></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  label="UVU Email"
                  type="email"
                  filled
                  required
                ></v-text-field>
                <v-text-field
                  label="Password"
                  type="password"
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
export default {
  name: 'Authentication',
  data() {
    return {
      tabIndex: null,
      tabs: ['Login', 'Register'],
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
  methods: {
    submit() {
      console.debug(`Submit form to ${this.tab}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  padding: 0;
}
</style>
