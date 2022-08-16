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
            <h5 class="mb-0 mt-2">Tabel Jenis User</h5>
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
        :fields="computedFields"
        :items="dataUsers"
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

        <template #cell(name)="data">
          {{ data.item.first_name }}
          {{ data.item.last_name }}
        </template>

        <template #cell(is_admin)="data">
          <toggle
            class="toggle-admin"
            v-model="data.item.is_admin"
            :falseValue="0"
            :trueValue="1"
            @change="toggleAdmin(data.item.id)"
          />
          <!-- <toggle-button
            class="mt-1"
            @change="updateStatus(data.item.id)"
            v-model="data.item.is_admin"
            :sync="true"
            :color="{
              checked: '#69aa8a',
              unchecked: '#ababab',
              disabled: '#ccc',
            }"
            :width="34"
            :height="18"
          /> -->
          <!-- <label class="switch mb-0 mt-1"> -->
          <!-- <b-form-checkbox
            :id="`user-${data.index}`"
            :checked="data.item.is_admin == '1'"
            @change="toggleAdmin(data.item.id)"
            :disabled="data.item.is_admin == '1'"
          >
          </b-form-checkbox> -->
          <!-- <input
            type="checkbox"
            class="shortime-toggle"
            :checked="data.item.is_admin == '1'"
            @change="toggleAdmin(data.item.id)"
            :disabled="data.item.is_admin == '1'"
          /> -->
          <!-- <span class="slider round"></span> -->
          <!-- </label> -->
        </template>

        <template #cell(status)="data">
          <span
            v-if="data.item.status === 0"
            class="badge badge-pill badge-danger text-white"
            >Tidak Aktif</span
          >
          <span
            v-if="data.item.status === 1"
            class="badge badge-pill badge-primary"
            >Aktif</span
          >
        </template>

        <template v-slot:cell(actions)="{ item }">
          <div class="row action-wrapper">
            <div
              class="action-btn"
              @click="onDetail(item)"
              style="padding: 2px 9px"
            >
              <font-awesome-icon icon="info" />
            </div>
            <div class="action-btn" @click="onEdit(item)">
              <font-awesome-icon icon="pen" />
            </div>
            <div
              v-if="role === '911'"
              class="action-btn"
              @click="onDelete(item.id)"
            >
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
            @change="fetchUsers"
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

    <b-modal id="modal-users" hide-footer>
      <template #modal-title>
        <div class="font-bold fsz-22 ml-1 mt-1">{{ modalTitle }}</div>
      </template>
      <template #default="{ hide }">
        <!-- <p class="">Modal Body with button</p> -->
        <form @submit="onSubmit">
          <div class="form-group">
            <label for="email" class="font-bold fsz-14">
              Email <span class="red" v-if="!disabled">*</span>
            </label>
            <input
              type="email"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.email.$error }"
              id="email"
              v-model="$v.addForm.email.$model"
              placeholder="Masukkan email"
              :disabled="disabled"
            />
            <b-form-invalid-feedback id="email">
              <span v-if="!$v.addForm.email.required"
                >Email tidak boleh kosong</span
              >
              <span v-if="!$v.addForm.email.email">Email tidak valid</span>
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label for="username" class="font-bold fsz-14">
              Username <span class="red" v-if="!disabled">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.username.$error }"
              id="username"
              v-model="$v.addForm.username.$model"
              placeholder="Masukkan username"
              :disabled="disabled"
            />
            <b-form-invalid-feedback id="username">
              Username tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label for="first_name" class="font-bold fsz-14">
              Nama Depan <span class="red" v-if="!disabled">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.first_name.$error }"
              id="first_name"
              v-model="$v.addForm.first_name.$model"
              placeholder="Masukkan nama depan"
              :disabled="disabled"
            />
            <b-form-invalid-feedback id="first_name">
              Nama depan tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <div class="form-group">
            <label for="last_name" class="font-bold fsz-14">
              Nama Belakang
            </label>
            <input
              v-if="disabled"
              type="text"
              class="form-control"
              v-model="$v.addForm.last_name.$model"
              disabled
            />
            <input
              v-else
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.last_name.$error }"
              id="last_name"
              v-model="$v.addForm.last_name.$model"
              placeholder="Masukkan nama belakang"
            />
          </div>

          <div class="form-group">
            <label for="surname" class="font-bold fsz-14">
              Nama Keluarga/Marga
            </label>
            <input
              v-if="disabled"
              type="text"
              class="form-control"
              v-model="$v.addForm.surname.$model"
              disabled
            />
            <input
              v-else
              type="text"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.surname.$error }"
              id="surname"
              v-model="$v.addForm.surname.$model"
              placeholder="Masukkan nama keluarga"
            />
          </div>

          <!-- <div class="form-group" v-if="!isEdit && !disabled">
            <label for="password" class="font-bold fsz-14">
              Password <span class="red" v-if="!disabled">*</span>
            </label>
            <input
              type="password"
              class="form-control"
              :class="{ 'is-invalid': $v.addForm.password.$error }"
              id="password"
              v-model="$v.addForm.password.$model"
              placeholder="Masukkan password"
              :disabled="disabled"
            />
            <b-form-invalid-feedback id="password">
              Password tidak boleh kosong
            </b-form-invalid-feedback>
          </div> -->

          <div class="form-group">
            <label for="role-user" class="font-bold fsz-14">
              Role <span class="red" v-if="!disabled">*</span>
            </label>
            <multiselect
              id="role-user"
              v-model="$v.addForm.role_id.$model"
              :options="dataRoles.map((role) => role.id)"
              :custom-label="(opt) => dataRoles.find((x) => x.id == opt).name"
              placeholder="Pilih role"
              :class="{
                invalid: $v.addForm.role_id.$error,
                'multiselect-custom': !$v.addForm.role_id.$error,
              }"
              :disabled="disabled"
            ></multiselect>
            <small v-if="$v.addForm.role_id.$error" class="red">
              Role tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="grup-user" class="font-bold fsz-14"> Grup </label>
            <multiselect
              id="grup-user"
              v-model="$v.addForm.group_id.$model"
              :options="dataGroups.map((group) => group.id)"
              :custom-label="(opt) => dataGroups.find((x) => x.id == opt).name"
              placeholder="Pilih group"
              :class="{
                invalid: $v.addForm.group_id.$error,
                'multiselect-custom': !$v.addForm.group_id.$error,
              }"
              :disabled="disabled"
            ></multiselect>
            <small v-if="$v.addForm.group_id.$error" class="red">
              Role tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="user-gender" class="font-bold fsz-14">
              Jenis Kelamin<span class="red" v-if="!disabled">*</span>
            </label>
            <multiselect
              id="user-gender"
              v-model="$v.addForm.gender.$model"
              :options="['Laki-Laki', 'Perempuan']"
              placeholder="Pilih jenis kelamin"
              :class="{
                invalid: $v.addForm.gender.$error,
                'multiselect-custom': !$v.addForm.gender.$error,
              }"
              :disabled="disabled"
            ></multiselect>
            <small v-if="$v.addForm.gender.$error" class="red">
              Jenis kelamin tidak boleh kosong
            </small>
          </div>

          <div class="form-group">
            <label for="alamat-user" class="font-bold fsz-14">
              Alamat <span class="red" v-if="!disabled">*</span>
            </label>
            <b-form-textarea
              id="alamat-user"
              :class="{
                'is-invalid': $v.addForm.address.$error,
              }"
              v-model="$v.addForm.address.$model"
              placeholder="Masukkan deskripsi kategori"
              rows="3"
              :disabled="disabled"
            >
            </b-form-textarea>
            <b-form-invalid-feedback id="alamat-user">
              Deskripsi kategori tidak boleh kosong
            </b-form-invalid-feedback>
          </div>

          <button
            v-if="!disabled"
            type="submit"
            class="btn btn-primary w-100 my-3 py-2 font-bold"
          >
            Simpan User
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
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { required, email } from "vuelidate/lib/validators";
import jwtService from "../../service/jwt.service";
// import Toggle from "@vueform/toggle/dist/toggle.vue2";
// import ToggleButton from "vue-js-toggle-button";
// import axios from "axios";

