<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<template>
  <ul class="list-unstyled">
    <li v-for="item in items" :key="item" class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" aria-hidden="true" />{{ item }}</li>
  </ul>
</template>
