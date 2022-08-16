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
        <div class="page-title-actions">
          <button
            v-if="role === '911'"
            type="button"
            class="btn-shadow d-inline-flex align-items-center btn btn-primary mr-3"
            @click="onAdd"
          >
            <font-awesome-icon class="mr-2" icon="plus" />
            {{ addtext }}
          </button>
          <button
            type="button"
            class="btn-shadow d-inline-flex align-items-center btn btn-primary"
            @click="onTransfer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="tf-svg"
            >
              <path
                d="M32 176h370.8l-57.38 57.38c-12.5 12.5-12.5 32.75 0 45.25C351.6 284.9 359.8 288 368 288s16.38-3.125 22.62-9.375l112-112c12.5-12.5 12.5-32.75 0-45.25l-112-112c-12.5-12.5-32.75-12.5-45.25 0s-12.5 32.75 0 45.25L402.8 112H32c-17.69 0-32 14.31-32 32S14.31 176 32 176zM480 336H109.3l57.38-57.38c12.5-12.5 12.5-32.75 0-45.25s-32.75-12.5-45.25 0l-112 112c-12.5 12.5-12.5 32.75 0 45.25l112 112C127.6 508.9 135.8 512 144 512s16.38-3.125 22.62-9.375c12.5-12.5 12.5-32.75 0-45.25L109.3 400H480c17.69 0 32-14.31 32-32S497.7 336 480 336z"
              />
            </svg>
            {{ tftext }}
          </button>
        </div>
      </div>
    </div>
    <b-card class="main-card mb-4">
      <template #header>
        <b-row>
          <b-col cols="8">
            <h5 class="mb-0 mt-2">Tabel Kas</h5>
          </b-col>
          <b-col cols="4">
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
        :items="dataBalance"
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

        <template #cell(amount)="data">
          {{ data.item.amount | formatRp }}
        </template>

        <template v-slot:cell(actions)="{ item }">
          <div class="row action-wrapper">
            <div class="action-btn" @click="onEdit(item)">
              <font-awesome-icon icon="pen" />
            </div>
            <!-- <div
              v-if="role === '911'"
              class="action-btn"
              @click="onDelete(item.id)"
            >
              <font-awesome-icon icon="trash" />
            </div> -->
          </div>
        </template>

        <template v-slot:cell(status)="data">
          <toggle
            v-if="role === '911'"
            v-model="data.item.status"
            :falseValue="0"
            :trueValue="1"
            @change="updateStatus(data.item.id)"
          />
        </template>
      </b-table>
      <b-row>
        <b-col cols="2">
          <b-form-select
            v-model="perPage"
            :options="[5, 10, 25]"
            class="per-page"
            @change="fetchBalances"
          >
          </b-form-select>
          data
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
        <form @submit="onSubmit">
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
          <div class="form-group" v-if="isEdit && role === '911'">
            <label for="tf-amount" class="font-bold fsz-14">
              Nominal
              <span class="red">*</span>
            </label>
            <vue-numeric
              id="tf-amount"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.amount.$error }"
              currency="Rp"
              separator="."
              placeholder="Masukkan nominal transfer"
              v-model="$v.addForm.amount.$model"
            ></vue-numeric>
            <b-form-invalid-feedback id="nama-kas">
              Nominal tidak boleh kosong
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
    <b-modal id="modal-transfer" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form @submit="postTransfer">
          <div class="form-group">
            <label for="tf-from" class="font-bold fsz-14">
              Sumber Kas
              <span class="red">*</span>
            </label>
            <multiselect
              id="tf-from"
              v-model="$v.tfForm.from.$model"
              :options="dataBalance.map((blc) => blc.id)"
              :custom-label="(opt) => dataBalance.find((x) => x.id == opt).name"
              placeholder="Pilih jenis kas"
              :class="{
                invalid: $v.tfForm.from.$error,
                'multiselect-custom': !$v.tfForm.from.$error,
              }"
            ></multiselect>
            <small v-if="$v.tfForm.from.$error" class="red">
              Jenis kas tidak boleh kosong
            </small>
          </div>
          <div class="form-group">
            <label for="tf-to" class="font-bold fsz-14">
              Tujuan Kas
              <span class="red">*</span>
            </label>
            <multiselect
              id="tf-to"
              v-model="$v.tfForm.to.$model"
              :options="dataBalance.map((blc) => blc.id)"
              :custom-label="(opt) => dataBalance.find((x) => x.id == opt).name"
              placeholder="Pilih jenis kas"
              :class="{
                invalid: $v.tfForm.to.$error,
                'multiselect-custom': !$v.tfForm.to.$error,
              }"
            ></multiselect>
            <small v-if="$v.tfForm.to.$error" class="red">
              Jenis kas tidak boleh kosong
            </small>
          </div>
          <div class="form-group">
            <label for="tf-amount" class="font-bold fsz-14">
              Nominal
              <span class="red">*</span>
            </label>
            <vue-numeric
              id="tf-amount"
              class="form-control"
              :class="{ 'is-invalid': $v.tfForm.amount.$error }"
              currency="Rp"
              separator="."
              placeholder="Masukkan nominal transfer"
              v-model="$v.tfForm.amount.$model"
            ></vue-numeric>
            <b-form-invalid-feedback id="nama-kas">
              Nominal tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
            :disabled="tfForm.from === tfForm.to"
          >
            Transfer Kas
          </button>
        </form>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlus,
  faPen,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { required } from "vuelidate/lib/validators";
