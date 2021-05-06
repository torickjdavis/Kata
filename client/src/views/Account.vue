<template>
  <div>
    <v-navigation-drawer
      app
      clipped
      permanent
      :expand-on-hover="$vuetify.breakpoint.mobile"
    >
      <v-list nav dense>
        <v-list-item link @click="tabIndex = 0">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Account Info</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="displaySubmissions">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>My Submissions</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="displayKatas">
          <v-list-item-icon>
            <v-icon>mdi-star</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Katas</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-container fluid>
      <div v-if="tabIndex === 0" class="mx-8">
        <h1>{{ tabs[tabIndex] }}</h1>
        <p>First Name: {{ user.name.first }}</p>
        <p>Last Name: {{ user.name.last }}</p>
        <p>Email: {{ user.email }}</p>
        <!-- <p>Total Submissions: {{ user.submissions.length }}</p> -->
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="info" v-bind="attrs" v-on="on">
              Change Password
            </v-btn>
          </template>

          <v-card>
            <v-form v-model="valid" lazy-validation ref="passwordForm">
              <v-card-title class="background"> Change Password </v-card-title>

              <v-card-text>
                <v-text-field
                  type="Password"
                  label="Current Password"
                  v-model="currentPassword"
                  :rules="[(v) => !!v || 'Password is required']"
                  required
                ></v-text-field>
                <v-text-field
                  type="Password"
                  label="New Password"
                  v-model="newPassword"
                  :rules="[(v) => !!v || 'New Password is required']"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmed"
                  :rules="[
                    (v) => !!v || 'Confirmed Password is required',
                    (v) =>
                      (!!v && v) === this.newPassword ||
                      'Passwords do not match',
                  ]"
                  type="Password"
                  label="Confirm New Password"
                  required
                ></v-text-field>
                <v-alert :value="alert" dense text color="alert" type="success">
                  Password Changed
                </v-alert>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="info"
                  text
                  @click="changePassword"
                  :disabled="!valid || currentPassword === ''"
                >
                  Submit
                </v-btn>
                <v-btn color="accent" text @click="dialog = false">
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </div>

      <div v-if="tabIndex === 1">
        <h1>{{ tabs[tabIndex] }}</h1>
        <v-data-table
          :headers="submissionHeaders"
          :items="submissions"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              dark
              color="info"
              medium
              class="ml-2"
              icon
              :to="{
                name: 'Submission',
                params: { id: user.id, submissionId: item._id },
              }"
            >
              <v-icon> mdi-information-outline </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
      <div v-if="tabIndex === 2">
        <h1>{{ tabs[tabIndex] }}</h1>
        <v-data-table
          :headers="kataHeaders"
          :items="katas"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:[`item.date`]="{ item }">
            <span>{{ new Date(item.date).toLocaleString() }}</span>
          </template>
        </v-data-table>
      </div>
    </v-container>
  </div>
</template>
<script>
import * as userService from '@/services/UserService';
import * as auth from '@/services/AuthService';
// import store from '@/store';
export default {
  name: 'Account',
  data() {
    return {
      user: {
        name: {},
      },
      tabs: ['Account Info', 'Submissions', 'Katas'],
      tabIndex: 0,
      submissionHeaders: [
        {
          text: 'Kata',
          align: 'start',
          value: 'kata.title',
        },
        { text: 'Verions', value: 'kataVersion' },
        { text: 'Date', value: 'createdAt' },
        { text: 'Score', value: 'score' },
        {
          text: 'View Submission',
          value: 'actions',
          sortable: false,
        },
      ],
      kataHeaders: [
        {
          text: 'Kata',
          align: 'start',
          value: 'title',
        },
        { text: 'Verions', value: '_v' },
        { text: 'Date', value: 'date' },
      ],
      katas: [],
      submissions: [],
      dialog: false,
      currentPassword: '',
      newPassword: '',
      confirmed: '',
      valid: false,
      alert: false,
      passwordMismatchError: '',
    };
  },
  watch: {
    newPassword(val) {
      if (this.confirmed.length > 0) this.$refs.passwordForm.validate();
    },
  },
  methods: {
    async displayKatas() {
      if (this.katas.length == 0) {
        userService.getKatasByUserId(this.user._id).then((res) => {
          this.katas = res.data;
        });
        // .catch((err) => {
        //   console.error(error);
        // });
        this.tabIndex = 2;
      } else {
        this.tabIndex = 2;
      }
    },
    async displaySubmissions() {
      console.log('in this method');
      if (this.submissions.length == 0) {
        userService
          .getSubmissions(this.user._id, this.$store.state.token)
          .then((res) => {
            console.log('res.data', res.data);
            this.submissions = res.data;
          });
        // .catch((err) => {
        //   console.error(error);
        // });
        this.tabIndex = 1;
      } else {
        this.tabIndex = 1;
      }
    },
    async changePassword() {
      console.log('Password form', this.$refs.passwordForm);
      let user = {
        email: this.user.email,
        password: this.currentPassword,
      };
      try {
        await auth.validatePassword(user);
        await userService.updateUser(
          this.user.id,
          {
            password: this.newPassword,
          },
          this.$store.state.token
        );
        this.alert = true;
        this.dialog = false;
      } catch (error) {
        this.invalidError = 'Password is incorrect';
      }
    },
  },
  // computed: {
  //   firstName() {
  //     return this.user?.name?.first;
  //   },
  // },
  created() {
    userService.getUserById(this.$store.state.userId).then((res) => {
      this.user = res.data;
    });
  },
};
</script>
