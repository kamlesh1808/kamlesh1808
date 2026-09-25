<script setup lang="ts">
import type { Education, Experience } from '~/types/about'

defineProps<{ experience: Experience[]; education: Education[] }>()
</script>

<template>
  <section>
    <h2>Professional Experience</h2>

    <div v-for="(item, index) in experience" :key="item.employer ? `${item.date}-${item.employer}` : `experience-${index}`" class="timeline-item">
      <p class="timeline-date">{{ item.date }}</p>
      <h3>
        <a v-if="item.employerUrl" :href="item.employerUrl" target="_blank" rel="noreferrer noopener" class="employer-link">{{ item.employer }}</a>
        <template v-else>{{ item.employer }}</template>
      </h3>
      <p>{{ item.role }}</p>
      <ul>
        <li v-if="item.projectUrl">{{ item.projectPrefix }} <a :href="item.projectUrl" target="_blank" rel="noreferrer noopener">{{ item.projectUrl }}</a></li>
        <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
      </ul>
    </div>
  </section>

  <section class="mt-5">
    <h2>Education</h2>
    <div v-for="(item, index) in education" :key="item.date || `education-${index}`" class="timeline-item">
      <p v-if="item.date" class="timeline-date">{{ item.date }}</p>
      <p>{{ item.program }} — <a :href="item.credentialUrl" target="_blank" rel="noreferrer noopener" class="employer-link">{{ item.credentialLabel }}</a> - {{ item.duration }}</p>
      <p>{{ item.institution }}</p>
    </div>
  </section>
</template>
