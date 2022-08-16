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
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faPlus,
);

export default {
  props: {
    icon: String,
    heading: String,
    subheading: String,
    addtext: String,
    clickHandler: Function
  }
}
</script>
