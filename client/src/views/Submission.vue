<template>
  <v-container>
    <json-viewer expand-depth="Infinity" :value="submission" />
  </v-container>
</template>
<script>
//TODO: add name, time, score and max possible to the top above the JSON
import * as userService from '@/services/UserService';
export default {
  data() {
    return {
      submission: '',
    };
  },
  beforeCreate() {
    console.log('token client side', this.$store.state.token);
    userService
      .getSubmissionById(
        this.$route.params.id,
        this.$route.params.submissionId,
        this.$store.state.token
      )
      .then((res, error) => {
        this.submission = res.data;
      });
  },
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>