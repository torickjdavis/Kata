<template>
  <div class="home">
    <v-container>
      <h1>About Kata</h1>
      <p>
        Kata is a CLI tool for creating and completing autograded short
        programming assignments. Kata was created by Torick Davis and Camille
        Wilcox with the goal of aiding computer science professors in easing the
        burden of grading.
      </p>
      <h4>How to get started</h4>
      <p>
        Click the button below to download the CLI and then in that folder run
        <code>npm link</code>
      </p>
      <v-btn class="primary" href="<FMI>" download> Download the CLI </v-btn>
      <v-spacer></v-spacer>
      <p class="my-4">
        Find kata you are looking for on the explore page or look at the curated
        workshops on the workshops page. Once you select the kata/workshop you
        want to do simply copy the given command line prompt and past it into
        your terminal. Feel free to explore without signing in or creating an
        account, though you will need an account to submit your solutions and to
        create new katas.
      </p>
      <div v-if="!$store.state.isLoggedIn">
        <v-btn class="primary mr-2" to="Authentication"> Login </v-btn>
        or
        <v-btn
          class="primary ml-2"
          :to="{ name: 'Authentication', params: { register: true } }"
        >
          Register
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
};
</script>
