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
          <b-col>
            <h5 class="mb-0 mt-2">Ubah Password</h5>
          </b-col>
        </b-row>
      </template>
      <form @submit="postPassword">
        <b-row class="my-1">
          <b-col sm="2" offset="1">
            <label for="old-password">Password Lama :</label>
          </b-col>
          <b-col sm="7">
            <b-form-input
              type="password"
              id="old-password"
              :class="{ 'is-invalid': $v.pwForm.old.$error }"
              v-model="$v.pwForm.old.$model"
              placeholder="Masukkan password lama disini"
            ></b-form-input>
            <b-form-invalid-feedback>
              Password lama belum diisi
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
        <hr />
        <b-row class="my-1">
          <b-col sm="2" offset="1">
            <label for="new-password">Password Baru :</label>
          </b-col>
          <b-col sm="7">
            <b-form-input
              type="password"
              id="new-password"
              :class="{ 'is-invalid': $v.pwForm.new.$error }"
              v-model="$v.pwForm.new.$model"
              placeholder="Masukkan password baru disini"
            ></b-form-input>
            <b-form-invalid-feedback>
              <div v-if="!$v.pwForm.new.required">
                Password baru belum diisi
              </div>
              <div v-if="!$v.pwForm.new.minLengh">
                Password minimal 6 karakter
              </div>
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="my-1 mt-3">
          <b-col sm="2" offset="1">
            <label for="conf-password">Konfirmasi Password :</label>
          </b-col>
          <b-col sm="7">
            <b-form-input
              type="password"
              id="conf-password"
              :state="null"
              :class="{ 'is-invalid': $v.pwForm.conf.$error }"
              v-model="$v.pwForm.conf.$model"
              placeholder="Konfirmasi password baru disini"
            ></b-form-input>
            <b-form-invalid-feedback>
              Konfirmasi password tidak sesuai
            </b-form-invalid-feedback>
          </b-col>
        </b-row>
        <b-row class="mt-4">
          <b-col sm="8" offset="2">
            <b-button
              type="submit"
              variant="primary"
              class="float-right font-bold w-25 fsz-16 py-2"
              >Ubah Password</b-button
            >
          </b-col>
        </b-row>
      </form>
    </b-card>
  </div>
</template>

<script>
import { required, sameAs, minLength } from "vuelidate/lib/validators";
import jwtService from "../../service/jwt.service";

export default {
  name: "change-password",
  data: () => ({
    heading: "Pengaturan",
    subheading: "Halaman ini digunakan untuk mengubah password",
    id: jwtService.getID(),
    pwForm: {
      old: "",
      new: "",
      conf: "",
    },
  }),
  validations: {
    pwForm: {
      old: { required },
      new: {
        required,
        minLength: minLength(6),
      },
      conf: {
        required,
        sameAs: sameAs("new"),
      },
    },
  },
  methods: {
    postPassword(ev) {
      ev.preventDefault();
      this.$v.$touch();
      if (!this.$v.pwForm.$error) {
        this.$api
          .put(`change-password/${this.id}`, {
            password_old: this.pwForm.old,
            password_new: this.pwForm.new,
          })
          .then((res) => {
            if (res.status === 200) {
              this.pwForm = {
                old: "",
                new: "",
                conf: "",
              };
              this.$v.$reset();
              this.$swal({
                toast: true,
                position: "top-end",
                showClass: { popup: "" },
                icon: "success",
                title: `Password berhasil diubah`,
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
                text: "Password lama tidak sesuai!",
                showConfirmButton: false,
                width: "25em",
                timer: 2500,
              });
            } else {
              alert(err.message);
            }
            this.pwForm = {
              old: "",
              new: "",
              conf: "",
            };
            this.$v.$reset();
          });
      }
    },
    changePw() {
      // axios.post(process.env.VUE_APP_ROOT_API + 'auth/updatePassword',
      //   {
      //     id: this.id,
      //     password: this.pwNow,
      //     newPassword: this.newPw
      //   },
      //   {
      //     headers: {
      //       Authorization: "Bearer " + this.token
      //     }
      //   }).then((response) => {
      //     if (response.data.success) {
      //       this.$swal.fire('Password berhasil diubah !', '', 'success')
      //       this.$router.push({name: 'dashboard'})
      //     } else {
      //       this.$swal.fire({
      //         icon: 'error',
      //         title: 'Error!!',
      //         text: response.data.message
      //       })
      //     }
      //   }).catch((err) => {
      //     this.$swal.fire({
      //       icon: 'error',
      //       title: 'Terjadi kesalahan',
      //       text: err
      //     })
      //   })
    },
  },
};
</script>
