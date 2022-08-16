<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :addtext="addtext"
      :clickHandler="onAdd"
    ></page-title>
    <b-card class="main-card mb-4">
      <template #header>
        <b-row>
          <b-col cols="8">
            <h5 class="mb-0 mt-2">Tabel Akun Pembayaran</h5>
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
        :items="dataAccounts"
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

        <template v-slot:cell(actions)="{ item }">
          <div class="row action-wrapper">
            <div class="action-btn" @click="onDetailTx(item.id)">
              <font-awesome-icon icon="receipt" />
            </div>
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
          <!-- {{ data.item.status }} -->
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
            @change="fetchAccounts"
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

    <b-modal id="modal-payment" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form @submit="onSubmit">
          <div class="form-group">
            <label for="kode-pay" class="font-bold fsz-14"
              >Kode Akun <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.code.$error }"
              id="kode-pay"
              v-model="$v.addForm.code.$model"
              placeholder="Masukkan kode akun pembayaran"
            />
            <b-form-invalid-feedback id="kode-role">
              Kode akun pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="nama-pay" class="font-bold fsz-14"
              >Nama Akun <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.name.$error }"
              id="nama-pay"
              v-model="$v.addForm.name.$model"
              placeholder="Masukkan nama akun pembayaran"
            />
            <b-form-invalid-feedback id="nama-role">
              Nama akun pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="number-pay" class="font-bold fsz-14"
              >Nomor Akun <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.number.$error }"
              id="number-pay"
              v-model="$v.addForm.number.$model"
              placeholder="Masukkan nomor akun"
            />
            <b-form-invalid-feedback id="number-pay">
              <span v-if="!$v.addForm.number.required"
                >Nomor akun tidak boleh kosong</span
              >
              <!-- <span v-if="!$v.addForm.number.numeric">Hanya menerima inputan angka 0-9</span> -->
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="desc-pay" class="font-bold fsz-14"
              >Deskripsi Akun <span class="red">*</span></label
            >
            <b-form-textarea
              id="desc-pay"
              :class="{
                'is-invalid': $v.addForm.description.$error,
              }"
              v-model="$v.addForm.description.$model"
              placeholder="Masukkan deskripsi akun"
              rows="3"
            >
            </b-form-textarea>
            <b-form-invalid-feedback id="desc-pay">
              Deskripsi akun pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
          >
            Simpan Akun
          </button>
        </form>
      </template>
    </b-modal>
    <b-modal id="modal-detailtx" hide-footer size="lg">
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">Detail Transaksi Akun</div>
      </template>
      <template #default="{ hide }">
        <b-table-simple hover responsive>
          <thead>
            <b-th>#</b-th>
            <b-th>Jenis</b-th>
            <b-th>Tgl</b-th>
            <b-th>Transaksi</b-th>
            <b-th>Kategori</b-th>
            <b-th>User</b-th>
            <b-th>Nominal</b-th>
          </thead>
          <tbody>
            <b-tr v-for="(data, i) in dataDetailTx" :key="data.id">
              <b-td>{{ ++i }}</b-td>
              <b-td>
                <span class="badge badge-primary" v-if="data.is_income === 1"
                  >PEMASUKAN</span
                >
                <span class="badge badge-danger text-white" v-else
                  >PENGELUARAN</span
                >
              </b-td>
              <b-td>{{ data.created_at | formatDate }}</b-td>
              <b-td>{{ data.name }}</b-td>
              <b-td>{{ data.category.name }}</b-td>
              <b-td>{{
                `${data.user.first_name} ${data.user.last_name}`
              }}</b-td>
              <b-td :class="{ 'red':data.is_income === 0  }">{{ data.amount | formatRp }}</b-td>
            </b-tr>
          </tbody>
          <tfoot>
            <b-tr>
              <b-th colspan="5"></b-th>
              <b-th>TOTAL</b-th>
              <b-th>{{ totalDetailTx | formatRp }}</b-th>
            </b-tr>
          </tfoot>
        </b-table-simple>
      </template>
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/PageTitle.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPen,
  faTrash,
  faSearch,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { required } from "vuelidate/lib/validators";
import jwtService from "../../service/jwt.service";
import moment from "moment";
// import axios from "axios";

library.add(faPen, faTrash, faReceipt, faSearch);

export default {
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Manajemen Akun Pembayaran",
    subheading: "Halaman ini digunakan untuk mengelola pembayaran",
    addtext: "Tambah Akun",
    fields: [
      { key: "index", label: "#" },
      { key: "code", label: "Kode" },
      { key: "name", label: "Pembayaran" },
      { key: "number", label: "No. Pembayaran" },
      { key: "description", label: "Deskripsi" },
      { key: "actions", label: "Action" },
      { key: "status", label: "Status" },
    ],
    dataAccounts: [],
    dataDetailTx: [],
    totalDetailTx: 0,
    role: jwtService.getRole(),

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
      number: "",
      description: "",
    },
  }),
  validations: {
    addForm: {
      code: { required },
      name: { required },
      number: { required },
      description: { required },
    },
  },
  // computed: {
  //   rows() {
  //     return this.dataAccounts.length;
  //   },
  // },
  methods: {
    fetchAccounts() {
      this.$api
        .get(`accounts?size=9999`)
        .then((res) => {
          this.dataAccounts = res.data.items;
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
        number: "",
        description: "",
      };
      this.$v.$reset();
    },
    onAdd() {
      this.modalTitle = "Tambah Akun";
      this.isEdit = false;
      this.resetForm();
      this.$bvModal.show("modal-payment");
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        if (this.isEdit) {
          this.$api
            .put("accounts/" + this.addForm.id, this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchAccounts();
                this.$bvModal.hide("modal-payment");
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
              alert(err.message);
            });
        } else {
          this.$api
            .post("accounts", this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchAccounts();
                this.$bvModal.hide("modal-payment");
                this.toastAlert("menambah");
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
        }
      }
    },
    onEdit(data) {
      this.modalTitle = `Edit Akun ${data.name}`;
      this.isEdit = true;
      this.resetForm();
      this.addForm = {
        id: data.id,
        code: data.code,
        name: data.name,
        number: data.number,
        description: data.description,
      };
      this.$bvModal.show("modal-payment");
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
            .delete(`accounts/${id}`)
            .then((res) => {
              if (res.status === 200) {
                this.fetchAccounts();
                this.toastAlert("menghapus");
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    onDetailTx(id) {
      this.$bvModal.show("modal-detailtx");
      this.$api
        .get(`transactions/account/${id}`)
        .then((res) => {
          this.dataDetailTx = res.data.items;
          this.totalDetailTx = this.dataDetailTx.reduce((result, value) => {
            if (value.is_income === 1) {
              return result + value.amount;
            } else {
              return result - value.amount;
            }
          }, 0);
        })
        .catch((err) => {
          alert(err);
        });
    },
    updateStatus(id) {
      this.$api.put(`settings/account/${id}/enable`).catch((err) => {
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
  mounted() {
    this.fetchAccounts();
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
        return moment(String(value)).locale("id").format("DD\xa0MMMM\xa0YYYY");
      }
    },
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
:root {
  --toggle-width: 2.2rem;
  --toggle-height: 1.15rem;
  --toggle-border: 0.1rem;
  --toggle-bg-on: #69aa8a;
  --toggle-bg-off: #ccc;
}
</style>
