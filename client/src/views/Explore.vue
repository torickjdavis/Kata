<template>
  <v-container>
    <v-row justify="end">
      <v-col>
        <v-text class="text-h2"> Explore </v-text>
      </v-col>
      <v-col cols="4">
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-select :items="sortList" label="Sort By" clearable></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="kata of katas" :key="kata._id" cols="4">
        <v-card>
          <v-card-title>{{ kata.title }}</v-card-title>
          <v-card-subtitle>{{ kata.date }}</v-card-subtitle>
          <v-card-text>Creator: {{ kata.creator }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      katas: Array(10)
        .fill()
        .map((_, idx) => ({
          _id: idx,
          title: `Kata ${idx}`,
          creator: Math.random() - 0.5 > 0 ? 'Wagstaff' : 'Calico',
          date: new Date(Date.now() - Math.random() * 100),
        })),
      sortList: [
        'Kata Name (A-Z)',
        'Kata Name (Z-A)',
        'Most Recent',
        `Creator's Name`,
      ],
    };
  },
};
</script>
