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
            <h5 class="mb-0 mt-2">Tabel Jenis Kategori</h5>
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
          <!-- <b-col cols="1">
            <button class="btn btn-primary w-100">
              <font-awesome-icon icon="filter" />
            </button>
          </b-col> -->
        </b-row>
      </template>
      <b-table
        id="payment-table"
        small
        :fields="fields"
        :items="dataKategori"
        :hover="true"
        :filter="searchInput"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm"
        tbody-tr-class="category-data"
        show-empty
      >
        <!-- A virtual column -->
        <template #head(index)>
          <VTooltip>
            <b-button
              size="sm"
              variant="primary"
              class="py-0 px-1"
              @click="applyFilter"
              style="
                padding-top: 1px !important;
                padding-bottom: 1.5px !important;
              "
            >
              <font-awesome-icon icon="check-circle" />
            </b-button>
            <template #popper>
              <div class="text-center">
                Klik untuk <i>apply</i> tampilan di dashboard! <br />
                Kategori yang ditandai akan ditampilkan
              </div>
            </template>
          </VTooltip>
        </template>

        <template #cell(index)="data">
          <b-form-checkbox
            :id="`category-${data.index}`"
            v-model="categoriesChecked"
            :value="data.item.id"
          >
          </b-form-checkbox>
        </template>

        <template #cell(is_income)="data">
          <div v-if="data.item.is_income === 1">Pemasukan</div>
          <div v-else>Pengeluaran</div>
        </template>

        <template v-slot:cell(actions)="{ item }">
          <div class="row action-wrapper">
            <div class="action-btn" @click="onEdit(item)">
              <font-awesome-icon icon="pen" />
            </div>
            <!-- <div class="action-btn" @click="onDelete(item.id)">
              <font-awesome-icon icon="trash" />
            </div> -->
          </div>
        </template>

        <template v-slot:cell(status)="data">
          <!-- {{ data.item.status }} -->
          <toggle
            v-if="role === '911'"
            class="toggle-admin"
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
            @change="fetchCategories"
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

    <b-modal id="modal-category" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <form @submit="onSubmit">
          <div class="form-group">
            <label for="type-category" class="font-bold fsz-14">
              Tipe
              <span class="red">*</span>
            </label>
            <multiselect
              id="type-category"
              v-model="addForm.is_income"
              :options="tipe"
              label="text"
              placeholder="Pilih tipe kategori"
              :class="{
                invalid: $v.addForm.is_income.$error,
                'multiselect-custom': !$v.addForm.is_income.$error,
              }"
              :allow-empty="false"
              @open="addForm.parent_id = null"
              @input="filterCategories(addForm.is_income, addForm.level)"
              
            ></multiselect>
            <small v-if="$v.addForm.is_income.$error" class="red">
              Tipe kategori tidak boleh kosong
            </small>
          </div>
          <div class="form-group">
            <label for="level-category" class="font-bold fsz-14">
              Level
              <span class="red">*</span>
            </label>
            <multiselect
              id="level-category"
              v-model="addForm.level"
              :options="[1, 2, 3]"
              placeholder="Pilih level kategori"
              :class="{
                invalid: $v.addForm.level.$error,
                'multiselect-custom': !$v.addForm.level.$error,
              }"
              @input="filterCategories(addForm.is_income, addForm.level)"
              
            ></multiselect>
            <small v-if="$v.addForm.level.$error" class="red">
              Level kategori tidak boleh kosong
            </small>
          </div>
          <div
            class="form-group"
            v-if="
              addForm.level !== 1 &&
              addForm.level !== null &&
              addForm.is_income !== null
            "
          >
            <label for="level-category" class="font-bold fsz-14">
              Kategori Induk
              <span class="red">*</span>
            </label>
            <!-- {{ dataParents }} -->
            <multiselect
              id="level-category"
              v-model="addForm.parent_id"
              label="name"
              :options="dataParents.map((pr) => pr.id)"
              :custom-label="(opt) => dataParents.find((x) => x.id == opt).name"
              placeholder="Pilih kategori induk"
              :class="{
                invalid: $v.addForm.parent_id.$error,
                'multiselect-custom': !$v.addForm.parent_id.$error,
              }"
            ></multiselect>
            <small v-if="$v.addForm.parent_id.$error" class="red">
              Kategori induk tidak boleh kosong
            </small>
          </div>
          <!-- <div class="form-group">
            <label for="category" class="font-bold fsz-14">
              Kategori
              <span class="red">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.category.$error }"
              id="category"
              v-model="$v.addForm.category.$model"
              placeholder="Masukkan kategori, misalya Infaq/Zakat/Kas/Piutang"
            />
            <b-form-invalid-feedback id="kode-role">
              Kategori tidak boleh kosong
            </b-form-invalid-feedback>
          </div> -->
          <div class="form-group">
            <label for="balance-ctg" class="font-bold fsz-14">
              Jenis Kas
              <span class="red">*</span>
            </label>
            <multiselect
              id="balance-ctg"
              v-model="addForm.balance_id"
              :options="dataBalances.map((blc) => blc.id)"
              :custom-label="
                (opt) => dataBalances.find((x) => x.id == opt).name
              "
              placeholder="Pilih jenis kas"
              :class="{
                invalid: $v.addForm.balance_id.$error,
                'multiselect-custom': !$v.addForm.balance_id.$error,
              }"
            ></multiselect>
            <small v-if="$v.addForm.balance_id.$error" class="red">
              Jenis kas tidak boleh kosong
            </small>
          </div>
          <div class="form-group">
            <label for="code-category" class="font-bold fsz-14">
              Kode
              <span class="red">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.code.$error }"
              id="code-category"
              v-model="$v.addForm.code.$model"
              placeholder="Masukkan kode kategori"
            />
            <b-form-invalid-feedback id="kode-role">
              Kode tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="nama-group" class="font-bold fsz-14">
              Nama <span class="red">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.name.$error }"
              id="nama-group"
              v-model="$v.addForm.name.$model"
              placeholder="Masukkan nama kategori"
            />
            <b-form-invalid-feedback id="nama-role">
              Nama kategori tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="desc-category" class="font-bold fsz-14">
              Deskripsi <span class="red">*</span>
            </label>
            <b-form-textarea
              id="desc-category"
              :class="{
                'is-invalid': $v.addForm.description.$error,
              }"
              v-model="$v.addForm.description.$model"
              placeholder="Masukkan deskripsi kategori"
              rows="3"
            >
            </b-form-textarea>
            <b-form-invalid-feedback id="desc-category">
              Deskripsi kategori tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
          >
            Simpan Kategori
          </button>
        </form>
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
  faFilter,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { required, requiredIf } from "vuelidate/lib/validators";
