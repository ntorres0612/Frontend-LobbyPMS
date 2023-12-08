<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="bookings"
    :loading="loading"
    class="elevation-1"
    @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Bookings</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" :scrim="false" fullscreen>
          <template v-slot:activator="{ attrs }">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              class="mb-2"
              v-on:click="onNewItem"
              v-bind="attrs"
            >
              Add new booking
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <booking-form-view v-bind:bookingID="bookingID" />
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h2"
              >Are you sure you want to delete this booking?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="primary" text @click="deleteItemConfirm">Delete</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
  </v-data-table-server>
</template>

<script>
import axios from 'axios'
import BookingFormView from './booking/BookingFormView.vue'
import emitter from 'tiny-emitter/instance'
import swal from 'sweetalert'
import { SERVER_URL } from './../api'

export default {
  components: { BookingFormView },

  mounted() {
    emitter.on('closeModalAndShowMessage', (data, update) => {
      swal('Success !', `${data.message}`, 'success')
      if (update) {
        this.bookings = this.bookings.map((booking) => {
          if (booking.id == data.booking.id) {
            return data.booking
          } else {
            return booking
          }
        })
      } else {
        setTimeout(() => {
          location.reload()
        }, 5000)
      }
    })
  },
  data() {
    return {
      bookingID: null,
      loading: false,
      itemsPerPage: 3,
      dialog: false,
      dialogDelete: false,
      bookings: [],
      totalItems: 3,
      headers: [
        {
          title: 'Check-in',
          align: 'start',
          sortable: false,
          value: 'checkIn'
        },
        { title: 'Check-out', value: 'checkOut' },
        { title: 'Amount', value: 'amount' },
        { title: 'Nights', value: 'nights' },
        { title: 'Hotel', value: 'name' },

        { title: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ]
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Booking' : 'Edit Booking'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    }
  },

  created() {},

  methods: {
    onNewItem() {
      this.booking = null
      this.dialog = !this.dialog
    },
    async loadItems({ page, itemsPerPage }) {
      this.loading = true

      let request = {
        start: page - 1,
        limit: itemsPerPage
      }
      const { data } = await axios.post(`${SERVER_URL}/bookings/findAll`, request)
      this.bookings = data.bookings
      this.totalItems = data.total
      this.loading = false
    },
    async deleteBooking() {
      this.loading = true

      const { data } = await axios.delete(`${SERVER_URL}/bookings/${this.hotel.id}`)
      this.loading = false
      if (data.deleted) {
        swal('Success !', `Booking deleted successful`, 'success')
      }
    },
    editItem(item) {
      this.bookingID = item.id
      this.dialog = true
    },

    deleteItem(item) {
      this.booking = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.closeDelete()
      await this.deleteBooking()
      this.bookings = this.bookings.filter((serverItem) => serverItem.id != this.booking.id)
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false
    },

    save() {
      this.close()
    }
  }
}
</script>