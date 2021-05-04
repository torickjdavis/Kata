<template>
  <v-container>
    <pre>{{ submission }}</pre>
  </v-container>
</template>
<script>
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
        this.submission = JSON.stringify(res.data, null, 2);
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