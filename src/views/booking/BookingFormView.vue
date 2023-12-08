<template>
  <div>
    <v-col order="1">
      <v-sheet class="pa-1 ma-1">
        <v-form
          v-model="valid"
          ref="form"
          validate-on="submit lazy"
          @submit.prevent="saveOrUpdateBooking"
        >
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="form.checkIn"
                  label="Check-in"
                  :rules="checkInRules"
                  type="date"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  label="Check-out"
                  v-model="form.checkOut"
                  :rules="checkOutRules"
                  type="date"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-autocomplete
                  :items="hotels"
                  item-title="name"
                  item-value="id"
                  :rules="hotelRules"
                  label="Select a hotel"
                  v-model="form.hotel"
                  chips
                ></v-autocomplete>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="form.amount"
                  :rules="amountRules"
                  :counter="10"
                  label="Amount"
                  type="number"
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
      </v-sheet>
    </v-col>
    <v-row>
      <v-col order="1">
        <v-sheet class="pa-2 ma-2">
          <v-text-field
            v-model="input"
            :loading="loading"
            density="compact"
            variant="solo"
            label="Search customers"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
          ></v-text-field>
        </v-sheet>
      </v-col>
      <v-col order="2">
        <v-sheet class="pa-2 ma-2">
          <span class="text-h5">{{ customersSelectedTitle }}</span>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col order="1">
        <v-table height="300px">
          <thead>
            <tr>
              <th class="text-left">Customer</th>
              <th class="text-left">Document number</th>
              <th class="text-left">Add</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in customers" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.document_number }}</td>
              <td>
                <v-btn density="compact" icon="mdi-plus" v-on:click="onAddItem(item)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col order="2">
        <v-table height="300px">
          <thead>
            <tr>
              <th class="text-left">Customer</th>
              <th class="text-left">Document number</th>
              <th class="text-left">Remove</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in customersAdded" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.document_number }}</td>
              <td>
                <v-btn
                  density="compact"
                  icon="mdi-delete"
                  :style="{ display: index == 0 ? 'none' : 'block' }"
                  v-on:click="onRemoveItem(item)"
                ></v-btn>
              </td>
              <td>
                <v-icon
                  size="large"
                  color="blue-darken-2"
                  icon="mdi-star"
                  :style="{ display: index == 0 ? 'block' : 'none' }"
                ></v-icon>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
</style>
<script>
import axios from 'axios'
import emitter from 'tiny-emitter/instance'
import { SERVER_URL } from '../../api'
import { debounce, validateNumber } from './../../helpers'

export default {
  props: {
    bookingID: Object
  },
  data() {
    return {
      hotels: [],

      customers: [],
      customersAdded: [],
      input: '',
      debouncedInput: '',
      loading: false,
      initialValues: {
        amount: 0,
        hotel: { id: -1, name: '' },
        checkIn: '',
        checkOut: ''
      },
      valid: false,
      form: {
        amount: 0,
        hotel: { id: -1, name: '' },
        checkIn: '',
        checkOut: ''
      },
      checkInRules: [
        (value) => {
          if (value) return true
          return 'Name is required.'
        },
        (value) => {
          if (value?.length >= 3) return true

          return 'Name must be less than 3 characters.'
        }
      ],
      checkOutRules: [
        (value) => {
          if (value) return true
          return 'Document number is required.'
        },
        (value) => {
          if (value?.length >= 5) return true

          return 'Document number must be less than 5 characters.'
        }
      ],
      hotelRules: [
        (value) => {
          if (value) return true
          return 'Hotel is required ..'
        },
        (value) => {
          if (value.id != -1) return true

          return 'Hotel is required'
        }
      ],
      amountRules: [
        (value) => {
          if (value <= 0) return 'Amount must be positive number.'

          if (value) return true
          return 'Document number is required.'
        },
        (value) => {
          if (validateNumber(value)) return true

          return 'Invalid amount.'
        }
      ]
    }
  },
  computed: {
    buttonTitle() {
      return !this.bookingID ? 'Create' : 'Update'
    },
    customersSelectedTitle() {
      return `Customers selected (${this.customersAdded.length})`
    }
  },
  watch: {
    input: debounce(function (newVal) {
      this.searchCustomerByName(newVal)
    }, 500)
  },
  methods: {
    onAddItem(item) {
      this.customers = this.customers.filter((customer) => customer.id != item.id)
      this.customersAdded.push(item)
    },
    onRemoveItem(item) {
      this.customersAdded = this.customersAdded.filter((customer) => customer.id != item.id)
    },
    resetForm() {
      this.form = { ...this.initialValues }
    },
    async saveOrUpdateBooking() {
      if (this.valid || this.valid == null) {
        this.loading = true

        let customers = this.customersAdded.map((customer) => customer.id)

        let data = {
          amount: this.form.amount,
          hotel_id: this.form.hotel.id,
          checkIn: this.form.checkIn,
          checkOut: this.form.checkOut,
          customers: customers
        }

        let response = null
        if (!this.bookingID) {
          response = await axios.post(`${SERVER_URL}/bookings`, data)
        } else {
          response = await axios.put(`${SERVER_URL}/bookings/${this.bookingID}`, data)
        }
        emitter.emit('closeModalAndShowMessage', response.data, this.customer ? true : false)

        this.loading = false
      }
    },
    async searchCustomerByName(name) {
      let data = {
        name,
        list: this.customersAdded.map((customer) => customer.id)
      }
      let response = await axios.post(`${SERVER_URL}/customers/searchByName`, data)
      this.customers = response.data.customers
    },
    async listHotels() {
      let response = await axios.get(`${SERVER_URL}/hotels/list`)
      this.hotels = response.data.hotels
    },
    async getBookingById(id) {
      let response = await axios.get(`${SERVER_URL}/bookings/${id}`)

      this.form = response.data
      this.form.checkIn = response.data.checkIn.split(' ')[0]
      this.form.checkOut = response.data.checkOut.split(' ')[0]

      this.customersAdded = response.data.customers
    }
  },
  async mounted() {
    await this.listHotels()
    if (this.bookingID) {
      await this.getBookingById(this.bookingID)
    }
  }
}
</script>