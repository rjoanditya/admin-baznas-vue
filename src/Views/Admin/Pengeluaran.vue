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
          <b-col cols="7">
            <h5 class="mb-0 mt-2">Tabel Pengeluaran</h5>
          </b-col>
          <b-col cols="3" class="pr-0">
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
          <b-col cols="1" class="mx-0 pr-0">
            <button class="btn btn-primary w-100" id="popover-filter">
              <font-awesome-icon icon="filter" />
            </button>
          </b-col>
          <b-col cols="1" class="mx-0">
            <button
              class="btn btn-primary w-100"
              id="popover-filter"
              @click="exportTx"
            >
              <font-awesome-icon icon="file-export" />
            </button>
          </b-col>
          <b-popover
            target="popover-filter"
            placement="bottom"
            triggers="focus"
          >
            <b-tabs content-class="mt-2">
              <b-tab title="Tanggal" active>
                <div class="filter-wrapper">
                  <div class="mb-1">
                    <span class="font-medium">Dari Tanggal</span>
                    <input
                      type="date"
                      class="form-control"
                      v-model="filterDateStart"
                      @input="filterDates"
                    />
                  </div>
                  <div>
                    <span class="font-medium">Hingga Tanggal</span>
                    <input
                      type="date"
                      class="form-control"
                      v-model="filterDateEnd"
                      @input="filterDates"
                    />
                  </div>
                </div>
                <button
                  @click="resetFilter"
                  type="string"
                  class="btn btn-success w-100 mt-2 mb-1 font-bold"
                  style="letter-spacing: 1px"
                >
                  RESET FILTER
                </button>
              </b-tab>
              <b-tab title="Kas">
                <div class="filter-wrapper">
                  <multiselect
                    id="filter-balance"
                    v-model="filterKas"
                    :options="dataBalances.map((blc) => blc.id)"
                    :custom-label="
                      (opt) => dataBalances.find((x) => x.id == opt).name
                    "
                    :show-labels="false"
                    @input="filterBalance"
                    placeholder="Filter Kas"
                  ></multiselect>
                </div>
                <button
                  @click="resetFilter"
                  type="string"
                  class="btn btn-success w-100 mt-2 mb-1 font-bold text-white"
                  style="letter-spacing: 1px"
                >
                  RESET FILTER
                </button>
              </b-tab>
              <b-tab title="Kategori">
                <div class="filter-wrapper">
                  <multiselect
                    id="filter-kategori"
                    v-model="filterKategori"
                    :options="dataCategories3.map((ctg) => ctg.id)"
                    :custom-label="
                      (opt) => dataCategories3.find((x) => x.id == opt).name
                    "
                    :show-labels="false"
                    @input="filterCategories1"
                    placeholder="Filter Kategori"
                  ></multiselect>
                </div>
                <button
                  @click="resetFilter"
                  type="string"
                  class="btn btn-success w-100 mt-2 mb-1 font-bold text-white"
                  style="letter-spacing: 1px"
                >
                  RESET FILTER
                </button>
              </b-tab>
              <b-tab title="User">
                <div class="filter-wrapper">
                  <multiselect
                    id="filter-kategori"
                    v-model="filterUser"
                    :options="dataUsers.map((usr) => usr.id)"
                    :custom-label="
                      (opt) => dataUsers.find((x) => x.id == opt).username
                    "
                    :show-labels="false"
                    @input="filterUsers"
                    placeholder="Filter User"
                  ></multiselect>
                </div>
                <button
                  @click="resetFilter"
                  type="string"
                  class="btn btn-success w-100 mt-2 mb-1 font-bold text-white"
                  style="letter-spacing: 1px"
                >
                  RESET FILTER
                </button>
              </b-tab>
            </b-tabs>
          </b-popover>
        </b-row>
      </template>
      <b-table
        id="payment-table"
        small
        :fields="fields"
        :items="dataOutcome"
        :hover="true"
        :filter="searchInput"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm"
        tbody-tr-class="payment-data"
        show-empty
      >
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <template #cell(tanggal)="data">
          {{ data.item.created_at | formatDate }}
        </template>

        <!-- A virtual column -->
        <template #cell(user)="data">
          <div v-if="data.item.user != null">
            {{ data.item.user.first_name }}
          </div>
        </template>

        <template #cell(category)="data">
          <div v-if="data.item.category != null">
            {{ data.item.category.name }}
          </div>
        </template>

        <template #cell(payment)="data">
          <div v-if="data.item.payment != null">
            {{ data.item.payment.name }}
          </div>
        </template>

        <template #cell(amount)="data">
          {{ data.item.amount | formatRp }}
        </template>

        <template v-slot:cell(actions)="{ item }">
          <div class="row action-wrapper">
            <div
              class="action-btn"
              style="padding: 2px 9px"
              @click="onDetail(item)"
            >
              <font-awesome-icon icon="info" />
            </div>
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
        <b-col cols="2">
          <b-form-select
            v-model="perPage"
            :options="[5, 10, 25]"
            class="per-page"
            @change="fetchOutcome"
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

    <b-modal id="modal-income" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form @submit="onSubmit">
          <!-- <div class="form-group">
            <label for="tx-user" class="font-bold fsz-14">
              Nama User <span class="red">*</span>
            </label>
            <multiselect
              id="tx-user"
              v-model="$v.addForm.user_id.$model"
              :options="dataUsers"
              :custom-label="customName"
              placeholder="Pilih pengguna"
              :class="{
                invalid: $v.addForm.user_id.$error,
                'multiselect-custom': !$v.addForm.user_id.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.addForm.user_id.$error" class="red">
              Nama tidak boleh kosong
            </small>
          </div> -->

          <div class="form-group">
            <label for="tx-name" class="font-bold fsz-14">
              Nama Transaksi <span class="red">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.name.$error }"
              id="tx-name"
              v-model="$v.addForm.name.$model"
              placeholder="Masukkan nama transaksi"
              :disabled="isDisabled"
            />
            <b-form-invalid-feedback id="tx-name">
              Nama transaksi tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label for="tx-contact" class="font-bold fsz-14">
              Kontak <span class="red">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.contact.$error }"
              id="tx-contact"
              v-model="$v.addForm.contact.$model"
              placeholder="Masukkan nama pembayaran"
              :disabled="isDisabled"
            />
            <b-form-invalid-feedback id="tx-contact">
              Kontak pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label for="tx-contactname" class="font-bold fsz-14">
              Nama Kontak <span class="red">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.contact_name.$error }"
              id="tx-contactname"
              v-model="$v.addForm.contact_name.$model"
              placeholder="Masukkan nama pembayaran"
              :disabled="isDisabled"
            />
            <b-form-invalid-feedback id="tx-contactname">
              Nama kontak pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label for="tx-amount" class="font-bold fsz-14">
              Nominal <span class="red">*</span>
            </label>
            <vue-numeric
              id="tx-amount"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.amount.$error }"
              currency="Rp"
              separator="."
              placeholder="Masukkan nama pembayaran"
              v-model="$v.addForm.amount.$model"
              :disabled="isDisabled"
            ></vue-numeric>
            <b-form-invalid-feedback id="tx-amount">
              Nominal pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
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

          <div class="form-group">
            <label for="tx-payment" class="font-bold fsz-14">
              Akun Pembayaran <span class="red">*</span>
            </label>
            <multiselect
              id="tx-payment"
              v-model="$v.addForm.account_id.$model"
              :options="dataAccounts.map((acc) => acc.id)"
              :custom-label="
                (opt) => dataAccounts.find((x) => x.id == opt).name
              "
              placeholder="Pilih jenis pembayaran"
              :class="{
                invalid: $v.addForm.account_id.$error,
                'multiselect-custom': !$v.addForm.account_id.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.addForm.account_id.$error" class="red">
              Akun pembayaran tidak boleh kosong
            </small>
          </div>

          <!-- <div class="form-group" v-if="!isEdit">
            <label for="level-category" class="font-bold fsz-14">
              Level Kategori
              <span class="red">*</span>
            </label>
            <multiselect
              id="level-category"
              v-model="$v.level.$model"
              :options="[1, 2, 3]"
              placeholder="Pilih level kategori"
              :class="{
                invalid: $v.level.$error,
                'multiselect-custom': !$v.level.$error,
              }"
              @input="filterCategories"
              @close="$el.ownerDocument.defaultView.console.clear()"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.level.$error" class="red">
              Level kategori tidak boleh kosong
            </small>
          </div> -->

          <div class="form-group">
            <label for="tx-balance" class="font-bold fsz-14">
              Nama Kategori Lv 1 <span class="red">*</span>
            </label>
            <multiselect
              id="tx-balance"
              v-model="$v.category_id1.$model"
              :options="dataCategories1.map((blc) => blc.id)"
              :custom-label="
                (opt) => dataCategories1.find((x) => x.id == opt).name
              "
              placeholder="Pilih jenis kategori"
              :allow-empty="false"
              :hideSelected="true"
              @input="fetchCategories2"
              :class="{
                invalid: $v.category_id1.$error,
                'multiselect-custom': !$v.category_id1.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.category_id1.$error" class="red">
              Kategori level 1 tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="tx-balance" class="font-bold fsz-14">
              Nama Kategori Lv 2 <span class="red">*</span>
            </label>
            <multiselect
              id="tx-balance"
              v-model="$v.category_id2.$model"
              :options="dataCategories2.map((blc) => blc.id)"
              :custom-label="
                (opt) => dataCategories2.find((x) => x.id == opt).name
              "
              placeholder="Pilih jenis kategori"
              :allow-empty="false"
              :hideSelected="true"
              @input="fetchCategories3"
              :class="{
                invalid: $v.category_id2.$error,
                'multiselect-custom': !$v.category_id2.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.category_id2.$error" class="red">
              Kategori level 2 tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="tx-balance" class="font-bold fsz-14">
              Nama Kategori Lv 3 <span class="red">*</span>
            </label>
            <multiselect
              id="tx-balance"
              v-model="$v.category_id3.$model"
              :options="dataCategories3.map((blc) => blc.id)"
              :custom-label="
                (opt) => dataCategories3.find((x) => x.id == opt).name
              "
              placeholder="Pilih jenis kategori"
              :allow-empty="false"
              :hideSelected="true"
              :class="{
                invalid: $v.category_id3.$error,
                'multiselect-custom': !$v.category_id3.$error,
              }"
              :disabled="isDisabled"
            ></multiselect>
            <small v-if="$v.category_id3.$error" class="red">
              Kategori level 3 tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="tx-balance" class="font-bold fsz-14"> Nama Kas </label>
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
            <label for="tx-note" class="font-bold fsz-14"> Catatan </label>
            <b-form-textarea
              v-if="isDisabled"
              id="tx-note"
              :class="{
                'is-invalid': $v.addForm.note.$error,
              }"
              v-model="$v.addForm.note.$model"
              rows="3"
              disabled
            >
            </b-form-textarea>
            <b-form-textarea
              v-else
              id="tx-note"
              :class="{
                'is-invalid': $v.addForm.note.$error,
              }"
              v-model="$v.addForm.note.$model"
              placeholder="Masukkan catatan"
              rows="3"
            >
            </b-form-textarea>
          </div>

          <div class="form-group">
            <label for="tx-description" class="font-bold fsz-14">
              Deskripsi
            </label>
            <b-form-textarea
              v-if="isDisabled"
              id="tx-description"
              :class="{
                'is-invalid': $v.addForm.description.$error,
              }"
              v-model="$v.addForm.description.$model"
              rows="3"
              disabled
            >
            </b-form-textarea>
            <b-form-textarea
              v-else
              id="tx-description"
              :class="{
                'is-invalid': $v.addForm.description.$error,
              }"
              v-model="$v.addForm.description.$model"
              placeholder="Masukkan deskripsi transaksi"
              rows="3"
            >
            </b-form-textarea>
          </div>

          <!-- <div class="form-group">
            <label for="nama-pay" class="font-bold fsz-14"
              >Nama Pembayaran <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.name.$error }"
              id="nama-pay"
              v-model="$v.addForm.name.$model"
              placeholder="Masukkan nama pembayaran"
            />
            <b-form-invalid-feedback id="nama-role">
              Nama jenis pembayaran tidak boleh kosong
            </b-form-invalid-feedback>
          </div> -->
          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
            v-if="!isDisabled"
          >
            Simpan Transaksi
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
import jwtService from "../../service/jwt.service";
import {
  faPen,
  faTrash,
  faSearch,
  faInfo,
  faFilter,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

library.add(faPen, faTrash, faSearch, faInfo, faFilter, faFileExport);

export default {
  components: {
    PageTitle,
    VueNumeric,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Manajemen Transaksi Pengeluaran",
    subheading: "Halaman ini digunakan untuk mengelola transaksi pemasukan",
    addtext: "Tambah Pengeluaran",
    fields: [
      { key: "index", label: "#" },
      { key: "name", label: "Nama" },
      { key: "tanggal", label: "Tanggal" },
      // { key: "user", label: "User" },
      { key: "amount", label: "Nominal" },
      { key: "category", label: "Kategori" },
      { key: "payment", label: "Pembayaran" },
      { key: "actions", label: "Action" },
    ],
    dataOutcome: [],
    dataUsers: [],
    dataBalances: [],
    dataAccounts: [],
    dataPayments: [],
    dataCategories1: [],
    dataCategories2: [],
    dataCategories3: [],
    dataCategoriesFiltered: [],

    filterDateStart: "",
    filterDateEnd: "",
    filterKas: "",
    filterKategori: "",
    filterUser: "",

    searchInput: "",
    currentPage: 1,
    perPage: 5,
    rows: 0,

    modalTitle: "",
    isEdit: false,
    isDisabled: false,

    level: "",
    category_id1: "",
    category_id2: "",
    category_id3: "",
    addForm: {
      id: "",
      type: "Pengeluaran",
      is_income: 0,
      amount: 0,
      name: "",
      contact: "",
      contact_name: "",
      user_id: "",
      balance_id: "",
      category_id: "",
      payment_id: "",
      account_id: "",
      description: "",
      note: "",
      media: "",
      tax: 0,
      tax_type: 0,
      discount: 0,
      discount_type: 0,
    },
  }),
  validations: {
    addForm: {
      amount: { required },
      name: { required },
      contact: { required },
      contact_name: { required },
      user_id: { },
      balance_id: {},
      category_id: { required },
      payment_id: { required },
      account_id: { required },
      description: {},
      note: {},
    },
    // level: { required },
    category_id1: { required },
    category_id2: { required },
    category_id3: { required },
  },
  // computed: {
  //   rows() {
  //     return this.dataOutcome.length;
  //   },
  // },
  methods: {
    fetchOutcome() {
      this.$api
        .get(`transactions?size=99999`)
        .then((res) => {
          this.dataOutcome = [];
          res.data.items.map((obj) => {
            if (obj.is_income === 0 && obj.name !== "Transfer Balance")
              this.dataOutcome.push(obj);
          });
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
          alert(err);
        });
    },
    fetchAccounts() {
      this.$api
        .get(`accounts`)
        .then((res) => {
          this.dataAccounts = res.data.items;
        })
        .catch((err) => {
          alert(err);
        });
    },
    fetchCategories1() {
      this.$api
        .get(`categories/group/1`)
        .then((res) => {
          // console.log(res.data.items);
          this.dataCategories1 = [];
          res.data.items.map((obj) => {
            if (obj.is_income === 0) this.dataCategories1.push(obj);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchCategories2() {
      this.$api
        .get(`categories/group/${this.category_id1}`)
        .then((res) => {
          this.dataCategories2 = [];
          res.data.items.map((obj) => {
            if (obj.is_income === 0) this.dataCategories2.push(obj);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchCategories3() {
      this.$api
        .get(`categories/group/${this.category_id2}`)
        .then((res) => {
          this.dataCategories3 = [];
          res.data.items.map((obj) => {
            if (obj.is_income === 0) this.dataCategories3.push(obj);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    // filterCategories() {
    //   if (this.level !== "") {
    //     this.addForm.category_id = "";
    //     this.dataCategoriesFiltered = [];
    //     this.dataCategories.map((a) => {
    //       if (a.level === this.level) this.dataCategoriesFiltered.push(a);
    //     });
    //   }
    // },
    resetForm() {
      this.addForm = {
        id: "",
        type: "Pengeluaran",
        is_income: 0,
        amount: 0,
        name: "",
        contact: "",
        contact_name: "",
        user_id: jwtService.getID(),
        balance_id: "",
        category_id: "",
        payment_id: "",
        account_id: "",
        description: "",
        note: "",
        tax: 0,
        tax_type: 0,
        discount: 0,
        discount_type: 0,
      };
      this.category_id1 = "";
      this.category_id2 = "";
      this.category_id3 = "";
      this.$v.$reset();
    },
    filterDates() {
      if (this.filterDateStart != "" && this.filterDateEnd != "") {
        this.$api
          .get(
            `transactions/${this.filterDateStart}/date/${this.filterDateEnd}`
          )
          .then((res) => {
            this.dataOutcome = [];
            res.data.items.map((a) => {
              if (a.is_income === 0) this.dataOutcome.push(a);
            });
          })
          .catch((err) => {
            alert(err);
          });
      }
    },
    filterBalance() {
      this.$api
        .get(`transactions/balance/${this.filterKas}`)
        .then((res) => {
          this.dataOutcome = [];
          res.data.items.map((a) => {
            if (a.is_income === 0) this.dataOutcome.push(a);
          });
        })
        .catch((err) => {
          alert(err);
        });
    },
    filterCategories1() {
      this.$api
        .get(`transactions/category/${this.filterKategori}`)
        .then((res) => {
          this.dataOutcome = [];
          res.data.items.map((a) => {
            if (a.is_income === 0) this.dataOutcome.push(a);
          });
        })
        .catch((err) => {
          alert(err);
        });
    },
    filterUsers() {
      this.$api
        .get(`transactions/user/${this.filterUser}`)
        .then((res) => {
          this.dataOutcome = [];
          res.data.items.map((a) => {
            if (a.is_income === 0) this.dataOutcome.push(a);
          });
        })
        .catch((err) => {
          alert(err);
        });
    },
    resetFilter() {
      this.filterDateStart = "";
      this.filterDateEnd = "";
      this.filterKas = "";
      this.filterKategori = "";
      this.filterUser = "";
      this.fetchOutcome();
    },
    fillForm(data) {
      this.addForm = {
        id: data.id,
        type: "Pengeluaran",
        is_income: 0,
        amount: data.amount,
        name: data.name,
        contact: data.contact,
        contact_name: data.contact_name,
        user_id: data.user,
        balance_id: data.balance_id,
        payment_id: data.payment_id,
        account_id: data.account_id,
        description: "Deskripsi",
        note: data.note,
      };
      // this.level = data.category.level;
      // this.filterCategories();
      // this.addForm.category_id = data.category.id;
    },
    customName({ first_name, last_name, username }) {
      return `${first_name} ${last_name} - ${username}`;
    },
    onAdd() {
      this.modalTitle = "Tambah Transaksi Pengeluaran";
      this.isEdit = false;
      this.isDisabled = false;
      this.resetForm();
      this.$bvModal.show("modal-income");
    },
    onSubmit(evt) {
      evt.preventDefault();
      // if (this.addForm.user_id !== null) {
      //   this.addForm.user_id = this.addForm.user_id.id;
      // }
      this.addForm.category_id = this.category_id3;
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        if (this.isEdit) {
          this.$api
            .put("transactions/" + this.addForm.id, this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchOutcome();
                this.$bvModal.hide("modal-income");
                this.toastAlert("update");
              }
            })
            .catch((err) => {
              if (err.response.status === 401) {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Akun belum diverfikasi!",
                  showConfirmButton: false,
                  width: "25em",
                  timer: 2500,
                });
              } else {
                alert(err);
                console(err);
              }
              this.$bvModal.hide("modal-income");
            });
        } else {
          if (this.addForm.balance_id === "a") {
            this.$api
              .post("transactions", {
                type: "Pengeluaran",
                is_income: 0,
                amount: this.addForm.amount,
                name: this.addForm.name,
                contact: this.addForm.contact,
                contact_name: this.addForm.contact_name,
                user_id: this.addForm.user_id,
                category_id: this.addForm.category_id,
                payment_id: this.addForm.payment_id,
                account_id: this.addForm.account_id,
                description: this.addForm.description,
                note: this.addForm.note,
                tax: 0,
                tax_type: 0,
                discount: 0,
                discount_type: 0,
              })
              .then((res) => {
                if (res.status === 200) {
                  this.fetchOutcome();
                  this.$bvModal.hide("modal-income");
                  this.toastAlert("menambah");
                }
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: "Akun belum diverfikasi!",
                    showConfirmButton: false,
                    width: "25em",
                    timer: 2500,
                  });
                } else {
                  alert(err);
                  console(err);
                }
                this.$bvModal.hide("modal-income");
              });
          } else {
            // console.log(this.addForm);
            this.$api
              .post("transactions", this.addForm)
              .then((res) => {
                if (res.status === 200) {
                  this.fetchOutcome();
                  this.$bvModal.hide("modal-income");
                  this.toastAlert("menambah");
                }
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  this.$swal({
                    icon: "error",
                    title: "Oops...",
                    text: "Akun belum diverfikasi!",
                    showConfirmButton: false,
                    width: "25em",
                    timer: 2500,
                  });
                } else {
                  alert(err);
                  console(err);
                }
                this.$bvModal.hide("modal-income");
              });
          }
        }
      }
    },
    onEdit(data) {
      this.modalTitle = `Edit Transaksi ${data.name}`;
      this.isDisabled = false;
      this.isEdit = true;
      this.resetForm();
      this.fillForm(data);
      this.$bvModal.show("modal-income");
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
            .delete(`transactions/${id}`)
            .then((res) => {
              this.fetchOutcome();
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
    onDetail(data) {
      this.modalTitle = `Detail Transaksi ${data.name}`;
      this.isEdit = false;
      this.isDisabled = true;
      this.resetForm();
      this.fillForm(data);
      this.$bvModal.show("modal-income");
    },
    exportTx() {
      const exp = [];
      for (let i = 0; i < this.dataOutcome.length; i++) {
        let category, payment, user, balance;
        if (this.dataOutcome[i].category != null) {
          category = this.dataOutcome[i].category.name;
        }
        if (this.dataOutcome[i].payment != null) {
          payment = this.dataOutcome[i].payment.name;
        }
        if (this.dataOutcome[i].user != null) {
          user = this.dataOutcome[i].user.first_name;
        }
        if (this.dataOutcome[i].balance != null) {
          balance = this.dataOutcome[i].balance.name;
        }
        exp.push({
          Tanggal: this.dataOutcome[i].created_at,
          NamaTransaksi: this.dataOutcome[i].name,
          Nominal: this.dataOutcome[i].amount,
          NamaPengguna: user,
          Kategori: category,
          Kas: balance,
          Pembayaran: payment,
          Deskripsi: this.dataOutcome[i].description,
          Catatan: this.dataOutcome[i].note,
        });
      }
      const data = XLSX.utils.json_to_sheet(exp);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "Pengeluaran");
      XLSX.writeFile(wb, "DataPengeluaran.xlsx");
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
    this.fetchOutcome();
    this.fetchAccounts();
    this.fetchPayments();
    this.fetchBalances();
    this.fetchCategories1();
    // this.fetchCategories2();
    // this.fetchCategories3();
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
