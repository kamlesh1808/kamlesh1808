<script setup lang="ts">
import type { Education, Experience, SkillCategory } from '~/types/about'

interface Profile {
  name: string
  subtitle: string
  avatarUrl: string
}

interface ContactLink {
  url: string
  ariaLabel: string
  iconClass: string
  external: boolean
  showInFooter: boolean
}

interface Contact {
  location: string
  locationUrl: string
  region: string
  links: ContactLink[]
}

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
  <PageHero variant="about-hero" eyebrow="ABOUT">
    <div class="profile-card">
      <p class="mb-1 fw-semibold profile-name">{{ profile.name }}</p>
      <p class="mb-3 profile-subtitle">{{ profile.subtitle }}</p>
      <p class="resume-contact mb-0">
          <a :href="contact.locationUrl" target="_blank" rel="noreferrer">{{ contact.location }}</a>, {{ contact.region }}
          <span class="contact-links">
            <a
              v-for="link in contact.links"
              :key="link.ariaLabel"
              :href="link.url"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noreferrer' : undefined"
              :aria-label="link.ariaLabel"
            ><i :class="link.iconClass" aria-hidden="true"></i></a>
          </span>
        </p>
    </div>
  </PageHero>
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

        <section>
          <h2>Professional Experience</h2>

          <div v-for="item in experience" :key="`${item.date}-${item.employer}`" class="timeline-item">
            <p class="timeline-date">{{ item.date }}</p>
            <h3>
              <a v-if="item.employerUrl" :href="item.employerUrl" target="_blank" rel="noreferrer" class="employer-link">{{ item.employer }}</a>
              <template v-else>{{ item.employer }}</template>
            </h3>
            <p>{{ item.role }}</p>
            <ul>
              <li v-if="item.projectUrl">{{ item.projectPrefix }} <a :href="item.projectUrl">{{ item.projectUrl }}</a></li>
              <li v-for="bullet in item.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </div>
        </section>

        <section class="mt-5">
          <h2>Education</h2>
          <div v-for="item in education" :key="item.date" class="timeline-item">
            <p v-if="item.date" class="timeline-date">{{ item.date }}</p>
            <p>
              {{ item.program }} — <a :href="item.credentialUrl" target="_blank" rel="noreferrer" class="employer-link">{{ item.credentialLabel }}</a> - {{ item.duration }}<br>
              {{ item.institution }}
            </p>
          </div>
        </section>

      </div>
    </div>

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
  </section>
</template>
