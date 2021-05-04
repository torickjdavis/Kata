<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="workshops"
      item-key="title"
      class="elevation-1"
      :search="search"
      :custom-filter="filterText"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          class="info"
          dark
          small
          elevation="0"
          @click="viewWorkshop(item)"
        >
          View Katas
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" attach max-width="500px">
      <v-card outlined>
        <v-card-title>
          {{ this.selectedItem.title }}
          <v-spacer></v-spacer>

          <v-card-subtitle class="text-none">
            <code>
              {{ $store.state.cliBase }} read workshop "{{
                this.selectedItem.title
              }}"
            </code>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn icon text small fab v-on="on" @click="copyWorkshop">
                  <v-icon color="info">mdi-content-copy</v-icon>
                </v-btn>
              </template>
              <span>Copy</span>
            </v-tooltip>
            <v-alert :value="alert" dense text color="alert" type="success">
              Copied Text!
              <!-- not sure if having it be red is counter productive to expressing success -->
            </v-alert>
          </v-card-subtitle>
        </v-card-title>
        <v-divider></v-divider>

        <div v-for="kata of this.selectedItem.katas" :key="kata._id">
          <v-list-item @click="openCLI(kata)" class="hoverList">
            <v-list-item-content>
              <v-list-item-title>{{ kata.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </div>

        <input
          type="text"
          id="workshopText"
          v-model="cliWorkshopText"
          style="position: absolute; left: -1000px; top: -1000px"
        />

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="closeDialog">Close</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="kataDialog" max-width="400px">
      <v-card>
        <v-card-title>{{ selected }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="py-3">
          <code> {{ $store.state.cliBase }} read kata "{{ selected }}" </code>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn icon text small fab v-on="on" @click="copyKata">
                <v-icon color="info">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          <v-alert :value="kataAlert" dense text color="alert" type="success">
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
          <v-btn color="accent" text @click="kataDialog = false">Close</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import * as kataService from '../services/KataService';

export default {
  name: 'Workshops',
  data() {
    return {
      workshops: [],
      search: '',
      selectedItem: {},

      defaultItem: {
        katas: [],
      },
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'title',
        },
        { text: 'Creator', value: 'creator.name.full' },
        { text: 'Version', value: 'version' },
        {
          text: 'View Katas',
          value: 'actions',
          sortable: false,
        },
      ],
      dialog: false,
      kataDialog: false,
      selected: '',
      alert: false,
      kataAlert: false,
    };
  },
  watch: {
    kataDialog(val) {
      if (!val) {
        this.kataAlert = false;
      }
    },
    alert(val) {
      if (val) {
        setTimeout(() => {
          this.alert = false;
        }, 2000);
      }
    },
  },
  computed: {
    cliKataText() {
      return `${this.$store.state.cliBase} read kata "${this.selected}"`;
    },
    cliWorkshopText() {
      return `${this.$store.state.cliBase} read workshop "${this.selectedItem.title}"`;
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
    viewWorkshop(item) {
      this.selectedItem = Object.assign({}, item);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.selectedItem = Object.assign({}, this.defaultItem);
      });
    },
    openCLI(item) {
      this.selected = item.title;
      this.kataDialog = true;
    },
    copyKata() {
      let copyText = document.querySelector('#kataText');
      copyText.select();
      document.execCommand('copy');
      this.kataAlert = true;
    },
    copyWorkshop() {
      // let copyText = this.$refs.workshopText;
      let copyText = document.querySelector('#workshopText');
      copyText.select();
      document.execCommand('copy');
      this.alert = true;
    },
  },
  beforeRouteEnter(to, from, next) {
    kataService.getAllWorkshops().then((res) => {
      next((vm) => {
        vm.workshops = res.data.workshops;
      });
    });
  },
  // created() {
  //   kataService.getAllWorkshops().then((res) => {
  //     this.workshops = res.data.workshops;
  //   });
  // },
};
</script>
<style lang="scss">
tbody {
  tr:hover {
    background: var(--v-background-base) !important;
  }
}
.hoverList:hover {
  background: var(--v-background-base) !important;
}
// <div tabindex="0" class="v-list-item v-list-item--link theme--light"><div class="v-list-item__content"><div class="v-list-item__title">fakeKata</div></div></div>
// document.querySelector("#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text > div:nth-child(3) > div")
//*[@id="app"]/div[3]/div/div/div[2]/div[3]/div
// #app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text > div:nth-child(1) > div
</style>