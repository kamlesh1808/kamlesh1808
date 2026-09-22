<script setup lang="ts">
import { setupAboutPage } from '~/page-scripts/about'

const about = setupAboutPage()
</script>
<template>
  <AboutComp v-bind="about" />
</template>