import VueNumeric from "vue-numeric";
import jwtService from "../../service/jwt.service";
// import axios from "axios";

library.add(faPen, faTrash, faSearch, faPlus);

export default {
  components: {
    VueNumeric,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Manajemen Kas",
    subheading: "Halaman ini digunakan untuk mengelola jenis kas",
    addtext: "Tambah Kas",
    tftext: "Transfer Kas",
    role: jwtService.getRole(),
    fields: [
      { key: "index", label: "#" },
      { key: "code", label: "Kode" },
      { key: "name", label: "Nama Kas" },
      { key: "description", label: "Deskripsi" },
      { key: "amount", label: "Saldo Kas" },
      { key: "actions", label: "Action" },
      { key: "status", label: "Status" },
    ],
    dataBalance: [],

    searchInput: "",
    currentPage: 1,
    perPage: 5,
    rows: 0,

    modalTitle: "",
    isEdit: false,

    addForm: {
      id: "",
      code: "",
      name: "",
      amount: 0,
      description: "",
    },

    tfForm: {
      from: "",
      to: "",
      amount: 0,
    },
  }),
  validations: {
    addForm: {
      code: { required },
      name: { required },
      amount: {},
      description: { required },
    },
    tfForm: {
      from: { required },
      to: { required },
      amount: { required },
    },
  },
  computed: {
    // rows() {
    //   return this.dataBalance.length;
    // },
  },
  methods: {
    fetchBalances() {
      this.$api
        .get(`balances?size=9999`)
        .then((res) => {
          this.dataBalance = res.data.items;
          this.rows = res.data.total;
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    resetForm() {
      this.addForm = {
        id: "",
        code: "",
        name: "",
        amount: 0,
        description: "",
      };
      this.$v.$reset();
    },
    onAdd() {
      this.modalTitle = "Tambah Jenis Kas";
      this.isEdit = false;
      this.resetForm();
      this.$bvModal.show("modal-balance");
    },
    onTransfer() {
      this.modalTitle = "Transfer Saldo Kas";
      this.isEdit = false;
      this.$v.$reset();
      this.tfForm = {
        from: "",
        to: "",
        amount: 0,
      };
      this.$bvModal.show("modal-transfer");
    },
    postTransfer(ev) {
      ev.preventDefault();
      this.$v.tfForm.$touch();
      if (!this.$v.tfForm.$error) {
        this.$api
          .post(`balance/transfer`, this.tfForm)
          .then((res) => {
            if (res.status === 200) {
              this.fetchBalances();
              this.$bvModal.hide("modal-transfer");
              this.$swal({
                toast: true,
                position: "top-end",
                showClass: { popup: "" },
                icon: "success",
                title: `Berhasil transfer kas`,
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", this.$swal.stopTimer);
                  toast.addEventListener("mouseleave", this.$swal.resumeTimer);
                },
              });
            }
          })
          .catch((err) => {
            if (err.message === "Request failed with status code 400") {
              this.$swal({
                icon: "error",
                title: "Oops...",
                text: "Nominal melebihi saldo!",
                timer: 1500,
                width: 350,
                showConfirmButton: false,
              });
              this.addForm.amount = 0;
            }
          });
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        if (this.isEdit) {
          this.$api
            .put("balances/" + this.addForm.id, this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchBalances();
                this.$bvModal.hide("modal-balance");
                this.toastAlert("update");
              }
            })
            .catch((err) => {
              if (err.message === "Request failed with status code 409") {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Kode pembayaran sudah ada!",
                  showConfirmButton: false,
                  width: "25em",
                  timer: 2500,
                });
              }
            });
        } else {
          this.$api
            .post("balances", this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchBalances();
                this.$bvModal.hide("modal-balance");
                this.toastAlert("menambah");
              }
            })
            .catch((err) => {
              if (err.message === "Request failed with status code 409") {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Kode kas sudah ada!",
                  showConfirmButton: false,
                  width: "25em",
                  timer: 2500,
                });
              }
            });
        }
      }
    },
    onEdit(data) {
      this.modalTitle = `Edit Pembayaran ${data.name}`;
      this.isEdit = true;
      this.resetForm();
      this.addForm = {
        id: data.id,
        code: data.code,
        name: data.name,
        amount: data.amount,
        description: data.description,
      };
      this.$bvModal.show("modal-balance");
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
            .delete(`balances/${id}`)
            .then((res) => {
              if (res.status === 200) {
                this.fetchBalances();
                this.toastAlert("menghapus");
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    updateStatus(id) {
      this.$api.put(`settings/balance/${id}/enable`).catch((err) => {
        alert(err.message);
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
  },
  mounted() {
    this.fetchBalances();
  },
};
</script>

<style>
.payment-data td:first-child {
  width: 5%;
}
.tf-svg {
  width: 16px;
  margin-right: 6px;
  fill: #fff;
}
/* 
.role-data td:last-child {
  width: 10%;
} */
</style>
