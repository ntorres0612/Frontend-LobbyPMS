<script lang="ts">
export default {
  name: 'ThemeChanger',
  data: () => ({
    darkMode: true
  })
}
</script>
 <template>
  <v-switch
    v-model="darkMode"
    @change="toggleTheme()"
    :label="`It's ${darkMode ? 'Dark' : 'Light'}!`"
  ></v-switch>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style scoped>
</style>
