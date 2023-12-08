<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items-length="totalItems"
    :items="hotels"
    :loading="loading"
    class="elevation-1"
    @update:options="loadItems"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Hotels</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="800px">
          <template v-slot:activator="{ attrs }">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              class="mb-2"
              v-on:click="onNewItem"
              v-bind="attrs"
            >
              Add new hotel
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <hotel-form-view v-bind:hotel="hotel" />
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
            <v-card-title class="text-h5">Are you sure you want to delete this hotel?</v-card-title>
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
import HotelFormView from './hotel/HotelFormView.vue'
import emitter from 'tiny-emitter/instance'
import swal from 'sweetalert'
import { SERVER_URL } from './../api'

export default {
  components: { HotelFormView },

  mounted() {
    emitter.on('closeModalAndShowMessage', (data, update) => {
      swal('Success !', `${data.message}`, 'success')
      if (update) {
        this.hotels = this.hotels.map((hotel) => {
          if (hotel.id == data.hotel.id) {
            return data.hotel
          } else {
            return hotel
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
      hotel: null,
      loading: false,
      itemsPerPage: 3,
      dialog: false,
      dialogDelete: false,
      hotels: [],
      totalItems: 3,
      headers: [
        {
          title: 'Name',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { title: 'Address', value: 'address' },
        { title: 'Country', value: 'country' },
        { title: 'Province', value: 'province' },
        { title: 'City', value: 'city' },
        { title: 'Nit', value: 'nit' },
        { title: 'Phone', value: 'phone' },

        { title: 'Actions', value: 'actions', sortable: false, align: 'end' }
      ],
      editedIndex: -1,
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      }
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
      this.hotel = null
      this.dialog = !this.dialog
    },
    async loadItems({ page, itemsPerPage }) {
      this.loading = true

      let request = {
        start: page - 1,
        limit: itemsPerPage
      }
      const { data } = await axios.post(`${SERVER_URL}/hotels/findAll`, request)
      this.hotels = data.hotels
      this.totalItems = data.total
      this.loading = false
    },
    async deleteHotel() {
      this.loading = true

      const { data } = await axios.delete(`${SERVER_URL}/hotels/${this.hotel.id}`)
      this.loading = false
      if (data.deleted) {
        swal('Success !', `Hotel deleted successful`, 'success')
      }
    },
    editItem(item) {
      this.hotel = { ...item }
      this.dialog = true
    },

    deleteItem(item) {
      this.hotel = item
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.closeDelete()
      await this.deleteHotel()
      this.hotels = this.hotels.filter((serverItem) => serverItem.id != this.hotel.id)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
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