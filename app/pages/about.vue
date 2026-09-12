<script setup lang="ts">
import { setupAboutPage } from '~/page-scripts/about'

const {
  profile,
  contact,
  summaryItems,
  impactItems,
  topSkills,
  experience,
  education,
  skillCategories,
  skillUrl,
} = setupAboutPage()
</script>
<template>
  <section class="container page-shell resume about-shell">

    <div class="row g-5">
      <div class="col-12">

        <div class="mb-4">
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
        </div>

        <section class="summary-section mb-4">
          <h2>Summary</h2>
          <ul class="list-unstyled">
            <li v-for="item in summaryItems" :key="item" class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />{{ item }}</li>
          </ul>
        </section>

        <div class="mb-4">
          <p class="fw-semibold mb-2">Top Skills</p>
          <template v-for="skill in topSkills" :key="skill">
            <a v-if="skillUrl(skill)" :href="skillUrl(skill)!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">{{ skill }}</span></a>
            <span v-else class="badge bg-secondary text-wrap me-1 mb-1">{{ skill }}</span>
          </template>
        </div>

        <section class="mb-5">
          <h2>Top Impact Projects</h2>
          <ul class="list-unstyled">
            <li v-for="item in impactItems" :key="item" class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />{{ item }}</li>
          </ul>
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
            <p class="timeline-date">{{ item.date }}</p>
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
                  <template v-for="skill in category.items" :key="skill.name">
                    <a v-if="skill.linkKey" :href="skillUrl(skill.linkKey)!" target="_blank" rel="noopener noreferrer"><span :class="skill.className" :title="skill.title || undefined">{{ skill.name }}</span></a>
                    <span v-else :class="skill.className" :title="skill.title || undefined">{{ skill.name }}</span>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
