<template>
  <div>
    <div class="app-page-title">
      <div class="page-title-wrapper">
        <div class="page-title-heading">
          <div>
            {{ heading }}
            <div class="page-title-subheading">
              {{ subheading }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-card class="main-card mb-4">
      <template #header>
        <b-row>
          <b-col cols="8">
            <h5 class="mb-0 mt-2">Tabel Riwayat Kas</h5>
          </b-col>
          <b-col cols="4" class="pr-0">
            <b-input-group>
              <template #prepend>
                <b-input-group-text class="bg-primary">
                  <font-awesome-icon icon="search" style="color: #fff" />
                </b-input-group-text>
              </template>
              <b-form-input
                placeholder="Cari data ..."
                v-model="searchInput"
              ></b-form-input>
            </b-input-group>
          </b-col>
        </b-row>
      </template>
      <b-table
        id="payment-table"
        small
        :fields="fields"
        :items="dataBlcRecords"
        :hover="true"
        :filter="searchInput"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm"
        tbody-tr-class="payment-data"
        show-empty
      >
        <!-- A virtual column -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <template #cell(type)="data">
          <span v-if="data.item.type === 'income'">
            <span class="badge badge-pill badge-primary">Pemasukan</span>
          </span>
          <span v-if="data.item.type === 'outcome'">
            <span class="badge badge-pill badge-info text-white"
              >Pengeluaran</span
            >
          </span>
          <span v-if="data.item.type === 'delete trx'">
            <span class="badge badge-pill badge-danger text-white"
              >Hapus Tx</span
            >
          </span>
        </template>

        <template #cell(tanggal)="data">
          {{ data.item.datetime | formatDate }}
        </template>

        <template #cell(transactions)="data">
          <div v-if="data.item.transaction != null">
            {{ data.item.transaction.name }}
          </div>
        </template>

        <template #cell(balances)="data">
          <div v-if="data.item.balance != null">
            {{ data.item.balance.name }}
          </div>
        </template>

        <template #cell(amount)="data">
          {{ data.item.amount | formatRp }}
        </template>

        <template v-slot:cell(actions)="{ item }">
          <div class="row action-wrapper">
            <div class="action-btn" @click="onDelete(item.id)">
              <font-awesome-icon icon="trash" />
            </div>
          </div>
        </template>
      </b-table>
      <b-row>
        <b-col cols="2">
          <b-form-select
            v-model="perPage"
            :options="[5, 10, 25]"
            class="per-page"
            @change="fetchBlcRecords"
          >
          </b-form-select>
          data of {{ rows }}
        </b-col>
        <b-col cols="10">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            align="right"
            aria-controls="payment-table"
            class="mb-1"
          >
          </b-pagination>
        </b-col>
      </b-row>
    </b-card>

    <b-modal id="modal-balance" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form>
          <div class="form-group">
            <label for="kode-kas" class="font-bold fsz-14"
              >Kode Kas <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.code.$error }"
              id="kode-kas"
              v-model="$v.addForm.code.$model"
              placeholder="Masukkan kode kas"
            />
            <b-form-invalid-feedback id="kode-kas">
              Kode kas tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="nama-kas" class="font-bold fsz-14"
              >Nama Kas <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.name.$error }"
              id="nama-kas"
              v-model="$v.addForm.name.$model"
              placeholder="Masukkan nama kas pembayaran"
            />
            <b-form-invalid-feedback id="nama-kas">
              Nama kas tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="desc-kas" class="font-bold fsz-14"
              >Deskripsi Kas <span class="red">*</span></label
            >
            <b-form-textarea
              id="desc-kas"
              :class="{
                'is-invalid': $v.addForm.description.$error,
              }"
              v-model="$v.addForm.description.$model"
              placeholder="Masukkan deskripsi kas"
              rows="3"
            >
            </b-form-textarea>
            <b-form-invalid-feedback id="desc-kas">
              Deskripsi kas tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
          >
            Simpan Kas
          </button>
        </form>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import moment from "moment";
// import axios from "axios";

library.add(faTrash, faSearch, faFilter);

export default {
  components: {
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Riwayat Perubahan Kas",
    subheading: "Halaman ini digunakan untuk melihat riwayat transaksi",
    fields: [
      { key: "index", label: "#" },
      { key: "type", label: "Trx" },
      { key: "tanggal", label: "Tanggal" },
      { key: "transactions", label: "Nama Transaksi" },
      { key: "balances", label: "Nama Kas" },
      { key: "amount", label: "Saldo Kas" },
      // { key: "actions", label: "Action" },
    ],
    dataBlcRecords: [],

    searchInput: "",
    currentPage: 1,
    perPage: 5,
    rows: 0,
    filterDateStart: "",
    filterDateEnd: "",
    filterTrx: "",
  }),
  computed: {
    // rows() {
    //   return this.dataBlcRecords.length;
    // },
  },
  methods: {
    fetchBlcRecords() {
      this.$api
        .get(`balance-records?size=999999999`)
        .then((res) => {
          this.dataBlcRecords = [];
          this.dataBlcRecords = res.data.items;
          this.rows = res.data.total;
          // this.filterDateEnd = res.data.items[0].datetime;
          // console.log(res.data.items[0].datetime);
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    filterFetch() {
      this.$api
        .get(`balance-records`)
        .then((res) => {
          this.dataBlcRecords = [];
          res.data.items.map((obj) => {
            if (this.filterTrx === obj.type) this.dataBlcRecords.push(obj);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    setPage() {
      // this.currPage = 1;
    },
    resetFilter() {
      this.fetchBlcRecords();
      this.filterDateStart = "";
      this.filterDateEnd = "";
      this.filterTrx = "";
    },
    onDelete(id) {
      this.$swal({
        icon: "warning",
        title: "Hapus data ?",
        text: "Data yang dihapus tidak dapat dikembalikan",
        width: "28em",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        confirmButtonColor: "#e63b3b",
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$api
            .delete(`balance-records/${id}`)
            .then((res) => {
              if (res.status === 200) {
                this.fetchBlcRecords();
                this.toastAlert("menghapus");
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    toastAlert(act) {
      this.$swal({
        toast: true,
        position: "top-end",
        showClass: { popup: "" },
        icon: "success",
        title: `Berhasil ${act} data`,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      });
    },
  },
  filters: {
    formatRp(value) {
      value = parseFloat(value);
      let rupiah = "";
      let valueRev = value.toString().split("").reverse().join("");
      for (let i = 0; i < valueRev.length; i++) {
        if (i % 3 === 0) rupiah += `${valueRev.substr(i, 3)}.`;
      }
      const rp = rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("");
      if (rupiah === "NaN." || rupiah === "NaN") {
        return "...";
      }
      return `Rp ${rp}`;
    },
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD\xa0MMMM\xa0YYYY");
      }
    },
  },
  mounted() {
    this.fetchBlcRecords();
  },
};
</script>

<style>
.payment-data td:first-child {
  width: 5%;
}

/* 
.role-data td:last-child {
  width: 10%;
} */
</style>
