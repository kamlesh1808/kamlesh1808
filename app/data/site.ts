import siteToml from './site.toml?raw'
import { parseToml, type TomlTable, type TomlValue } from '~/utils/toml'
import type { Education, Experience, SkillCategory } from '~/types/about'

function table(value: TomlValue | undefined, name: string): TomlTable {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Expected TOML table: ${name}`)
  return value
}

function tableArray(value: TomlValue | undefined, name: string): TomlTable[] {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'object' || Array.isArray(item))) {
    throw new Error(`Expected TOML table array: ${name}`)
  }
  return value as TomlTable[]
}

function stringValue(value: TomlValue | undefined, name: string): string {
  if (typeof value !== 'string') throw new Error(`Expected TOML string: ${name}`)
  return value
}

function optionalString(value: TomlValue | undefined, name: string): string | undefined {
  if (value === undefined) return undefined
  return stringValue(value, name)
}

function booleanValue(value: TomlValue | undefined, name: string): boolean {
  if (typeof value !== 'boolean') throw new Error(`Expected TOML boolean: ${name}`)
  return value
}

function stringArray(value: TomlValue | undefined, name: string): string[] {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
    throw new Error(`Expected TOML string array: ${name}`)
  }
  return value as string[]
}

const siteData = parseToml(siteToml)
const profile = table(siteData.profile, 'profile')
const contact = table(siteData.contact, 'contact')
const routes = table(siteData.routes, 'routes')
const contactLinks = tableArray(contact.links, 'contact.links').map(link => ({
  url: stringValue(link.url, 'contact.links.url'),
  ariaLabel: stringValue(link.label, 'contact.links.label'),
  iconClass: stringValue(link.icon_class, 'contact.links.icon_class'),
  external: booleanValue(link.external, 'contact.links.external'),
  showInFooter: booleanValue(link.show_in_footer, 'contact.links.show_in_footer'),
}))

export const siteLinks = {
  profile: {
    name: stringValue(profile.name, 'profile.name'),
    subtitle: stringValue(profile.subtitle, 'profile.subtitle'),
    avatarUrl: stringValue(profile.avatar_url, 'profile.avatar_url'),
  },
  contact: {
    location: stringValue(contact.location, 'contact.location'),
    locationUrl: stringValue(contact.location_url, 'contact.location_url'),
    region: stringValue(contact.region, 'contact.region'),
    links: contactLinks,
  },
  routes: {
    home: stringValue(routes.home, 'routes.home'),
    search: stringValue(routes.search, 'routes.search'),
    topics: stringValue(routes.topics, 'routes.topics'),
    toolsWrite: stringValue(routes.tools_write, 'routes.tools_write'),
    toolsDrafts: stringValue(routes.tools_drafts, 'routes.tools_drafts'),
  },
  navigation: tableArray(siteData.navigation, 'navigation').map(link => ({
    label: stringValue(link.label, 'navigation.label'),
    to: stringValue(link.to, 'navigation.to'),
  })),
  social: contactLinks.filter(link => link.showInFooter),
}

const summary = table(siteData.summary, 'summary')
const impact = table(siteData.impact, 'impact')

const experience = tableArray(siteData.experience, 'experience').map(item => ({
  date: stringValue(item.date, 'experience.date'),
  employer: stringValue(item.employer, 'experience.employer'),
  employerUrl: optionalString(item.employer_url, 'experience.employer_url'),
  role: stringValue(item.role, 'experience.role'),
  bullets: stringArray(item.bullets, 'experience.bullets'),
  projectPrefix: optionalString(item.project_prefix, 'experience.project_prefix'),
  projectUrl: optionalString(item.project_url, 'experience.project_url'),
}))

const education = tableArray(siteData.education, 'education').map(item => ({
  date: stringValue(item.date, 'education.date'),
  program: stringValue(item.program, 'education.program'),
  credentialLabel: stringValue(item.credential_label, 'education.credential_label'),
  credentialUrl: stringValue(item.credential_url, 'education.credential_url'),
  duration: stringValue(item.duration, 'education.duration'),
  institution: stringValue(item.institution, 'education.institution'),
}))

const skillsData = table(siteData.skills, 'skills')
const topSkills = stringArray(skillsData.top, 'skills.top')
const skillCategories = tableArray(siteData.skill_categories, 'skill_categories').map(category => ({
  name: stringValue(category.name, 'skill_categories.name'),
  items: tableArray(category.items, 'skill_categories.items').map(item => ({
    name: stringValue(item.name, 'skill_categories.items.name'),
    linkKey: optionalString(item.link_key, 'skill_categories.items.link_key'),
    className: stringValue(item.class_name, 'skill_categories.items.class_name'),
    title: optionalString(item.title, 'skill_categories.items.title'),
  })),
}))

const skillLinksTable = table(siteData.skill_links, 'skill_links')
const skillLinks = Object.fromEntries(
  Object.entries(skillLinksTable).map(([name, url]) => [name, stringValue(url, `skill_links.${name}`)]),
)

export const aboutData = {
  profile: siteLinks.profile,
  contact: siteLinks.contact,
  summaryItems: stringArray(summary.items, 'summary.items'),
  impactItems: stringArray(impact.items, 'impact.items'),
  topSkills,
  experience: experience as Experience[],
  education: education as Education[],
  skillCategories: skillCategories as SkillCategory[],
  skillUrl: (name: string): string | null => skillLinks[name] ?? null,
}
