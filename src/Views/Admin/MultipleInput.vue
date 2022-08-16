<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :addtext="addtext"
      :clickHandler="onAdd"
    ></page-title>
    <!-- {{ inputChecked }} -->
    <b-row>
      <b-col cols="8">
        <b-card class="main-card mb-4">
          <template #header>
            <b-row>
              <b-col cols="4">
                <multiselect
                  id="filter-user"
                  v-model="filterUser"
                  :options="dataUsers.map((usr) => usr.id)"
                  :custom-label="
                    (opt) => dataUsers.find((x) => x.id == opt).username
                  "
                  :show-labels="false"
                  @input="filterUsers"
                  @remove="clearFilter"
                  placeholder="Filter Pengguna"
                ></multiselect>
              </b-col>
              <b-col cols="4">
                <multiselect
                  id="filter-grup"
                  v-model="filterGroup"
                  :options="dataGroups.map((grp) => grp.id)"
                  :custom-label="
                    (opt) => dataGroups.find((x) => x.id == opt).name
                  "
                  :show-labels="false"
                  @input="filterGroups"
                  @remove="clearFilter"
                  placeholder="Filter Grup"
                ></multiselect>
              </b-col>
              <b-col cols="4">
                <multiselect
                  id="filter-ctg"
                  v-model="filterCategory"
                  :options="dataCategories.map((ctg) => ctg.id)"
                  :custom-label="
                    (opt) => dataCategories.find((x) => x.id == opt).name
                  "
                  :show-labels="false"
                  @input="filterCategories1"
                  @remove="clearFilter"
                  placeholder="Filter Kategori"
                ></multiselect>
              </b-col>
              <!-- <b-col cols="7">
                <h5 class="mb-0 mt-2">Tabel Input</h5>
              </b-col>
              <b-col cols="4" class="pr-0">
                <b-input-group>
                  <template #prepend>
              cell      <b-input-group-text class="bg-primary">
                      <font-awesome-icon icon="search" style="color: #fff" />
                    </b-input-group-text>
                  </template>
                  <b-form-input
                    placeholder="Cari data ..."
                    v-model="searchInput"
                  ></b-form-input>
                </b-input-group>
              </b-col>
              <b-col cols="1">
                <button class="btn btn-primary w-100">
                  <font-awesome-icon icon="list" />
                </button>
              </b-col> -->
            </b-row>
          </template>
          <b-table
            id="payment-table"
            small
            :fields="fields"
            :items="dataInputs"
            :hover="true"
            :filter="searchInput"
            :per-page="perPage"
            :current-page="currentPage"
            responsive="sm"
            tbody-tr-class="payment-data"
            show-empty
          >
            <template #cell(index)="data">
              <b-form-checkbox
                :id="`input-${data.index}`"
                v-model="inputChecked"
                :value="data.item"
              >
              </b-form-checkbox>
            </template>

            <template #cell(user)="data">
              <!-- <div v-if="data.item.category != null">
                </div> -->
              {{ data.item.user.first_name }}
              {{ data.item.user.last_name }}
            </template>

            <template #cell(group)="data">
              {{ data.item.group.name }}
            </template>

            <template #cell(category)="data">
              {{ data.item.category.name }}
            </template>

            <template #cell(amount)="data">
              {{ data.item.amount | formatRp }}
            </template>

            <template v-slot:cell(actions)="{ item }">
              <div class="row action-wrapper">
                <div class="action-btn" @click="onEdit(item)">
                  <font-awesome-icon icon="pen" />
                </div>
                <div class="action-btn" @click="onDelete(item.id)">
                  <font-awesome-icon icon="trash" />
                </div>
              </div>
            </template>
          </b-table>
          <b-row>
            <!-- <b-col cols="4">
              <b-form-select
                v-model="perPage"
                :options="[5, 10, 25]"
                class="per-page"
                @change="fetchInput"
              >
              </b-form-select>
              data
            </b-col> -->
            <!-- <b-col cols="8">
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                align="right"
                aria-controls="payment-table"
                class="mb-1"
              >
              </b-pagination>
            </b-col> -->
          </b-row>
        </b-card>
      </b-col>
      <b-col cols="4">
        <b-card class="main-card" header="Form Kelengkapan Transaksi">
          <b-form @submit="onSubmitPost">
            <div class="form-group">
              <label for="tx-balance" class="font-bold fsz-14">
                Jenis Transaksi
              </label>
              <multiselect
                id="level-category"
                v-model="$v.addForm.is_income.$model"
                :options="optionsType.map((opt) => opt.value)"
                :custom-label="
                  (opt) => optionsType.find((x) => x.value == opt).text
                "
                placeholder="Pilih jenis transaksi"
                :class="{
                  invalid: $v.addForm.is_income.$error,
                  'multiselect-custom': !$v.addForm.is_income.$error,
                }"
              ></multiselect>
              <small v-if="$v.addForm.balance_id.$error" class="red">
                Jenis transaksi tidak boleh kosong
              </small>
            </div>

            <b-form-group
              label="Nama Transaksi"
              label-for="mass-name"
              class="font-bold fsz-14"
            >
              <b-form-input
                id="mass-name"
                type="text"
                v-model="$v.addForm.name.$model"
                :class="{ 'is-invalid': $v.addForm.name.$error }"
                placeholder="Masukkan nama transaksi"
              ></b-form-input>
              <b-form-invalid-feedback id="mass-name">
                Nama transaksi tidak boleh kosong
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Kontak"
              label-for="mass-contact"
              class="font-bold fsz-14"
            >
              <b-form-input
                id="mass-contact"
                type="text"
                v-model="$v.addForm.contact.$model"
                :class="{ 'is-invalid': $v.addForm.contact.$error }"
                placeholder="Masukkan kontak"
              ></b-form-input>
              <b-form-invalid-feedback id="mass-contact">
                Kontak tidak boleh kosong
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label="Nama Kontak"
              label-for="mass-ctname"
              class="font-bold fsz-14"
            >
              <b-form-input
                id="mass-ctname"
                type="text"
                v-model="$v.addForm.contact_name.$model"
                :class="{ 'is-invalid': $v.addForm.contact_name.$error }"
                placeholder="Masukkan nama kontak"
              ></b-form-input>
              <b-form-invalid-feedback id="mass-ctname">
                Nama kontak tidak boleh kosong
              </b-form-invalid-feedback>
            </b-form-group>

            <div class="form-group">
              <label for="tx-balance" class="font-bold fsz-14">
                Nama Kas
              </label>
              <multiselect
                id="tx-balance"
                v-model="$v.addForm.balance_id.$model"
                :options="dataBalances.map((blc) => blc.id)"
                :custom-label="
                  (opt) => dataBalances.find((x) => x.id == opt).name
                "
                placeholder="Pilih jenis kas"
                :class="{
                  invalid: $v.addForm.balance_id.$error,
                  'multiselect-custom': !$v.addForm.balance_id.$error,
                }"
                :disabled="isDisabled"
              ></multiselect>
              <small v-if="$v.addForm.balance_id.$error" class="red">
                Jenis kas tidak boleh kosong
              </small>
            </div>

            <div class="form-group">
              <label for="tx-payment" class="font-bold fsz-14">
                Jenis Pembayaran <span class="red">*</span>
              </label>
              <multiselect
                id="tx-payment"
                v-model="$v.addForm.payment_id.$model"
                :options="dataPayments.map((pay) => pay.id)"
                :custom-label="
                  (opt) => dataPayments.find((x) => x.id == opt).name
                "
                placeholder="Pilih jenis pembayaran"
                :class="{
                  invalid: $v.addForm.payment_id.$error,
                  'multiselect-custom': !$v.addForm.payment_id.$error,
                }"
                :disabled="isDisabled"
              ></multiselect>
              <small v-if="$v.addForm.payment_id.$error" class="red">
                Jenis pembayaran tidak boleh kosong
              </small>
            </div>

            <b-form-group
              label="Deskripsi"
              label-for="mass-desc"
              class="font-bold fsz-14"
            >
              <b-form-textarea
                id="mass-desc"
                v-model="$v.addForm.description.$model"
                placeholder="Masukkan deskripsi"
                rows="2"
              >
              </b-form-textarea>
            </b-form-group>

            <b-form-group
              label="Catatan"
              label-for="mass-note"
              class="font-bold fsz-14"
            >
              <b-form-textarea
                id="mass-note"
                v-model="$v.addForm.note.$model"
                placeholder="Masukkan catatan"
                rows="2"
              >
              </b-form-textarea>
            </b-form-group>

            <div class="text-right">
              <b-button
                type="reset"
                variant="danger"
                class="font-bold mr-2"
                @click="resetFormPost"
                >Reset</b-button
              >
              <b-button type="submit" variant="primary" class="font-bold"
                >Submit</b-button
              >
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>

    <b-modal id="modal-input" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form @submit="onSubmit">
          <div class="form-group">
            <label for="tx-user" class="font-bold fsz-14">
              Nama User <span class="red">*</span>
            </label>
            <multiselect
              id="tx-user"
              v-model="$v.inputForm.user_id.$model"
              :options="dataUsers"
              :custom-label="customName"
              placeholder="Pilih pengguna"
              :class="{
                invalid: $v.inputForm.user_id.$error,
                'multiselect-custom': !$v.inputForm.user_id.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.inputForm.user_id.$error" class="red">
              Nama tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="tx-balance" class="font-bold fsz-14">
              Nama Grup <span class="red">*</span>
            </label>
            <multiselect
              id="tx-balance"
              v-model="$v.inputForm.group_id.$model"
              :options="dataGroups.map((blc) => blc.id)"
              :custom-label="(opt) => dataGroups.find((x) => x.id == opt).name"
              placeholder="Pilih grup"
              :allow-empty="false"
              :hideSelected="true"
              :class="{
                invalid: $v.inputForm.group_id.$error,
                'multiselect-custom': !$v.inputForm.group_id.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.inputForm.group_id.$error" class="red">
              Grup tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="tx-balance" class="font-bold fsz-14">
              Nama Kategori <span class="red">*</span>
            </label>
            <multiselect
              id="tx-balance"
              v-model="$v.inputForm.category_id.$model"
              :options="dataCategories.map((ctg) => ctg.id)"
              :custom-label="
                (opt) => dataCategories.find((x) => x.id == opt).name
              "
              placeholder="Pilih jenis kategori"
              :allow-empty="false"
              :hideSelected="true"
              :class="{
                invalid: $v.inputForm.category_id.$error,
                'multiselect-custom': !$v.inputForm.category_id.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.inputForm.category_id.$error" class="red">
              Jenis kategori tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="tx-amount" class="font-bold fsz-14">
              Nominal <span class="red">*</span>
            </label>
            <vue-numeric
              id="tx-amount"
              class="form-control"
              :class="{ 'is-invalid': $v.inputForm.amount.$error }"
              currency="Rp"
              separator="."
              placeholder="Masukkan nama pembayaran"
              v-model="$v.inputForm.amount.$model"
              :disabled="isDisabled"
            ></vue-numeric>
            <b-form-invalid-feedback id="tx-amount">
              Nominal pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
          >
            Simpan Pembayaran
          </button>
        </form>
      </template>
    </b-modal>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/PageTitle.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { required } from "vuelidate/lib/validators";
