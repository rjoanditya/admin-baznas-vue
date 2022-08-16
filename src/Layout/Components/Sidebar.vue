<template>
  <div class="app-sidebar sidebar-shadow">
    <!-- <div class="app-sidebar sidebar-shadow" @mouseover="toggleSidebarHover('add', 'closed-sidebar-open')"
    @mouseleave="toggleSidebarHover('remove', 'closed-sidebar-open')"> -->
    <div class="app-header__logo pl-3" style="padding-left: 20px !important">
      <img src="@/assets/images/baznas-db.png" alt="logo" />
      <!-- <div class="logo-src">
      </div> -->
      <div class="header__pane ml-auto">
        <!-- <button type="button" class="hamburger close-sidebar-btn hamburger--elastic"
          v-bind:class="{ 'is-active': isOpen }" @click="toggleBodyClass('closed-sidebar')">
          <span class="hamburger-box">
            <span class="hamburger-inner"></span>
          </span>
        </button> -->
      </div>
    </div>
    <div class="app-sidebar-content">
      <VuePerfectScrollbar class="app-sidebar-scroll" v-once>
        <sidebar-menu v-if="role === '911'" showOneChild :menu="superAdmin" />
        <sidebar-menu v-else showOneChild :menu="adminMenu" />
      </VuePerfectScrollbar>
    </div>
  </div>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import jwtService from "../../service/jwt.service";

