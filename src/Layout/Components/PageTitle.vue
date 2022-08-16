<template>
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
      <div class="page-title-actions">
        <button type="button" class="btn-shadow d-inline-flex align-items-center btn btn-primary" @click="clickHandler">
          <font-awesome-icon class="mr-2" icon="plus" />
          {{ addtext }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faPlus,
);

export default {
  components: {
    'font-awesome-icon': FontAwesomeIcon,
  },
  props: {
    icon: String,
    heading: String,
    subheading: String,
    addtext: String,
    clickHandler: Function
  }
}
</script>
