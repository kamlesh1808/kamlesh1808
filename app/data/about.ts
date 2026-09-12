import profileContactToml from './profile-contact.toml?raw'
import summaryImpactToml from './summary-impact.toml?raw'
import experienceToml from './experience.toml?raw'
import educationToml from './education.toml?raw'
import skillsToml from './skills.toml?raw'
import skillLinksToml from './skill-links.toml?raw'
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

const profileData = parseToml(profileContactToml)
const profile = table(profileData.profile, 'profile')
const contact = table(profileData.contact, 'contact')
const contactLinks = tableArray(contact.links, 'contact.links').map(link => ({
  url: stringValue(link.url, 'contact.links.url'),
  ariaLabel: stringValue(link.aria_label, 'contact.links.aria_label'),
  iconClass: stringValue(link.icon_class, 'contact.links.icon_class'),
  external: booleanValue(link.external, 'contact.links.external'),
}))

const summaryImpactData = parseToml(summaryImpactToml)
const summary = table(summaryImpactData.summary, 'summary')
const impact = table(summaryImpactData.impact, 'impact')

const experience = tableArray(parseToml(experienceToml).experience, 'experience').map(item => ({
  date: stringValue(item.date, 'experience.date'),
  employer: stringValue(item.employer, 'experience.employer'),
  employerUrl: optionalString(item.employer_url, 'experience.employer_url'),
  role: stringValue(item.role, 'experience.role'),
  bullets: stringArray(item.bullets, 'experience.bullets'),
  projectPrefix: optionalString(item.project_prefix, 'experience.project_prefix'),
  projectUrl: optionalString(item.project_url, 'experience.project_url'),
}))

const education = tableArray(parseToml(educationToml).education, 'education').map(item => ({
  date: stringValue(item.date, 'education.date'),
  program: stringValue(item.program, 'education.program'),
  credentialLabel: stringValue(item.credential_label, 'education.credential_label'),
  credentialUrl: stringValue(item.credential_url, 'education.credential_url'),
  duration: stringValue(item.duration, 'education.duration'),
  institution: stringValue(item.institution, 'education.institution'),
}))

const skillsData = parseToml(skillsToml)
const topSkills = stringArray(skillsData.top_skills, 'top_skills')
const skillCategories = tableArray(skillsData.categories, 'categories').map(category => ({
  name: stringValue(category.name, 'categories.name'),
  items: tableArray(category.items, 'categories.items').map(item => ({
    name: stringValue(item.name, 'categories.items.name'),
    linkKey: optionalString(item.link_key, 'categories.items.link_key'),
    className: stringValue(item.class_name, 'categories.items.class_name'),
    title: optionalString(item.title, 'categories.items.title'),
  })),
}))

const skillLinksTable = table(parseToml(skillLinksToml).skills, 'skills')
const skillLinks = Object.fromEntries(
  Object.entries(skillLinksTable).map(([name, url]) => [name, stringValue(url, `skills.${name}`)]),
)

export const aboutData = {
  profile: {
    name: stringValue(profile.name, 'profile.name'),
    subtitle: stringValue(profile.subtitle, 'profile.subtitle'),
  },
  contact: {
    location: stringValue(contact.location, 'contact.location'),
    locationUrl: stringValue(contact.location_url, 'contact.location_url'),
    region: stringValue(contact.region, 'contact.region'),
    links: contactLinks,
  },
  summaryItems: stringArray(summary.items, 'summary.items'),
  impactItems: stringArray(impact.items, 'impact.items'),
  topSkills,
  experience: experience as Experience[],
  education: education as Education[],
  skillCategories: skillCategories as SkillCategory[],
  skillUrl: (name: string): string | null => skillLinks[name] ?? null,
}
