<script setup lang="ts">
import type { Contact, Education, Experience, Profile, SkillCategory } from '~/types/about'

// Composition wrapper: layout lives in AboutHero / ExperienceTimeline /
// SkillsTable so pages keep working via a single <AboutComp v-bind="about" />.
defineProps<{
  profile: Profile
  contact: Contact
  summaryItems: string[]
  impactItems: string[]
  topSkills: string[]
  experience: Experience[]
  education: Education[]
  skillCategories: SkillCategory[]
  skillUrl: (name: string) => string | null
}>()
</script>
<template>
  <AboutHero :profile="profile" :contact="contact" />
  <section class="container page-shell resume about-shell">

    <div class="row g-5">
      <div class="col-12">

        <section class="summary-section mb-4">
          <h2>Summary</h2>
          <CheckList :items="summaryItems" />
        </section>

        <div class="mb-4">
          <p class="fw-semibold mb-2">Top Skills</p>
          <SkillTag v-for="skill in topSkills" :key="skill" :name="skill" :href="skillUrl(skill)" class-name="tag text-wrap me-1 mb-1" />
        </div>

        <section class="mb-5">
          <h2>Top Impact Projects</h2>
          <CheckList :items="impactItems" />
        </section>

        <ExperienceTimeline :experience="experience" :education="education" />

      </div>
    </div>

    <SkillsTable :skill-categories="skillCategories" :skill-url="skillUrl" />
  </section>
</template>
