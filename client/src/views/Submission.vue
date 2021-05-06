<template>
  <v-container>
    <h3>Kata: {{ submission.kata.title }}</h3>
    <h4>Score: {{ submission.score }}/{{ submission.maxPossibleScore }}</h4>
    <h4>Tests Passed: {{ submission.tests.counts.passed }}</h4>
    <h4>Tests Failed: {{ submission.tests.counts.failed }}</h4>
    <h4>Tests Total: {{ submission.tests.counts.total }}</h4>
    <json-viewer :expand-depth="Infinity" :value="submission" />
  </v-container>
</template>
<script>
//TODO: add name, time, score and max possible to the top above the JSON
import * as userService from '@/services/UserService';
export default {
  data() {
    return {
      submission: {
        tests: {
          counts: {},
        },
        kata: {},
      },
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