import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const colors = {
  imperialRed: '#e63946',
  honeydew: '#f1faee', // honeydew
  lightBlue: '#a8dadc', // powderBlue
  mediumBlue: '#457b9d', // mediumBlue
  darkBlue: '#1d3557', // prussianBlue
};

export default new Vuetify({
  theme: {
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches, // default
    themes: {
      light: {
        primary: colors.darkBlue,
        secondary: colors.lightBlue,
        accent: colors.imperialRed,
        info: colors.mediumBlue,
        background: colors.honeydew,
      },
      dark: {
        primary: colors.darkBlue,
        secondary: colors.lightBlue,
        accent: colors.imperialRed,
        background: colors.darkBlue,
        info: colors.mediumBlue,
      },
    },
  },
});