export default {
  components: {
    SidebarMenu,
    VuePerfectScrollbar,
  },
  data() {
    return {
      isOpen: false,
      sidebarActive: false,
      role: jwtService.getRole(),

      superAdmin: [
        {
          header: true,
          title: "Dashboard",
        },
        {
          title: "Dashboards",
          icon: "pe-7s-display1",
          href: "/admin/dashboard",
        },
        {
          header: true,
          title: "Master Data User",
        },
        {
          title: "Role",
          icon: "pe-7s-user",
          href: "/admin/role",
        },
        {
          title: "Grup",
          icon: "pe-7s-photo-gallery",
          href: "/admin/group",
        },
        {
          title: "User",
          icon: "pe-7s-users",
          href: "/admin/users",
        },
        {
          header: true,
          title: "Master Data Transaksi",
        },
        {
          title: "Kategori",
          icon: "pe-7s-ribbon",
          href: "/admin/category",
        },
        {
          title: "Akun Pembayaran",
          icon: "pe-7s-mail-open-file",
          href: "/admin/account",
        },
        {
          title: "Metode Pembayaran",
          icon: "pe-7s-cash",
          href: "/admin/payment",
        },
        {
          title: "Kas",
          icon: "pe-7s-refresh-2",
          href: "/admin/kasbalance",
        },
        {
          title: "Riwayat Kas",
          icon: "pe-7s-news-paper",
          href: "/admin/kashistory",
        },
        {
          header: true,
          title: "Transaksi",
        },
        {
          title: "Multi Input",
          icon: "pe-7s-diskette",
          href: "/admin/multiinput",
        },
        {
          title: "Data Pemasukan",
          icon: "pe-7s-note2",
          href: "/admin/pemasukan",
        },
        {
          title: "Data Pengeluaran",
          icon: "pe-7s-note2",
          href: "/admin/pengeluaran",
        },
      ],
      adminMenu: [
        {
          header: true,
          title: "Dashboard",
        },
        {
          title: "Dashboards",
          icon: "pe-7s-display1",
          href: "/admin/dashboard",
        },
        {
          header: true,
          title: "Master Data User",
        },
        {
          title: "Role",
          icon: "pe-7s-user",
          href: "/admin/role",
        },
        {
          title: "Grup",
          icon: "pe-7s-photo-gallery",
          href: "/admin/group",
        },
        {
          title: "User",
          icon: "pe-7s-users",
          href: "/admin/users",
        },
        {
          header: true,
          title: "Master Data Transaksi",
        },
        {
          title: "Kategori",
          icon: "pe-7s-ribbon",
          href: "/admin/category",
        },
        {
          title: "Akun Pembayaran",
          icon: "pe-7s-mail-open-file",
          href: "/admin/account",
        },
        {
          title: "Metode Pembayaran",
          icon: "pe-7s-cash",
          href: "/admin/payment",
        },
        {
          title: "Kas",
          icon: "pe-7s-refresh-2",
          href: "/admin/kasbalance",
        },
        {
          header: true,
          title: "Transaksi",
        },
        {
          title: "Multi Input",
          icon: "pe-7s-diskette",
          href: "/admin/multiinput",
        },
        {
          title: "Data Pemasukan",
          icon: "pe-7s-note2",
          href: "/admin/pemasukan",
        },
        {
          title: "Data Pengeluaran",
          icon: "pe-7s-note2",
          href: "/admin/pengeluaran",
        },
        // {
        //   header: true,
        //   title: "Laporan",
        // },
        // {
        //   title: "Laporan",
        //   icon: "pe-7s-notebook",
        //   href: "/admin/laporan",
        //   child: [
        //     {
        //       href: "/admin/bukubesar",
        //       title: "Buku Besar",
        //     },
        //     {
        //       href: "/admin/neraca",
        //       title: "Buku Besar",
        //     },
        //     {
        //       href: "/admin/laporandana",
        //       title: "Lap. Dana",
        //     },
        //     {
        //       href: "/admin/lapkas",
        //       title: "Lap. Kas",
        //     },
        //     {
        //       href: "/admin/lapANK",
        //       title: "Lap. ANK",
        //     },
        //     {
        //       href: "/admin/lapAK",
        //       title: "Lap. AK",
        //     },
        //   ],
        // },
        // {
        //   title: 'Pages',
        //   icon: 'pe-7s-browser',
        //   child: [
        //     {
        //       href: '/pages/login-boxed',
        //       title: 'Login Boxed',
        //     },
        //     {
        //       href: '/pages/register-boxed',
        //       title: 'Register Boxed',
        //     },
        //     {
        //       href: '/pages/forgot-password-boxed',
        //       title: 'Forgot Password Boxed',
        //     },
        //   ]
        // },
        // {
        //   header: true,
        //   title: 'UI Components',
        // },
        // {
        //   icon: 'pe-7s-diamond',
        //   title: 'Elements',
        //   child: [
        //     {
        //       title: 'Buttons',
        //       child: [
        //         {
        //           title: 'Standard',
        //           href: '/elements/buttons-standard',
        //         },
        //       ]
        //     },
        //     {
        //       title: 'Dropdowns',
        //       href: '/elements/dropdowns',
        //     },
        //     {
        //       title: 'Icons',
        //       href: '/elements/icons',
        //     },
        //     {
        //       title: 'Badges',
        //       href: '/elements/badges-labels',
        //     },
        //     {
        //       title: 'Cards',
        //       href: '/elements/cards',
        //     },
        //     {
        //       title: 'List Groups',
        //       href: '/elements/list-group',
        //     },
        //     {
        //       title: 'Timeline',
        //       href: '/elements/timelines',
        //     },
        //     {
        //       title: 'Utilities',
        //       href: '/elements/utilities',
        //     },
        //   ],
        // },
        // {
        //   icon: 'pe-7s-car',
        //   title: 'Components',
        //   child: [
        //     {
        //       title: 'Tabs',
        //       href: '/components/tabs',
        //     },
        //     {
        //       title: 'Accordions',
        //       href: '/components/accordions',
        //     },
        //     {
        //       title: 'Modals',
        //       href: '/components/modals',
        //     },
        //     {
        //       title: 'Progress Bar',
        //       href: '/components/progress-bar',
        //     },
        //     {
        //       title: 'Tooltips & Popovers',
        //       href: '/components/tooltips-popovers',
        //     },
        //     {
        //       title: 'Carousel',
        //       href: '/components/carousel',
        //     },
        //     {
        //       title: 'Pagination',
        //       href: '/components/pagination',
        //     },
        //     {
        //       title: 'Maps',
        //       href: '/components/maps',
        //     },
        //   ],
        // },
        // {
        //   icon: 'pe-7s-display2',
        //   title: 'Tables',
        //   child: [
        //     {
        //       title: 'Regular Tables',
        //       href: '/tables/regular-tables',
        //     },
        //   ]
        // },
        // {
        //   header: true,
        //   title: 'Dashboard Boxes',
        // },
        // {
        //   icon: 'pe-7s-graph2',
        //   title: 'Chart Boxes',
        //   href: '/widgets/chart-boxes-3',
        // },
        // {
        //   header: true,
        //   title: 'Forms',
        // },
        // {
        //   icon: 'pe-7s-light',
        //   title: 'Elements',
        //   child: [
        //     {
        //       title: 'Controls',
        //       href: '/forms/controls',
        //     },
        //     {
        //       title: 'Layouts',
        //       href: '/forms/layouts',
        //     },
        //   ],
        // },
        // {
        //   header: true,
        //   title: 'Charts',
        // },
        // {
        //   icon: 'pe-7s-graph2',
        //   title: 'ChartJS',
        //   href: '/charts/chartjs',
        // },
      ],

      collapsed: true,

      windowWidth: 0,
    };
  },
  props: {
    sidebarbg: String,
  },
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
    toggleSidebarHover(add, className) {
      const el = document.body;
      this.sidebarActive = !this.sidebarActive;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth > "992") {
        if (add === "add") {
          el.classList.add(className);
        } else {
          el.classList.remove(className);
        }
      }
    },
    getWindowWidth() {
      const el = document.body;

      this.windowWidth = document.documentElement.clientWidth;

      if (this.windowWidth < "1350") {
        el.classList.add("closed-sidebar", "closed-sidebar-md");
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      window.addEventListener("resize", this.getWindowWidth);

      // Init
      this.getWindowWidth();
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  },
};
</script>

<style></style>
