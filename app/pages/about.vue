<script setup lang="ts">
import skillsToml from '~/data/skill-links.toml?raw'

useHead({ title: 'About' })

function parseSkillLinks(toml: string): Record<string, string> {
  const links: Record<string, string> = {}
  for (const line of toml.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('[')) {
      continue
    }
    const eq = trimmed.indexOf('=')
    if (eq < 0) {
      continue
    }
    const rawKey = trimmed.slice(0, eq).trim()
    const rawValue = trimmed.slice(eq + 1).trim()
    if (!rawKey.startsWith('"') || !rawKey.endsWith('"') || !rawValue.startsWith('"') || !rawValue.endsWith('"')) {
      continue
    }
    const skill = rawKey.slice(1, -1).trim()
    const url = rawValue.slice(1, -1).trim()
    if (skill && url) {
      links[skill] = url
    }
  }
  return links
}

const skillLinks: Record<string, string> = parseSkillLinks(skillsToml)

function skillUrl(name: string): string | null {
  return skillLinks[name] ?? null
}
</script>
<template>
  <section class="container page-shell resume about-shell">

    <div class="row g-5">
      <div class="col-12">

        <div class="mb-4">
                <div class="profile-card">
                  <p class="mb-1 fw-semibold profile-name">Kamlesh Patel</p>
                  <p class="mb-3 profile-subtitle">Software Engineering</p>
                            <p class="resume-contact mb-0"><a href="https://maps.app.goo.gl/7Ljs1QJ5Kuqw4zFdA" target="_blank" rel="noreferrer">Mississauga</a>, Ontario, Canada <span aria-hidden="true">·</span> <a href="mailto:kamlesh.patel18@gmail.com" aria-label="Email"><i class="fa-solid fa-envelope" aria-hidden="true"></i></a> <span aria-hidden="true">·</span> <a href="https://www.linkedin.com/in/kamlesh18/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin" aria-hidden="true"></i></a> <span aria-hidden="true">·</span> <a href="https://github.com/kamlesh1808" target="_blank" rel="noreferrer" aria-label="GitHub"><i class="fa-brands fa-github" aria-hidden="true"></i></a></p>

                </div>
              </div>

        <section class="mb-4">
          <h2>Summary</h2>
          <ul class="list-unstyled">
            <li class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />10+ years of Software Engineering,  designing and coding in the online travel and financial industry, ranging from 100 to 2000 employees, with over $1.5 billion in annual revenue</li>
            <li class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />I am a designer and builder of business and technical solutions that increase product revenue.</li>
            <li class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />I plan, am a self-starter and have worked with Business stakeholders at several organizations.</li>
            <li class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />Initiative to improve the product, continuous learning, write documentation to help the team</li>
          </ul>
        </section>

        <div class="mb-4">
          <p class="fw-semibold mb-2">Top Skills</p>
          <a :href="skillUrl('Java')!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">Java</span></a>
          <a :href="skillUrl('Kotlin')!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">Kotlin</span></a>
          <a :href="skillUrl('Microservices')!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">Microservices</span></a>
          <a :href="skillUrl('Spring Boot')!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">Spring Boot</span></a>
          <a :href="skillUrl('Jakarta EE')!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">Jakarta EE</span></a>
          <a :href="skillUrl('Google Cloud Platform')!" target="_blank" rel="noopener noreferrer"><span class="badge bg-secondary text-wrap me-1 mb-1">Google Cloud Platform</span></a>
          <span class="badge bg-secondary text-wrap me-1 mb-1">SQL</span>
        </div>

        <section class="mb-5">
          <h2>Top Impact Projects</h2>
          <ul class="list-unstyled">
            <li class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />Increased booking revenue. I designed and coded the Gamification microservice using Kotlin, Spring Boot 3, Gradle. Used by iOS and Android Apps, driving the gamification coupons feature.</li>
            <li class="mb-2"><i class="fa-solid fa-check-circle me-2 text-success" />Reduced users' time and effort by 8 hours per day. I led the build of the Hotel Similarity microservice with Java 21, Spring Boot, GCP, services, REST API, and designed the Similarity UI. Applied a 50% performance improvement of the Hotel Similarity calculation with parallelism.</li>
          </ul>
        </section>

        <section>
          <h2>Professional Experience</h2>

          <div class="timeline-item">
            <p class="timeline-date">Mar 2026 – Present</p>
            <h3><a href="https://www.salesforce.com" target="_blank" rel="noreferrer" class="employer-link">Salesforce</a></h3>
            <p>Software Engineering SMTS — Mississauga, ON, Canada</p>
            <ul>
              <li>Building Informatica Cloud Application Integration for 1000+ enterprise customers</li>
              <li>Java, Spring Boot, Microservices, Gradle, AI, Codex, Open Code, Claude Code</li>
            </ul>
          </div>

          <div class="timeline-item">
            <p class="timeline-date">Dec 2021 – Mar 2026</p>
            <h3><a href="https://www.priceline.com" target="_blank" rel="noreferrer" class="employer-link">Priceline</a></h3>
            <p>Senior Software Developer — Mississauga, ON, Canada</p>
            <ul>
              <li>Priceline is a global online travel agency offering hotel, flight, and car booking with over $1.5 billion ARR.</li>
              <li>Hotels Engineering | 90+ Engineers | I plan, design, build, test, document, support</li>
              <li>Lead Engineer of prod-2-qa Hotel Reference Data Sync project, impact Hotels team</li>
              <li>Led Product Backlog Refinements with a Business stakeholder, FE and BE Developers</li>
              <li>Built GCP AlloyDB Auth Proxy sidecar & pipeline integration for all developers building Spring Boot GKE Apps</li>
              <li>Advocated for change through persuasive communication and documentation, leading to the implementation of a cost-effective and architecturally simpler UI</li>
              <li>Increased business self-sufficiency - Built Backend business processes and REST APIs for the Self-service Hotel Similarity App, working with the front-end developer</li>
              <li>Augmented Client support by creating Splunk and New Relic Dashboard, Slack alerts</li>
              <li>Participated and provided feedback to early adopters of Codeium AI and CodeFresh GitOps deployment that resulted in successful implementation</li>
              <li>Automated auto-inserts and auto-links process 100+ BOOKING and AGODA hotels every day</li>
              <li>Simplification of Architecture - Reverse-engineered Occupancy Rates mapping from two microservices to a new single microservice for the Hotel Cache team</li>
              <li>Built Room Rates Percentage Distributor algorithm in collaboration with the business team</li>
            </ul>
          </div>

          <div class="timeline-item">
            <p class="timeline-date">Nov 2020 – Dec 2021</p>
            <h3><a href="https://www.omers.com" target="_blank" rel="noreferrer" class="employer-link">OMERS</a></h3>
            <p>Senior Software Engineer — Mississauga, ON, Canada (Remote)</p>
            <ul>
              <li>OMERS manages over $100 billion in assets, offering a defined-benefit pension Retirement Plan</li>
              <li>Design, code, and document the new Ontario Municipal Employee Pension Retirement System</li>
              <li>A key contributor to the Pension Calculation team with Spring Boot microservices development of both business and technical stories, software engineering processes, and best practices</li>
              <li>Pension Calculations using Strategy (policy) design pattern</li>
              <li>REST API Request and Response logging to Persistent Logging microservice using AspectJ, Kafka, and GCP DataStore to replay Pension calculations</li>
              <li>Improved the product by identifying technical debt stories for the upcoming Sprints</li>
              <li>Led PROD release management for a Sprint, creating git tags, deployments, QA fixes, and coordinating with other scrum teams</li>
              <li>Design and code PII — personal identifiable information logs masking solution — Separation Go Live</li>
              <li>Tech: Java 11, Spring Boot 2, Google Cloud Platform, Microservices, Kubernetes, Scrum, Docker, Gradle, GitLab, Postman, PostgreSQL, Oracle, IntelliJ, JIRA, Confluence, Mac OS</li>
            </ul>
          </div>

          <div class="timeline-item">
            <p class="timeline-date">Mar 2015 – Jul 2021</p>
            <h3>myStory — Personal Project</h3>
            <p>Founder & Principal Software Engineer</p>
            <ul>
              <li>mystory.work | myStory Blog Application | <a href="https://github.com/kamlesh1808/mystory">https://github.com/kamlesh1808/mystory</a></li>
              <li>An online platform to enable like-minded people to share and discuss stories to support each other.</li>
            </ul>
          </div>
        </section>

        <section class="mt-5">
          <h2>Education</h2>
          <div class="timeline-item">
            <p>Software Engineering - <a href="https://www.senecapolytechnic.ca/programs/fulltime/CPA.html" target="_blank" rel="noreferrer" class="employer-link">CPA Diploma</a>, 3 years | Seneca Polytechnic | Toronto, ON, Canada</p>
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
                <tr>
                  <th scope="row">Languages</th>
                  <td>
                    <a :href="skillUrl('Java')!" target="_blank" rel="noopener noreferrer"><span class="tag tag-large me-1 mb-1" title="Core skill — primary language in Salesforce (SMTS) & Priceline">Java</span></a>
                    <a :href="skillUrl('Kotlin')!" target="_blank" rel="noopener noreferrer"><span class="tag tag-large me-1 mb-1" title="Core skill — Kotlin / Spring Boot 3 microservices (Gamification, Hotel Similarity)">Kotlin</span></a>
                    <span class="tag tag-large me-1 mb-1">SQL</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">AI / ML</th>
                  <td>

                    <a :href="skillUrl('Codex')!" target="_blank" rel="noopener noreferrer"><span class="tag  me-1 mb-1">Codex</span></a>
                    <a :href="skillUrl('Open Code')!" target="_blank" rel="noopener noreferrer"><span class="tag  me-1 mb-1">Open Code</span></a>
                    <a :href="skillUrl('Claude Code')!" target="_blank" rel="noopener noreferrer"><span class="tag  me-1 mb-1">Claude Code</span></a>

                  </td>
                </tr>
                <tr>
                  <th scope="row">Frameworks</th>
                  <td>
                    <a :href="skillUrl('Spring Boot')!" target="_blank" rel="noopener noreferrer"><span class="tag tag-large me-1 mb-1" title="Core skill — Spring Boot microservices (GKE, Hotel Similarity, Gamification)">Spring Boot</span></a>
                    <a :href="skillUrl('Spring Framework')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Spring Framework</span></a>
                    <a :href="skillUrl('Spring AI')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Spring AI</span></a>
                    <a :href="skillUrl('Jakarta EE')!" target="_blank" rel="noopener noreferrer"><span class="tag tag-large me-1 mb-1">Jakarta EE</span></a>
                    <a :href="skillUrl('Microservices')!" target="_blank" rel="noopener noreferrer"><span class="tag tag-large me-1 mb-1" title="Core skill — Microservices architecture (Gamification, Hotel Similarity)">Microservices</span></a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Cloud Platforms</th>
                  <td>
                    <a :href="skillUrl('Google Cloud Platform')!" target="_blank" rel="noopener noreferrer"><span class="tag tag-large me-1 mb-1" title="Core skill — GCP AlloyDB, GKE, DataStore at Priceline & Salesforce">Google Cloud Platform</span></a>
                    <a :href="skillUrl('Kafka')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — Kafka for persistent logging microservice & eventing">Kafka</span></a>
                    <a :href="skillUrl('Digital Ocean')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Digital Ocean</span></a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Databases</th>
                  <td>
                    <a :href="skillUrl('PostgreSQL')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">PostgreSQL</span></a>
                    <a :href="skillUrl('AlloyDB')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">AlloyDB</span></a>
                    <a :href="skillUrl('CloudSQL')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">CloudSQL</span></a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">DevOps</th>
                  <td>
                    <a :href="skillUrl('Git')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Git</span></a>
                    <a :href="skillUrl('GitHub')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — GitHub at Salesforce & Priceline">GitHub</span></a>
                    <a :href="skillUrl('GitLab')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">GitLab</span></a>
                    <a :href="skillUrl('Maven')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Maven</span></a>
                    <a :href="skillUrl('Gradle')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — Gradle build (Salesforce, Gamification service)">Gradle</span></a>
                    <a :href="skillUrl('Docker')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — Docker & container workflows">Docker</span></a>
                    <a :href="skillUrl('Kubernetes')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — Kubernetes / GKE (AlloyDB Auth Proxy sidecar)">Kubernetes</span></a>
                    <a :href="skillUrl('Splunk')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — Splunk dashboards & alerts (Priceline)">Splunk</span></a>
                    <a :href="skillUrl('New Relic')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1" title="Core skill — New Relic dashboards (Priceline)">New Relic</span></a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Front-End Tech</th>
                  <td>
                    <a :href="skillUrl('HTML')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">HTML</span></a>
                    <a :href="skillUrl('CSS')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">CSS</span></a>
                    <a :href="skillUrl('Bootstrap')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Bootstrap</span></a>
                    <a :href="skillUrl('Thymeleaf')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Thymeleaf</span></a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Operating Systems</th>
                  <td>
                    <a :href="skillUrl('Mac OS')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Mac OS</span></a>
                    <a :href="skillUrl('Ubuntu Linux')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Ubuntu Linux</span></a>
                    <a :href="skillUrl('Linux Mint')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Linux Mint</span></a>
                    <a :href="skillUrl('Windows 11')!" target="_blank" rel="noopener noreferrer"><span class="tag me-1 mb-1">Windows 11</span></a>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    </div>
  </section>
</template>
