import { mdiCheckboxBlankCircleOutline } from '@mdi/js'

const themeConfig = {
  app: {
    name: 'HireHeroes',
    // logo: require('@/assets/logos/logo-sm.png'),
    logo: require('@/assets/logos/logo-nav.png'),
    isDark: false,
    isRtl: false,
    contentLayoutNav: 'vertical', // vertical, horizontal
    routeTransition: 'scroll-x-transition', // https://vuetifyjs.com/en/styles/transitions/#api
    // ! `semi-dark` isn't available for horizontal nav menu
    skinVariant: 'default', // default, bordered, semi-dark
    contentWidth: 'boxed',
  },
  menu: {
    isMenuHidden: false,
    isVerticalNavMini: false,
    verticalMenuAccordion: true,
    groupChildIcon: mdiCheckboxBlankCircleOutline,
    horizontalNavMenuGroupOpenOnHover: true,
  },
  appBar: {
    /*
    ! In Content Layout Horizontal Nav type `hidden` value won't work
    ! In Content Layout Horizontal Nav type value of `type` will affect both Appbar and Horizontal Navigation Menu
    */
    type: 'fixed', // fixed, static, hidden
    isBlurred: true,
  },
  footer: {
    type: 'static', // fixed, static, hidden
  },
  themes: {
    light: {
      // primary: '#9155FD',
      // primary: '#1F70FD',
      primary: '#f34c57',
      accent: '#0d6efd',
      secondary: '#8A8D93',
      // success: '#56CA00',
      success: '#30D988',
      info: '#16B1FF',
      // warning: '#FFB400',
      warning: '#EB5757',
      error: '#FF4C51',
    },
    dark: {
      primary: '#9155FD',
      accent: '#0d6efd',
      secondary: '#8A8D93',
      success: '#56CA00',
      info: '#16B1FF',
      warning: '#FFB400',
      error: '#FF4C51',
    },
  },
}

export default themeConfig
