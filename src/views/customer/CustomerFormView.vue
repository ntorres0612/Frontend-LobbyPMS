<template>
  <v-form
    v-model="valid"
    ref="form"
    validate-on="submit lazy"
    @submit.prevent="saveOrUpdateCustomer"
  >
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
            v-model="form.document_number"
            :rules="documentNumberRules"
            :counter="10"
            label="Document number"
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
import { SERVER_URL } from '../../api'

export default {
  props: {
    customer: Object
  },
  data() {
    return {
      loading: false,
      initialValues: {
        name: '',
        document_number: ''
      },
      valid: false,
      form: {
        name: '',
        document_number: ''
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
      documentNumberRules: [
        (value) => {
          if (value) return true
          return 'Document number is required.'
        },
        (value) => {
          if (value?.length >= 5) return true

          return 'Document number must be less than 5 characters.'
        }
      ]
    }
  },
  computed: {
    buttonTitle() {
      return !this.customer ? 'Create' : 'Update'
    }
  },
  methods: {
    resetForm() {
      this.form = { ...this.initialValues }
    },
    async saveOrUpdateCustomer() {
      if (this.valid || this.valid == null) {
        this.loading = true

        let response = null
        if (!this.customer) {
          response = await axios.post(`${SERVER_URL}/customers`, this.form)
        } else {
          response = await axios.put(`${SERVER_URL}/customers/${this.customer.id}`, this.form)
        }
        emitter.emit('closeModalAndShowMessage', response.data, this.customer ? true : false)

        this.loading = false
      }
    }
  },
  mounted() {
    if (this.customer) {
      this.form = this.customer
    }
  }
}
</script>