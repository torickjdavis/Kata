<template>
  <v-container>
    <v-flex xs12 sm8 offset-sm2 align-center justify-center>
      <v-card class="info" dark>
        <v-card-title>Login</v-card-title>
        <v-form>
          <v-container class="pa-4">
            <v-text-field label="Email" type="email" filled></v-text-field>
            <v-text-field
              label="Password"
              type="password"
              filled
            ></v-text-field>
          </v-container>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <v-btn class="primary">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
};
</script>
