<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="katas"
      item-key="title"
      class="elevation-1"
      :search="search"
      :custom-filter="filterText"
      multi-sort
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
        <!-- <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert> -->
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon dark color="info" medium class="ml-2" @click="viewCLI(item)">
          mdi-information-outline
        </v-icon>
      </template>
      <template v-slot:[`item.date`]="{ item }">
        <span>{{ new Date(item.date).toLocaleString() }}</span>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card outlined>
        <v-card-title>{{ this.selectedItem }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-3">
          <code>
            {{ this.$store.state.cliBase }} read kata "{{ this.selectedItem }}"
          </code>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn icon text small fab v-on="on" @click="copyKata">
                <v-icon color="info">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          <v-alert :value="alert" dense text color="alert" type="success">
            Copied Text!
            <!-- not sure if having it be red is counter productive to expressing success -->
          </v-alert>
          <input
            type="text"
            id="kataText"
            v-model="cliKataText"
            style="position: absolute; left: -1000px; top: -1000px"
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" text @click="dialog = !dialog">Cancel</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import * as kataService from '../services/KataService';

export default {
  name: 'Explore',
  data() {
    return {
      katas: [],
      search: '',
      selectedItem: '',

      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'title',
        },
        {
          text: 'Date',
          value: 'date',
        },
        { text: 'Creator', value: 'creator.name.full' },
        { text: 'Version', value: 'version' },
        { text: 'CLI Actions', value: 'actions', sortable: false },
      ],
      dialog: false,
      alert: false,
    };
  },
  computed: {
    cliKataText() {
      return `${this.$store.state.cliBase} read kata "${this.selectedItem}"`;
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.alert = val;
      }
    },
  },
  methods: {
    filterText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    viewCLI(item) {
      this.selectedItem = item.title;
      this.dialog = true;
    },
    copyKata() {
      let copyText = document.querySelector('#kataText');
      copyText.select();
      document.execCommand('copy');
      this.alert = true;
    },
  },
  beforeRouteEnter(to, from, next) {
    kataService.getAllKatas().then((res) => {
      next((vm) => {
        vm.katas = res.data.katas;
      });
    });
  },
  // created() {
  //   kataService.getAllKatas().then((res) => {
  //     this.katas = res.data.katas;
  //   });
  // },
};
</script>
<style lang="scss">
tbody {
  tr:hover {
    background-color: var(--v-background-base) !important;
  }
}
</style>