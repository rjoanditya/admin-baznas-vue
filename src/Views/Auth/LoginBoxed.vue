<template>
  <div v-if="!this.isAuthenticated">
    <div class="h-100 bg-grow-early bg-animation">
      <div class="d-flex h-100 justify-content-center align-items-center">
        <b-col md="8" class="mx-auto app-login-box">
          <div class="text-center">
            <img
              src="@/assets/images/baznas-logo.png"
              alt="logo-baznas"
              style="width: 175px"
            />
          </div>

          <div class="modal-dialog w-100 mx-auto mt-1">
            <div class="modal-content">
              <form @submit="postLogin">
                <div class="modal-body">
                  <div class="h5 modal-title text-center">
                    <h4 class="mt-2">
                      <span class="font-bold" style="font-size: 1.3rem">
                        Selamat datang,
                      </span>
                      <br />
                      <span style="font-size: 1rem">
                        Silahkan masuk dengan akun anda.
                      </span>
                    </h4>
                  </div>
                  <b-alert
                    :show="isError"
                    dismissible
                    variant="danger"
                    class="mb-1 py-2"
                    style="font-weight: bold"
                  >
                    Email/password salah!
                  </b-alert>
                  <b-form-group
                    id="exampleInputGroup1"
                    label="Email"
                    label-for="email"
                  >
                    <b-form-input
                      id="email"
                      type="text"
                      :class="{ 'is-invalid': $v.formLogin.email.$error }"
                      placeholder="Masukkan email..."
                      v-model="$v.formLogin.email.$model"
                    >
                    </b-form-input>
                    <div></div>
                    <b-form-invalid-feedback id="email">
                      <span v-if="!$v.formLogin.email.required">
                        Email belum diisi
                      </span>
                      <span v-if="!$v.formLogin.email.email">
                        Email tidak valid
                      </span>
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group
                    id="exampleInputGroup2"
                    label="Kata sandi"
                    label-for="password"
                  >
                    <b-form-input
                      id="password"
                      type="password"
                      :class="{ 'is-invalid': $v.formLogin.password.$error }"
                      placeholder="Masukkan kata sandi/password..."
                      v-model="$v.formLogin.password.$model"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback id="password">
                      Password belum diisi
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <!-- <b-form-checkbox name="check" id="exampleCheck">
                  Keep me logged in
                </b-form-checkbox> -->
                  <!-- <div class="divider" />
                <h6 class="mb-0">
                  No account?
                  <a href="javascript:void(0);" class="text-primary"
                    >Sign up now</a
                  >
                </h6> -->
                </div>
                <div class="modal-footer clearfix">
                  <!-- <div class="float-left">
                  <a href="javascript:void(0);" class="btn-lg btn btn-link">
                    Recover Password
                  </a>
                </div> -->
                  <div class="mx-auto">
                    <b-button
                      type="submit"
                      variant="primary"
                      size="lg"
                      style="font-weight: bold"
                      class="mr-1"
                      :disabled="loading"
                    >
                      <b-spinner
                        v-if="loading"
                        label="Spinning"
                        variant="light"
                        small
                      ></b-spinner>
                      Login ke Dashboard
                    </b-button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center text-white opacity-8 mt-3">
            Copyright &copy; D3 Teknik Informatika 2022
          </div>
        </b-col>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
// import { SET_AUTH } from 5"../../service/auth.module";

export default {
  data: () => ({
    formLogin: {
      email: "",
      password: "",
    },
    loading: false,
    isError: false,
  }),
  validations: {
    formLogin: {
      email: { required, email },
      password: {},
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    postLogin(evt) {
      evt.preventDefault();
      this.$v.$touch();
      if (!this.$v.formLogin.$error) {
        this.loading = true;
        setTimeout(() => {
          this.$api
            .post(`login`, this.formLogin)
            .then((res) => {
              if (res.status === 200) {
                this.isError = false;
                this.loading = false;
                if (res.data.super === 1) {
                  res.data.is_admin = 911;
                }
                this.$store.commit("setAuth", res.data);
                this.$router.push("/admin");
                this.toastAlert();
              } else {
                this.isError = true;
                this.loading = false;
              }
            })
            .catch((err) => {
              this.loading = false;
              this.isError = true;
              this.formLogin.password = "";
              this.$v.$reset();
              if (
                !err.message === "Request failed with status code 404" ||
                !err.message === "Request failed with status code 400"
              )
                alert(err.message);
            });
        }, 1500);
      }
    },
    toastAlert() {
      this.$swal({
        toast: true,
        position: "top-end",
        showClass: { popup: "" },
        icon: "success",
        title: `Login berhasil`,
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
    if (this.isAuthenticated) {
      this.$router.push("/admin");
    }
  },
};
</script>

<style></style>
