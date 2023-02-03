<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  prev: {
    type: Boolean,
    default: false,
  },
  next: {
    type: Boolean,
    default: false,
  },
  first: {
    type: Boolean,
    default: false,
  },
  last: {
    type: Boolean,
    default: false,
  },
});
function getClasses(active, disabled) {
  let activeValue, disabledValue;

  activeValue = active && "active";
  disabledValue = disabled && "disabled";

  return `${activeValue} ${disabledValue}`;
}
</script>
<template>
  <li class="page-item" :class="getClasses(active, disabled)">
    <a class="page-link" href="javascript:;">
      <span aria-hidden="true" :class="active ? 'text-white' : ''">
        {{ prev || next ? null : label }}
        {{ first || last ? null : label }}
        <i v-if="prev" class="fa fa-angle-left" title="Previous"></i>
        <i v-if="next" class="fa fa-angle-right" title="Next"></i>
        <i v-if="first" class="fa fa-angle-double-left" title="First"></i>
        <i v-if="last" class="fa fa-angle-double-right" title="Last"></i>
      </span>
    </a>
  </li>
</template>