import VueNumeric from "vue-numeric";
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPen,
  faTrash,
  faSearch,
  faInfo,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { setTimeout } from "timers";

library.add(faPen, faTrash, faSearch, faInfo, faList);

export default {
  components: {
    PageTitle,
    VueNumeric,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Multiple Input Transaksi",
    subheading:
      "Halaman ini digunakan untuk mengelola transaksi secara multiple",
    addtext: "Tambah Input",
    fields: [
      { key: "index", label: "#" },
      { key: "user", label: "Pengguna" },
      { key: "group", label: "Grup" },
      { key: "category", label: "Kategori" },
      { key: "amount", label: "Nominal" },
      { key: "actions", label: "Action" },
    ],
    dataInputs: [],
    dataUsers: [],
    dataBalances: [],
    dataPayments: [],
    dataCategories: [],
    dataGroups: [],
    dataCategoriesFiltered: [],
    inputChecked: [],

    optionsType: [
      {
        value: 0,
        text: "Pengeluaran",
      },
      {
        value: 1,
        text: "Pemasukan",
      },
    ],

    filterUser: "",
    filterGroup: "",
    filterCategory: "",

    searchInput: "",
    currentPage: 1,
    perPage: 5,
    rows: 0,

    modalTitle: "",
    isEdit: false,
    isDisabled: false,

    addForm: {
      id: "",
      type: "",
      is_income: null,
      name: "",
      contact: "",
      contact_name: "",
      balance_id: "",
      payment_id: "",
      description: "",
      note: "",
      media: "",
      tax: 0,
      tax_type: 0,
      discount: 0,
      discount_type: 0,
    },

    inputForm: {
      id: "",
      amount: 0,
      user_id: "",
      category_id: "",
      group_id: "",
    },
  }),
  validations: {
    inputForm: {
      amount: { required },
      user_id: { required },
      category_id: { required },
      group_id: { required },
    },
    addForm: {
      is_income: { required },
      name: { required },
      contact: { required },
      contact_name: { required },
      balance_id: { required },
      payment_id: { required },
      description: { required },
      note: { required },
      media: {},
      tax: {},
      tax_type: {},
      discount: {},
      discount_type: {},
    },
  },
  // computed: {
  //   rows() {
  //     return this.dataInputs.length;
  //   },
  // },
  methods: {
    fetchInput() {
      this.$api
        .get(`inputs?size=99999`)
        .then((res) => {
          this.dataInputs = res.data.items;
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchUsers() {
      this.$api
        .get(`users`)
        .then((res) => {
          this.dataUsers = [];
          res.data.items.map((obj) => {
            if (obj.is_admin !== 1) this.dataUsers.push(obj);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchGroups() {
      this.$api
        .get(`groups`)
        .then((res) => {
          this.dataGroups = res.data.items;
        })
        .catch((err) => {
          alert(err);
        });
    },
    fetchBalances() {
      this.$api
        .get(`balances`)
        .then((res) => {
          this.dataBalances = res.data.items;
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchPayments() {
      this.$api
        .get(`payments`)
        .then((res) => {
          this.dataPayments = res.data.items;
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchCategories() {
      this.$api
        .get(`categories`)
        .then((res) => {
          // this.dataCategories = res.data.items;
          this.dataCategories = [];
          res.data.items.map((obj) => {
            if (obj.level === 3) this.dataCategories.push(obj);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    filterCategories() {
      if (this.level !== "") {
        this.addForm.category_id = "";
        this.dataCategoriesFiltered = [];
        this.dataCategories.map((a) => {
          if (a.level === this.level) this.dataCategoriesFiltered.push(a);
        });
      }
    },
    resetForm() {
      this.inputForm = {
        id: "",
        amount: 0,
        user_id: "",
        category_id: "",
        group_id: "",
      };
      this.$v.inputForm.$reset();
    },
    resetFormPost() {
      this.addForm = {
        id: "",
        type: "",
        is_income: null,
        name: "",
        contact: "",
        contact_name: "",
        balance_id: "",
        payment_id: "",
        description: "",
        note: "",
        media: "",
        tax: 0,
        tax_type: 0,
        discount: 0,
        discount_type: 0,
      };
      this.$v.addForm.$reset();
    },
    fillForm(data) {
      // this.addForm = {
      //   id: data.id,
      //   type: "Pemasukan",
      //   is_income: 1,
      //   amount: data.amount,
      //   name: data.name,
      //   contact: data.contact,
      //   contact_name: data.contact_name,
      //   user_id: data.user,
      //   balance_id: data.balance_id,
      //   payment_id: data.payment_id,
      //   description: "Deskripsi",
      //   note: data.note,
      // };
      this.inputForm = {
        id: data.id,
        amount: data.amount,
        user_id: data.user,
        category_id: data.category.id,
        group_id: data.group.id,
      };
    },
    customName({ first_name, last_name, username }) {
      return `${first_name} ${last_name} - ${username}`;
    },
    onAdd() {
      this.modalTitle = "Tambah Input";
      this.isDisabled = false;
      this.isEdit = false;
      this.resetForm();
      this.$bvModal.show("modal-input");
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.inputForm.user_id !== null) {
        this.inputForm.user_id = this.inputForm.user_id.id;
      }
      this.$v.inputForm.$touch();
      if (!this.$v.inputForm.$error) {
        if (this.isEdit) {
          this.$api
            .put("inputs/" + this.inputForm.id, this.inputForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchInput();
                this.$bvModal.hide("modal-input");
                this.toastAlert("update");
              }
            })
            .catch((err) => {
              alert(err);
              this.$bvModal.hide("modal-input");
            });
        } else {
          this.$api
            .post("inputs", this.inputForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchInput();
                this.$bvModal.hide("modal-input");
                this.toastAlert("menambah");
              }
            })
            .catch((err) => {
              alert(err);
              this.$bvModal.hide("modal-input");
            });
        }
      }
    },
    onSubmitPost(evt) {
      evt.preventDefault();
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        const postForm = [];
        this.inputChecked.map((a) => {
          postForm.push({
            amount: a.amount,
            balance_id: this.addForm.balance_id,
            category_id: a.category_id,
            contact: this.addForm.contact,
            contact_name: this.addForm.contact_name,
            description: this.addForm.description,
            discount: 0,
            discount_type: 0,
            group_id: a.group_id,
            is_income: this.addForm.is_income,
            media: "",
            name: this.addForm.name,
            payment_id: this.addForm.payment_id,
            tax: 0,
            tax_type: 0,
            type: "Mass",
            user_id: a.user_id,
          });
        });
        let postFormObj = { "item": postForm };
        setTimeout(() => {
          this.$api
            .post(`transaction/mass`, postFormObj)
            .then(() => {
              this.resetFormPost();
              this.toastAlert("menambahkan");
              this.$router.push("/admin/dashboard");
            })
            .catch((err) => {
              alert(err.message);
            });
        }, 2000);
      }
    },
    onEdit(data) {
      this.modalTitle = `Edit Transaksi ${data.name}`;
      this.isDisabled = false;
      this.isEdit = true;
      this.resetForm();
      this.fillForm(data);
      this.$bvModal.show("modal-input");
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
            .delete(`inputs/${id}`)
            .then((res) => {
              this.fetchInput();
              if (res.status === 200) {
                this.toastAlert("menghapus");
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    filterUsers() {
      this.filterGroup = "";
      this.filterCategory = "";
      this.$api
        .get(`inputs/user/${this.filterUser}`)
        .then((res) => {
          this.dataInputs = res.data.items;
        })
        .catch((err) => {
          alert(err);
        });
    },
    filterGroups() {
      this.filterUser = "";
      this.filterCategory = "";
      this.$api
        .get(`inputs/group/${this.filterGroup}`)
        .then((res) => {
          this.dataInputs = res.data.items;
        })
        .catch((err) => {
          alert(err);
        });
    },
    filterCategories1() {
      this.filterUser = "";
      this.filterGroup = "";
      this.$api
        .get(`inputs/category/${this.filterCategory}`)
        .then((res) => {
          this.dataInputs = res.data.items;
        })
        .catch((err) => {
          alert(err);
        });
    },
    clearFilter() {
      setTimeout(() => {
        this.fetchInput();
      }, 250);
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
    this.fetchUsers();
    this.fetchGroups();
    this.fetchInput();
    this.fetchPayments();
    this.fetchBalances();
    this.fetchCategories();
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