import jwtService from "../../service/jwt.service";
import { Tooltip } from "floating-vue";

library.add(faPen, faTrash, faSearch, faFilter, faCheckCircle);

export default {
  components: {
    PageTitle,
    VTooltip: Tooltip,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Manajemen Kategori Transaksi",
    subheading: "Halaman ini digunakan untuk mengelola kategori transaksi",
    addtext: "Tambah Kategori",
    fields: [
      { key: "index", label: "#" },
      { key: "is_income", label: "Tipe" },
      { key: "level", label: "Level" },
      { key: "name", label: "Nama" },
      { key: "description", label: "Deskripsi" },
      { key: "actions", label: "Action" },
      { key: "status", label: "Status" },
    ],
    dataKategori: [],
    dataParents: [],
    dataBalances: [],
    categoriesChecked: [],
    role: jwtService.getRole(),

    tipe: [
      { value: 1, text: "Pemasukan" },
      { value: 0, text: "Pengeluaran" },
    ],

    searchInput: "",
    currentPage: 1,
    perPage: 5,
    rows: 0,

    modalTitle: "",
    isEdit: false,

    addForm: {
      id: "",
      level: null,
      category: "",
      parent_id: "",
      code: "",
      name: "",
      description: "",
      is_income: null,
      balance_id: "",
    },
  }),
  validations: {
    addForm: {
      level: { required },
      balance_id: { required },
      parent_id: {
        required: requiredIf(function () {
          return this.addForm.level === 2;
        }),
      },
      code: { required },
      name: { required },
      description: { required },
      is_income: { required },
    },
  },
  // computed: {
  //   rows() {
  //     return this.dataKategori.length;
  //   },
  // },
  methods: {
    fetchCategories() {
      this.$api
        .get(`categories?size=9999`)
        .then((res) => {
          this.dataKategori = res.data.items;
          this.rows = res.data.total;
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
          // console.log(res.data.items)
          this.dataBalances = [];
          res.data.items.map((a) => {
            if (a.status === 1) this.dataBalances.push(a);
          });
          // console.log(this.dataBalances)
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    filterCategories(tipe, level) {
      // console.log(tipe)
      // console.log(level)
      this.addForm.parent_id = "";
      // console.log(this.addForm.is_income);
      if (this.addForm.is_income !== null) {
        this.dataParents = [];
        this.dataKategori.filter((a) => {
          if (level === 2 && a.is_income === tipe.value) {
            if (a.level === 1) {
              this.dataParents.push(a);
            }
          } else if (level === 3 && a.is_income === tipe.value) {
            if (a.level === 2) {
              this.dataParents.push(a);
            }
          }
        });
        // console.log(this.dataParents)
      }
    },
    resetForm() {
      this.addForm = {
        id: "",
        level: null,
        category: "",
        parent_id: null,
        code: "",
        name: "",
        description: "",
        is_income: null,
      };
      this.$v.$reset();
    },
    onAdd() {
      this.modalTitle = "Tambah Kategori";
      this.isEdit = false;
      this.resetForm();
      this.$bvModal.show("modal-category");
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        if (this.isEdit) {
          if (this.addForm.is_income.value === 1) {
            this.addForm.is_income = 1;
          } else {
            this.addForm.is_income = 0;
          }
          this.$api
            .put("categories/" + this.addForm.id, this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchCategories();
                this.$bvModal.hide("modal-category");
                this.toastAlert("update");
              }
            })
            .catch((err) => {
              if (err.message === "Request failed with status code 409") {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Kode kategori sudah ada!",
                  showConfirmButton: false,
                  width: "25em",
                  timer: 2500,
                });
              }
            });
        } else {
          // let parent = null;
          // if (this.addForm.parent_id !== null) {
          //   parent = this.addForm.parent_id.id;
          // }
          // console.log(this.addForm.parent_id);
          if(this.addForm.level === 1){
            this.addForm.parent_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
          }
          if (this.addForm.is_income.value === 1) {
            this.addForm.category = "Pemasukan";
          } else {
            this.addForm.category = "Pengeluaran";
          }
          this.$api
            .post("categories", {
              level: this.addForm.level,
              category: this.addForm.category,
              balance_id: this.addForm.balance_id,
              parent_id: this.addForm.parent_id,
              code: this.addForm.code,
              name: this.addForm.name,
              description: this.addForm.description,
              is_income: this.addForm.is_income.value,
            })
            .then((res) => {
              if (res.status === 200) {
                this.fetchCategories();
                this.$bvModal.hide("modal-category");
                this.toastAlert("menambah");
              }
            })
            .catch((err) => {
              if (err.message === "Request failed with status code 409") {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Kode kategori sudah ada!",
                  showConfirmButton: false,
                  width: "25em",
                  timer: 2500,
                });
              }
            });
        }
      }
    },
    async onEdit(data) {
      this.resetForm();
      let tipe = {};
      if (data.is_income === 1) {
        tipe = { value: 1, text: "Pemasukan" };
      } else {
        tipe = { value: 0, text: "Pengeluaran" };
      }
      // console.log(data.is_income, data.level)
      this.addForm.is_income = tipe;
      await this.filterCategories(tipe, data.level);
      this.modalTitle = `Edit Kategori ${data.name}`;
      this.isEdit = true;
      this.addForm = {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description,
        level: data.level,
        balance_id: data.balance_id,
        category: data.category,
        parent_id: data.parent_id,
        is_income: tipe,
      };
      this.$bvModal.show("modal-category");
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
            .delete(`categories/${id}`)
            .then((res) => {
              if (res.status === 200) {
                this.fetchCategories();
                this.toastAlert("menghapus");
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    applyFilter() {
      this.$api
        .post(`settings/view/category`, {
          items: this.categoriesChecked,
        })
        .then((res) => {
          if (res.status === 200) {
            jwtService.saveVC(JSON.stringify(this.categoriesChecked));
            this.toastAlert("apply");
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    updateStatus(id) {
      this.$api.put(`settings/category/${id}/enable`).catch((err) => {
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
    this.fetchCategories();
    this.fetchBalances();
    this.categoriesChecked = JSON.parse(jwtService.getVC());
  },
};
</script>

<style>
.category-data td:first-child {
  width: 5%;
}

.category-data td:nth-child(2) {
  width: 12%;
}

:root {
  --toggle-width: 2.2rem;
  --toggle-height: 1.15rem;
  --toggle-border: 0.1rem;
  --toggle-bg-on: #69aa8a;
  --toggle-bg-off: #ccc;
}
</style>
