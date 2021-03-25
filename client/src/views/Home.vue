<template>
  <div class="home">
    <h1>Hello, World</h1>
    <v-container>
      <Login />
      <Register />
    </v-container>
  </div>
</template>

<script>
import Login from '@/views/authentication/Login.vue';
import Register from '@/views/authentication/Register.vue';
// @ is an alias to /src

export default {
  name: 'Home',
  components: { Login, Register },
};
</script>
