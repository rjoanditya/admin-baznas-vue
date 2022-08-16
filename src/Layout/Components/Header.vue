<template>
  <div class="app-header header-shadow">
    <div class="logo-src" />
    <div class="app-header__content">
      <div class="app-header-left">
        <!-- <SearchBox/> -->
        <button
          type="button"
          class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active': isOpen }"
          @click="toggleBodyClass('closed-sidebar')"
        >
          <span class="hamburger-box">
            <font-awesome-icon v-if="isOpen" icon="chevron-right" size="lg" />
            <font-awesome-icon v-if="!isOpen" icon="chevron-left" size="lg" />
          </span>
        </button>
      </div>
      <div class="app-header-right">
        <UserArea />
      </div>
    </div>
    <div class="app-header__mobile-menu">
      <div>
        <button
          type="button"
          class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active': isOpen }"
          @click="toggleMobile('closed-sidebar-open')"
        >
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button>
      </div>
    </div>
    <div class="app-header__menu">
      <span>
        <b-button
          class="btn-icon btn-icon-only"
          variant="primary"
          size="sm"
          v-bind:class="{ active: isOpenMobileMenu }"
          @click="toggleMobile2('header-menu-open')"
        >
          <div class="btn-icon-wrapper">
            <font-awesome-icon icon="ellipsis-v" />
          </div>
        </b-button>
      </span>
    </div>
  </div>
</template>

<script>
// import SearchBox from './Header/SearchBox';
import UserArea from "./Header/HeaderUserArea";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEllipsisV,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faEllipsisV, faChevronLeft, faChevronRight);
export default {
  name: "Header",
  components: {
    // SearchBox,
    UserArea,
    "font-awesome-icon": FontAwesomeIcon,
  },

  data() {
    return {
      isOpen: false,
      isOpenMobileMenu: false,
    };
  },
  props: {},
  methods: {
    toggleBodyClass(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    toggleMobile(className) {
      const el = document.body;
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
    toggleMobile2(className) {
      const el = document.body;
      this.isOpenMobileMenu = !this.isOpenMobileMenu;

      if (this.isOpenMobileMenu) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
  },
  mounted() {
    this.isOpen = true;
    // if (this.isOpen) {
    //   el.classList.remove("closed-sidebar");
    // }
  },
};
</script>