library.add(faPen, faTrash, faSearch, faInfo);

export default {
  components: {
    PageTitle,
    "font-awesome-icon": FontAwesomeIcon,
    // Toggle,
    // "ToggleButton": ToggleButton
  },
  data: () => ({
    heading: "Manajemen User",
    subheading: "Halaman ini digunakan untuk mengelola akun pengguna ",
    addtext: "Tambah User",
    role: jwtService.getRole(),
    fields: [
      { key: "index", label: "#" },
      { key: "name", label: "Nama" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "status", label: "Status" },
      { key: "is_admin", label: "Admin", isSuper: true },
      { key: "actions", label: "Action" },
    ],
    dataUsers: [],
    dataRoles: [],
    dataGroups: [],
    data: jwtService.getRole(),

    searchInput: "",
    currentPage: 1,
    perPage: 5,
    rows: 0,

    modalTitle: "",
    isEdit: false,
    disabled: false,

    addForm: {
      id: "",
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      surname: "",
      password: "",
      role_id: "",
      group_id: "",
      gender: "",
      address: "",
      join_date: "",
      is_admin: 1,
      status: 0,
      status_verified: 0,
    },
  }),
  validations: {
    addForm: {
      email: { required, email },
      username: { required },
      first_name: { required },
      last_name: {},
      surname: {},
      // password: {
      //   required: requiredIf(function () {
      //     return !this.isEdit;
      //   }),
      // },
      role_id: { required },
      group_id: { required },
      gender: { required },
      address: { required },
    },
  },
  computed: {
    computedFields() {
      if (this.role !== "911")
        return this.fields.filter((field) => !field.isSuper);
      else return this.fields;
    },
  },
  methods: {
    fetchUsers() {
      this.$api
        .get(`users?size=99999`)
        .then((res) => {
          this.dataUsers = [];
          // console.log(res.data.items)
          if (this.role === "911") {
            res.data.items.map((obj) => {
              if (obj.super === 0) this.dataUsers.push(obj);
            });
            // this.dataUsers = res.data.items;
          } else {
            res.data.items.map((obj) => {
              if (obj.is_admin !== 1 && obj.super === 0)
                this.dataUsers.push(obj);
            });
          }
          this.rows = res.data.total;
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    fetchRoles() {
      this.$api
        .get(`roles`)
        .then((res) => {
          this.dataRoles = res.data.items;
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
          this.dataGroups = [];
          res.data.items.map((a) => {
            if(a.status === 1) this.dataGroups.push(a);
          });
        })
        .catch((err) => {
          console(err);
          alert(err);
        });
    },
    resetForm() {
      this.addForm = {
        id: "",
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        surname: "",
        password: "",
        role_id: "",
        group_id: "",
        gender: "",
        address: "",
        join_date: "",
        is_admin: 1,
        status: 1,
        status_verified: 1,
      };
      this.$v.$reset();
    },
    fillForm(data) {
      this.addForm = {
        id: data.id,
        email: data.email,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        surname: data.surname,
        role_id: data.role_id,
        group_id: data.group_id,
        gender: data.gender,
        address: data.address,
      };
    },
    onAdd() {
      this.modalTitle = "Tambah User";
      this.isEdit = false;
      this.disabled = false;
      this.resetForm();
      this.fetchRoles();
      this.fetchGroups();
      this.$bvModal.show("modal-users");
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$v.addForm.$touch();
      if (!this.$v.addForm.$error) {
        if (this.isEdit) {
          this.$api
            .put("users/" + this.addForm.id, this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchUsers();
                this.$bvModal.hide("modal-users");
                this.toastAlert("update");
              }
            })
            .catch((err) => {
              // alert(err.message);
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
            .post("users", this.addForm)
            .then((res) => {
              if (res.status === 200) {
                this.fetchUsers();
                this.$bvModal.hide("modal-users");
                this.toastAlert("menambah");
              }
            })
            .catch((err) => {
              // alert(err.message);
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
      this.modalTitle = `Edit User ${data.username}`;
      this.isEdit = true;
      this.disabled = false;
      this.fetchRoles();
      this.fetchGroups();
      this.resetForm();
      this.fillForm(data);
      this.$bvModal.show("modal-users");
    },
    onDetail(data) {
      this.modalTitle = `Detail User ${data.username}`;
      this.isEdit = false;
      this.disabled = true;
      this.resetForm();
      this.fillForm(data);
      this.$bvModal.show("modal-users");
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
            .delete(`users/${id}`)
            .then((res) => {
              if (res.status === 200) {
                this.fetchUsers();
                this.toastAlert("menghapus");
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    toggleAdmin(id) {
      this.$api
        .put(`settings/user/${id}/make-admin`)
        .then((res) => {
          if (res.status === 200) {
            this.$swal({
              toast: true,
              position: "top-end",
              showClass: { popup: "" },
              icon: "success",
              title: `Berhasil mengubah admin`,
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
          alert(err);
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
    this.fetchUsers();
    this.fetchRoles();
    this.fetchGroups();
  },
};
</script>

<style>
:root {
  --toggle-width: 2.2rem;
  --toggle-height: 1.15rem;
  --toggle-border: 0.1rem;
  --toggle-bg-on: #69aa8a;
  --toggle-bg-off: #ccc;
}
</style>
<!-- <style src="@vueform/toggle/themes/default.css"></style> -->
