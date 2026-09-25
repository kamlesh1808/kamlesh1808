<script setup lang="ts">
import { useGoogleTranslate } from '~/composables/useGoogleTranslate'

const { widgetId } = useGoogleTranslate()
</script>

<template>
  <div class="google-translate">
    <span class="visually-hidden">Translate this page</span>
    <div :id="widgetId" />
  </div>
</template>
