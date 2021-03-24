<template>
  <div class="home">
    <h1>Hello, World</h1>
    <v-container>
      <Login />
    </v-container>
  </div>
</template>

<script>
import Login from '@/views/authentication/Login.vue';
// @ is an alias to /src

export default {
  name: 'Home',
  components: { Login },
};
</script>
