<template>
  <div>
    <page-title
      :heading="heading"
      :subheading="subheading"
      :icon="icon"
    ></page-title>
    <div class="mb-2 card">
      <div class="card-header-tab card-header">
        <div
          class="card-header-title font-size-lg text-capitalize font-weight-normal"
        >
          <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
          Statistik Keseluruhan
        </div>
      </div>
      <div class="no-gutters row">
        <div class="col-sm-4 col-md-4 col-xl-4">
          <div
            class="card no-shadow rm-border bg-transparent widget-chart text-left"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg opacity-10 bg-success"></div>
              <i class="pe-7s-cash text-white opacity-8"></i>
            </div>
            <div class="widget-chart-content">
              <div class="widget-subheading io-subheading">Total Pemasukan</div>
              <div class="widget-numbers">{{ totalIncome | formatRp }}</div>
            </div>
          </div>
          <div class="divider m-0 d-md-none d-sm-block"></div>
        </div>
        <div class="col-sm-4 col-md-4 col-xl-4">
          <div
            class="card no-shadow rm-border bg-transparent widget-chart text-left"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg opacity-9 bg-danger"></div>
              <i class="pe-7s-cash text-white"></i>
            </div>
            <div class="widget-chart-content">
              <div class="widget-subheading io-subheading">
                Total Pengeluaran
              </div>
              <div class="widget-numbers">
                <span>{{ totalOutcome | formatRp }}</span>
              </div>
            </div>
          </div>
          <div class="divider m-0 d-md-none d-sm-block"></div>
        </div>
        <div class="col-sm-4 col-md-4 col-xl-4">
          <div
            class="card no-shadow rm-border bg-transparent widget-chart text-left"
          >
            <div class="icon-wrapper rounded-circle">
              <div class="icon-wrapper-bg opacity-9 bg-primary"></div>
              <i class="pe-7s-cash text-white"></i>
            </div>
            <div class="widget-chart-content">
              <div class="widget-subheading io-subheading">Total Kas</div>
              <div class="widget-numbers">
                <span>{{ totalBalance | formatRp }}</span>
              </div>
            </div>
          </div>
          <div class="divider m-0 d-md-none d-sm-block"></div>
        </div>
      </div>
    </div>

    <div class="card-heading">Statistik Kas</div>
    <div class="row">
      <div
        v-for="field in balanceField"
        :key="field.id"
        class="col-md-6 col-xl-3"
      >
        <div
          class="card mb-1 widget-chart widget-chart2 text-left card-btm-border card-shadow-success border-success"
        >
          <div class="widget-chat-wrapper-outer">
            <div class="widget-chart-content pl-2 pb-2">
              <div class="widget-chart-flex">
                <div class="widget-numbers">
                  <div class="widget-chart-flex">
                    <div class="fsize-4">
                      <!-- <small class="opacity-5">Rp</small> -->
                      <span class="widget-numbers-2">{{
                        field.amount | formatRp
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h6
                class="widget-subheading mb-0 opacity-5"
                style="font-size: 1.3em"
              >
                {{ field.name }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-heading" v-if="txGroupField.length !== 0">
      Statistik Data Transaksi berdasarkan Grup
    </div>
    <div class="row">
      <div
        v-for="field in txGroupField"
        :key="field.id"
        class="col-md-6 col-xl-3"
      >
        <div
          class="card mb-1 widget-chart widget-chart2 text-left card-btm-border card-shadow-info border-info"
          style="height: 8rem"
        >
          <div class="widget-chat-wrapper-outer">
            <div class="widget-chart-content pl-2 pb-2">
              <div class="widget-chart-flex">
                <div class="widget-numbers">
                  <div class="widget-chart-flex">
                    <div class="fsize-4">
                      <!-- <small class="opacity-5">Rp</small> -->
                      <span class="widget-numbers-2">{{
                        field.value | formatRp
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h6
                class="widget-subheading mb-0 opacity-5"
                style="font-size: 1.2em"
              >
                {{ field.group }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-heading" v-if="txCategoryField.length !== 0">
      Statistik Data Transaksi berdasarkan Kategori
    </div>
    <div class="row">
      <div
        v-for="field in txCategoryField"
        :key="field.id"
        class="col-md-6 col-xl-3"
      >
        <div
          class="card widget-chart widget-chart2 text-left card-btm-border card-shadow-dark border-dark"
          style="height: 8rem"
        >
          <div class="widget-chat-wrapper-outer">
            <div class="widget-chart-content pl-2 pb-2">
              <div class="widget-chart-flex">
                <div class="widget-numbers">
                  <div class="widget-chart-flex">
                    <div class="fsize-4">
                      <!-- <small class="opacity-5">Rp</small> -->
                      <span class="widget-numbers-2">{{
                        field.value | formatRp
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <h6
                class="widget-subheading mb-0 opacity-5"
                style="font-size: 1.2em"
              >
                {{ field.category }}
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3 mt-3">
      <div class="no-gutters row">
        <div class="col-md-12 col-lg-4">
          <ul class="list-group list-group-flush">
            <li class="bg-transparent list-group-item">
              <div class="widget-content p-0">
                <div class="widget-content-outer">
                  <div class="widget-content-wrapper">
                    <div class="widget-content-left">
                      <div class="widget-heading">User Terdaftar</div>
                      <div class="widget-subheading">Jumlah akun pengguna</div>
                    </div>
                    <div class="widget-content-right">
                      <div class="widget-numbers text-primary">
                        {{ totalUsers }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="bg-transparent list-group-item">
              <div class="widget-content p-0">
                <div class="widget-content-outer">
                  <div class="widget-content-wrapper">
                    <div class="widget-content-left">
                      <div class="widget-heading">Total Transaksi</div>
                      <div class="widget-subheading">
                        Transaksi pemasukan & pengeluaran
                      </div>
                    </div>
                    <div class="widget-content-right">
                      <div class="widget-numbers text-primary">
                        {{ countTx }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-md-12 col-lg-4">
          <ul class="list-group list-group-flush">
            <li class="bg-transparent list-group-item">
              <div class="widget-content p-0">
                <div class="widget-content-outer">
                  <div class="widget-content-wrapper">
                    <div class="widget-content-left">
                      <div class="widget-heading">User Terverifikasi</div>
                      <div class="widget-subheading">
                        Jumlah akun yang sudah diverifikasi
                      </div>
                    </div>
                    <div class="widget-content-right">
                      <div class="widget-numbers text-success">
                        {{ totalVerified }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="bg-transparent list-group-item">
              <div class="widget-content p-0">
                <div class="widget-content-outer">
                  <div class="widget-content-wrapper">
                    <div class="widget-content-left">
                      <div class="widget-heading">Transaksi Pemasukan</div>
                      <div class="widget-subheading">
                        Jumlah transaksi pengeluaran
                      </div>
                    </div>
                    <div class="widget-content-right">
                      <div class="widget-numbers text-warning">
                        {{ countInc }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-md-12 col-lg-4">
          <ul class="list-group list-group-flush">
            <li class="bg-transparent list-group-item">
              <div class="widget-content p-0">
                <div class="widget-content-outer">
                  <div class="widget-content-wrapper">
                    <div class="widget-content-left">
                      <div class="widget-heading">User Belum Terverifikasi</div>
                      <div class="widget-subheading">
                        Jumlah akun yang belum diverifikasi
                      </div>
                    </div>
                    <div class="widget-content-right">
                      <div class="widget-numbers text-danger">
                        {{ totalUnverified }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="bg-transparent list-group-item">
              <div class="widget-content p-0">
                <div class="widget-content-outer">
                  <div class="widget-content-wrapper">
                    <div class="widget-content-left">
                      <div class="widget-heading">Transaksi Pengeluaran</div>
                      <div class="widget-subheading">
                        Jumlah transaksi pengeluaran
                      </div>
                    </div>
                    <div class="widget-content-right">
                      <div class="widget-numbers text-danger">
                        {{ countOutc }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../Layout/Components/PageTitle2.vue";
import _ from "lodash";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashAlt,
  faCheck,
  faCalendarAlt,
  faAngleDown,
  faAngleUp,
  faTh,
} from "@fortawesome/free-solid-svg-icons";
// import jwtService from "../../service/jwt.service";

library.add(faTrashAlt, faCheck, faAngleDown, faAngleUp, faTh, faCalendarAlt);

export default {
  components: {
    PageTitle,
  },
  data: () => ({
    heading: "Dashboard Admin",
    subheading: "Halaman ini memuat statistik data",
    icon: "pe-7s-graph1 icon-gradient bg-tempting-azure",
    totalIncome: 0,
    totalOutcome: 0,
    totalBalance: 0,
    balanceField: [],
    txGroupField: [],
    txCategoryField: [],
    totalUsers: 0,
    totalVerified: 0,
    totalUnverified: 0,
    countTx: 0,
    countInc: 0,
    countOutc: 0,
  }),

  methods: {
    getIncome() {
      this.$api
        .get(`transaction/income`)
        .then((res) => {
          if (res.status === 200) {
            this.totalIncome = res.data;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    getOutcome() {
      this.$api
        .get(`transaction/outcome`)
        .then((res) => {
          if (res.status === 200) {
            this.totalOutcome = res.data;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    getBalance() {
      this.$api
        .get(`balance/total`)
        .then((res) => {
          if (res.status === 200) {
            this.totalBalance = res.data;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    getBalanceField() {
      this.$api
        .get(`balances?size=50`)
        .then((res) => {
          if (res.status === 200) {
            this.balanceField = res.data.items;
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    getUsers() {
      this.$api
        .get(`users?size=99999`)
        .then((res) => {
          if (res.status === 200) {
            this.totalUsers = 0;
            this.totalVerified = 0;
            this.totalUnverified = 0;
            res.data.items.map((a) => {
              if (a.is_admin === 0 && a.super === 0) this.totalUsers += 1;
              if (a.status_verified === 1 && a.is_admin === 0  && a.super === 0)
                this.totalVerified += 1;
              if (a.status_verified === 0 && a.is_admin === 0  && a.super === 0)
                this.totalUnverified += 1;
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    getTransactions() {
      this.$api
        .get(`transactions?size=99999`)
        .then((res) => {
          if (res.status === 200) {
            this.countInc = 0;
            this.countOutc = 0;
            this.countTx = res.data.total;
            res.data.items.map((a) => {
              if (a.is_income === 1) this.countInc += 1;
              if (a.is_income === 0) this.countOutc += 1;
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    getTxByGroup() {
      this.$api
        .get(`transactions/view/group`)
        .then((res) => {
          const ld = _.reduce(
            res.data.items,
            function (result, value) {
              (
                result[value.group.name] || (result[value.group.name] = [])
              ).push(value);
              return result;
            },
            {}
          );
          const DATA = [];
          _.reduce(
            ld,
            function (sum, n, key) {
              (sum[key] || (sum[key] = [])).push(
                _.reduce(
                  n,
                  function (awal, akhir) {
                    return awal + akhir.amount;
                  },
                  0
                )
              );
              DATA.push({ group: key, value: sum[key][0] });
              return sum;
            },
            {}
          );
          this.txGroupField = DATA;
        })
        .catch((err) => {
          alert(err);
        });
    },
    getTxByCategory() {
      this.$api
        .get(`transactions/view/category`)
        .then((res) => {
          const ld = _.reduce(
            res.data.items,
            function (result, value) {
              (
                result[value.category.name] ||
                (result[value.category.name] = [])
              ).push(value);
              return result;
            },
            {}
          );
          const DATA = [];
          _.reduce(
            ld,
            function (sum, n, key) {
              (sum[key] || (sum[key] = [])).push(
                _.reduce(
                  n,
                  function (awal, akhir) {
                    return awal + akhir.amount;
                  },
                  0
                )
              );
              DATA.push({ category: key, value: sum[key][0] });
              return sum;
            },
            {}
          );
          this.txCategoryField = DATA;
        })
        .catch((err) => {
          alert(err);
        });
    },
  },
  mounted() {
    this.getUsers();
    this.getIncome();
    this.getOutcome();
    this.getBalance();
    this.getBalanceField();
    this.getTransactions();
    this.getTxByCategory();
    this.getTxByGroup();
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
};
</script>

<style>
.widget-numbers {
  font-size: 2em !important;
}
.widget-numbers-2 {
  font-size: 0.85em !important;
}
.card-heading {
  font-size: 1.4em;
  margin-top: 0.6em;
  margin-bottom: 0.4em;
}
</style>
