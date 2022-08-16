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
            <h5 class="mb-0 mt-2">Tabel Jenis Grup</h5>
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
        :items="dataGroup"
        :hover="true"
        :filter="searchInput"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm"
        tbody-tr-class="payment-data"
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
                Grup yang ditandai akan ditampilkan
              </div>
            </template>
          </VTooltip>
        </template>

        <template #cell(index)="data">
          <!-- {{ data.index + 1 }} -->
          <b-form-checkbox
            :id="`group-${data.index}`"
            v-model="groupsChecked"
            :value="data.item.id"
          >
          </b-form-checkbox>
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
            @change="fetchGroups"
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

    <b-modal id="modal-group" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form @submit="onSubmit">
          <div class="form-group">
            <label for="kode-group" class="font-bold fsz-14"
              >Kode Grup <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.code.$error }"
              id="kode-group"
              v-model="$v.addForm.code.$model"
              placeholder="Masukkan kode grup"
            />
            <b-form-invalid-feedback id="kode-role">
              Kode grup tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="nama-group" class="font-bold fsz-14"
              >Nama Grup <span class="red">*</span></label
            >
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.name.$error }"
              id="nama-group"
              v-model="$v.addForm.name.$model"
              placeholder="Masukkan nama grup"
            />
            <b-form-invalid-feedback id="nama-role">
              Nama grup tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <div class="form-group">
            <label for="desc-group" class="font-bold fsz-14"
              >Deskripsi Grup <span class="red">*</span></label
            >
            <b-form-textarea
              id="desc-group"
              :class="{
                'is-invalid': $v.addForm.description.$error,
              }"
              v-model="$v.addForm.description.$model"
              placeholder="Masukkan deskripsi grup"
              rows="3"
            >
            </b-form-textarea>
            <b-form-invalid-feedback id="desc-group">
              Deskripsi grup tidak boleh kosong
            </b-form-invalid-feedback>
          </div>
          <button
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
          >
            Simpan Grup
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
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { required } from "vuelidate/lib/validators";
import { Tooltip } from "floating-vue";
import "floating-vue/dist/style.css";
import jwtService from "../../service/jwt.service";
// import axios from "axios";

library.add(faPen, faTrash, faSearch, faCheckCircle);

export default {
  components: {
    PageTitle,
    VTooltip: Tooltip,
    "font-awesome-icon": FontAwesomeIcon,
  },
  data: () => ({
    heading: "Manajemen Grup Pengguna",
    subheading: "Halaman ini digunakan untuk mengelola grup pengguna ",
    addtext: "Tambah Grup",
    fields: [
      { key: "index" },
      { key: "code", label: "Kode" },
      { key: "name", label: "Grup" },
      { key: "description", label: "Deskripsi" },
      { key: "actions", label: "Action" },
      { key: "status", label: "Status" },
    ],
    dataGroup: [],
    groupsChecked: [],
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
      description: "",
    },
  }),
  validations: {
    addForm: {
      code: { required },
      name: { required },
      description: { required },
    },
  },
  // computed: {
  //   rows() {
  //     return this.dataGroup.length;
  //   },
  // },
  methods: {
    fetchGroups() {
      this.$api
        .get(`groups?size=9999`)
        .then((res) => {
          this.dataGroup = res.data.items;
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
        description: "",
      };
      this.$v.$reset();
    },
    onAdd() {
      this.modalTitle = "Tambah Grup";
      this.isEdit = false;
      this.resetForm();
      this.$bvModal.show("modal-group");
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        if (this.isEdit) {
          this.$api
            .put("groups/" + this.addForm.id, this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchGroups();
                this.$bvModal.hide("modal-group");
                this.toastAlert("update");
              }
            })
            .catch((err) => {
              if (err.message === "Request failed with status code 409") {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Kode grup sudah ada!",
                  showConfirmButton: false,
                  width: "25em",
                  timer: 2500,
                });
              }
            });
        } else {
          this.$api
            .post("groups", this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchGroups();
                this.$bvModal.hide("modal-group");
                this.toastAlert("menambah");
              }
            })
            .catch((err) => {
              if (err.message === "Request failed with status code 409") {
                this.$swal({
                  icon: "error",
                  title: "Oops...",
                  text: "Kode grup sudah ada!",
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
      this.modalTitle = `Edit Grup ${data.name}`;
      this.isEdit = true;
      this.resetForm();
      this.addForm = {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description,
      };
      this.$bvModal.show("modal-group");
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
            .delete(`groups/${id}`)
            .then((res) => {
              if (res.status === 200) {
                this.fetchGroups();
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
        .post(`settings/view/group`, {
          items: this.groupsChecked,
        })
        .then((res) => {
          if (res.status === 200) {
            jwtService.saveVG(JSON.stringify(this.groupsChecked));
            this.toastAlert("apply");
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    updateStatus(id) {
      this.$api
        .put(`settings/group/${id}/enable`)
        .then((res) => {
          if (res.status == 200) {
            // this.fetchGroups();
          }
        })
        .catch((err) => {
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
    this.fetchGroups();
    this.groupsChecked = JSON.parse(jwtService.getVG());
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
