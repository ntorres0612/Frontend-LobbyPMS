<template>
  <v-app>
    <v-navigation-drawer expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          title="Sandra Adams"
          subtitle="sandra_a88@gmailcom"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-on:click="goToPage('/hotels')"
          prepend-icon="mdi-bed-outline"
          title="Hoteles"
          value="myfiles"
        ></v-list-item>

        <v-list-item
          v-on:click="goToPage('/bookings')"
          prepend-icon="mdi-calendar-month-outline"
          title="Reservas"
          value="shared"
        ></v-list-item>

        <v-list-item
          v-on:click="goToPage('/customers')"
          prepend-icon="mdi-account-group-outline"
          title="Clientes"
          value="starred"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar absolute elevate-on-scroll scroll-target="#scrolling-techniques-7">
      <v-toolbar-title>Test</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <div class="right">
        <theme-changer />
      </div>
    </v-app-bar>

    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <router-view> </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
@import './assets/main.css';
.v-input {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script lang="ts"  >
import ThemeChanger from './components/ThemeChanger.vue'

export default {
  components: { ThemeChanger },
  data() {
    return {
      darkMode: '',
      drawer: true,
      aboveAge: false
    }
  },
  computed: {
    // displayProfile() {
    //   return `My name is ${this.name} and i am ${this.age}`
    // }
  },
  methods: {
    goToPage(page: any) {
      this.$router.push(page)
      this.drawer = !this.drawer

      // theme.global.name.value = darkMode.value ? 'dark' : 'light'
      // Optional: Get value of current theme
      // console.log(`Current theme is dark? ${theme.global.current.value.dark}`)
    }
  },
  mounted() {
    console.log('Application mounted')
  }
}
</script>