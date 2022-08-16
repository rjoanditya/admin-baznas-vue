<template>
  <div class="d-flex">
    <div class="header-btn-lg pr-0">
      <div class="widget-content p-0">
        <div class="widget-content-wrapper">
          <div class="widget-content-left mr-3 header-user-info">
            <div class="widget-heading text-right">{{ name }}</div>
            <div class="widget-subheading">{{ email }}</div>
          </div>
          <div class="widget-content-left">
            <b-dropdown
              toggle-class="p-0 mr-2"
              menu-class="dropdown-menu-lg"
              variant="link"
              right
            >
              <span slot="button-content">
                <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                  <img
                    width="42"
                    class="rounded-circle"
                    src="@/assets/images/avatars/admin.png"
                    alt=""
                  />
                </div>
              </span>
              <!-- <button type="button" tabindex="0" class="dropdown-item">Menus</button> -->
              <router-link to="/admin/settings" tabindex="0" class="dropdown-item">
                Settings
              </router-link>
              <div tabindex="-1" class="dropdown-divider"></div>
              <button
                type="button"
                tabindex="0"
                class="dropdown-item"
                @click="onLogout"
              >
                Log Out
              </button>
            </b-dropdown>
          </div>
          <!-- <div class="widget-content-right header-user-info ml-3">
                        <b-btn v-b-tooltip.hover title="Tooltip Example" class="btn-shadow p-1" size="sm" variant="info">
                            <font-awesome-icon icon="calendar-alt" class="mr-1 ml-1"/>
                        </b-btn>
                    </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import jwtService from "../../../service/jwt.service";
import { mapGetters } from "vuex";

library.add(
  faAngleDown,
  faCalendarAlt,
  faTrashAlt,
  faCheck,
  faFileAlt,
  faCloudDownloadAlt,
  faFileExcel,
  faFilePdf,
  faFileArchive,
  faEllipsisH
);

export default {
  components: {
    // 'font-awesome-icon': FontAwesomeIcon,
  },
  data: () => ({
    name: jwtService.getName(),
    email: jwtService.getEmail()
  }),
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    onLogout() {
      localStorage.clear();
      this.$store.commit("purgeAuth");
      this.$router.push("/login");
    },
  },
  mounted() {},
};
</script>
