<template>
  <v-form v-model="valid" ref="form" validate-on="submit lazy" @submit.prevent="saveOrUpdateHotel">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.name"
            :rules="nameRules"
            :counter="10"
            label="Name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.address"
            :rules="addressRules"
            :counter="10"
            label="Address"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.country"
            :rules="countryRules"
            label="Country"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.province"
            :rules="provinceRules"
            :counter="10"
            label="Province"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.city"
            :rules="cityRules"
            :counter="10"
            label="City"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="form.nit"
            :rules="nitRules"
            :counter="10"
            label="Nit"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" offset="8" md="4">
          <v-text-field
            v-model="form.phone"
            :rules="phoneRules"
            :counter="10"
            label="Phone"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-btn :loading="loading" class="me-4" type="submit" color="indigo-darken-3">{{
            buttonTitle
          }}</v-btn>
          <v-btn @click="resetForm">Clear</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
</style>
<script>
import axios from 'axios'
import emitter from 'tiny-emitter/instance'
import { SERVER_URL } from './../../api'

export default {
  props: {
    hotel: Object
  },
  data() {
    return {
      loading: false,
      initialValues: {
        name: '',
        address: '',
        country: '',
        province: '',
        city: '',
        nit: '',
        phone: ''
      },
      valid: false,
      form: {
        name: '',
        address: '',
        country: '',
        province: '',
        city: '',
        nit: '',
        phone: ''
      },
      nameRules: [
        (value) => {
          if (value) return true
          return 'Name is required.'
        },
        (value) => {
          if (value?.length >= 3) return true

          return 'Name must be less than 3 characters.'
        }
      ],
      addressRules: [
        (value) => {
          if (value) return true
          return 'Address is required.'
        },
        (value) => {
          if (value?.length >= 5) return true

          return 'Address must be less than 5 characters.'
        }
      ],
      countryRules: [
        (value) => {
          if (value) return true
          return 'Country is required.'
        },
        (value) => {
          if (value?.length >= 3) return true

          return 'Country must be less than 3 characters.'
        }
      ],
      provinceRules: [
        (value) => {
          if (value) return true
          return 'Province is required.'
        },
        (value) => {
          if (value?.length >= 3) return true

          return 'Province must be less than 3 characters.'
        }
      ],
      cityRules: [
        (value) => {
          if (value) return true
          return 'City is required.'
        },
        (value) => {
          if (value?.length >= 3) return true

          return 'City must be less than 3 characters.'
        }
      ],
      nitRules: [
        (value) => {
          if (value) return true
          return 'City is required.'
        },
        (value) => {
          if (value?.length >= 5) return true

          return 'City must be less than 5 characters.'
        }
      ],
      phoneRules: [
        (value) => {
          if (value) return true
          return 'Phone is required.'
        },
        (value) => {
          if (value?.length >= 5) return true

          return 'Phone must be less than 5 characters.'
        }
      ]
    }
  },
  computed: {
    buttonTitle() {
      return !this.hotel ? 'Create' : 'Update'
    }
  },
  methods: {
    resetForm() {
      this.form = { ...this.initialValues }
    },
    async saveOrUpdateHotel() {
      if (this.valid || this.valid == null) {
        this.loading = true

        let response = null
        if (!this.hotel) {
          response = await axios.post(`${SERVER_URL}/hotels`, this.form)
        } else {
          response = await axios.put(`${SERVER_URL}/hotels/${this.hotel.id}`, this.form)
        }
        emitter.emit('closeModalAndShowMessage', response.data, this.hotel ? true : false)

        this.loading = false
      }
    }
  },
  mounted() {
    if (this.hotel) {
      this.form = this.hotel
    }
  }
}
</script>