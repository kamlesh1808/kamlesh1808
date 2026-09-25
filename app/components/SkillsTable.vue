<script setup lang="ts">
import type { SkillCategory } from '~/types/about'

defineProps<{ skillCategories: SkillCategory[]; skillUrl: (name: string) => string | null }>()
</script>

<template>
  <div class="row g-4 mt-2">
    <div class="col-12">
      <div class="skills-card">
        <h2>Technical Skills Summary</h2>
        <table class="table skills-table w-100 mb-0">
          <caption class="visually-hidden">Technical skills by category</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Skills</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in skillCategories" :key="category.name">
              <th scope="row">{{ category.name }}</th>
              <td>
                <SkillTag v-for="skill in category.items" :key="skill.name" :name="skill.name" :href="skill.linkKey ? skillUrl(skill.linkKey) : null" :class-name="skill.className" :title="skill.title" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
