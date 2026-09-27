import siteToml from './site.toml?raw'
import { parseToml, type TomlTable, type TomlValue } from '~/utils/toml'
import type { Education, Experience, SkillCategory } from '~/types/about'

const FALLBACK_PROFILE = {
  name: 'Kamlesh Patel',
  subtitle: 'Software Engineering',
  avatarUrl: 'https://github.com/kamlesh1808.png',
}

const FALLBACK_CONTACT = {
  location: 'Mississauga',
  locationUrl: 'https://en.wikipedia.org/wiki/Mississauga',
  region: 'Ontario, Canada',
}

const FALLBACK_ROUTES = {
  home: '/',
  search: '/search',
  topics: '/topics',
  toolsWrite: '/tools/write',
  toolsDrafts: '/tools/drafts',
}

const asTable = (value: TomlValue | undefined, fallback: TomlTable = {}): TomlTable =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as TomlTable) : fallback

const asTableArray = (value: TomlValue | undefined): TomlTable[] =>
  (Array.isArray(value) ? value : []).filter(
    (item): item is TomlTable => typeof item === 'object' && item !== null && !Array.isArray(item),
  )

const asString = (value: TomlValue | undefined, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const asOptionalString = (value: TomlValue | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined

const asBoolean = (value: TomlValue | undefined, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback

const asStringArray = (value: TomlValue | undefined): string[] =>
  (Array.isArray(value) ? value : []).filter((item): item is string => typeof item === 'string')

const siteData: TomlTable = parseToml(siteToml)
const profile = asTable(siteData?.profile)
const contact = asTable(siteData?.contact)
const routes = asTable(siteData?.routes)
const contactLinks = asTableArray(contact?.links).map(link => ({
  url: asString(link?.url),
  ariaLabel: asString(link?.label),
  iconClass: asString(link?.icon_class),
  external: asBoolean(link?.external),
  showInFooter: asBoolean(link?.show_in_footer),
}))

export const siteLinks = {
  profile: {
    name: asString(profile?.name, FALLBACK_PROFILE.name),
    subtitle: asString(profile?.subtitle, FALLBACK_PROFILE.subtitle),
    avatarUrl: asString(profile?.avatar_url, FALLBACK_PROFILE.avatarUrl),
  },
  contact: {
    location: asString(contact?.location, FALLBACK_CONTACT.location),
    locationUrl: asString(contact?.location_url, FALLBACK_CONTACT.locationUrl),
    region: asString(contact?.region, FALLBACK_CONTACT.region),
    links: contactLinks,
  },
  routes: {
    home: asString(routes?.home, FALLBACK_ROUTES.home),
    search: asString(routes?.search, FALLBACK_ROUTES.search),
    topics: asString(routes?.topics, FALLBACK_ROUTES.topics),
    toolsWrite: asString(routes?.tools_write, FALLBACK_ROUTES.toolsWrite),
    toolsDrafts: asString(routes?.tools_drafts, FALLBACK_ROUTES.toolsDrafts),
  },
  navigation: asTableArray(siteData?.navigation).map(link => ({
    label: asString(link?.label),
    to: asString(link?.to),
  })),
  social: contactLinks.filter(link => link.showInFooter),
}

const summary = asTable(siteData?.summary)
const impact = asTable(siteData?.impact)

const experience = asTableArray(siteData?.experience).map(item => ({
  date: asString(item?.date),
  employer: asString(item?.employer),
  employerUrl: asOptionalString(item?.employer_url),
  role: asString(item?.role),
  bullets: asStringArray(item?.bullets),
  projectPrefix: asOptionalString(item?.project_prefix),
  projectUrl: asOptionalString(item?.project_url),
}))

const education = asTableArray(siteData?.education).map(item => ({
  date: asString(item?.date),
  program: asString(item?.program),
  credentialLabel: asString(item?.credential_label),
  credentialUrl: asString(item?.credential_url),
  duration: asString(item?.duration),
  institution: asString(item?.institution),
}))

const skillsData = asTable(siteData?.skills)
const topSkills = asStringArray(skillsData?.top)
const skillCategories = asTableArray(siteData?.skill_categories).map(category => ({
  name: asString(category?.name),
  items: asTableArray(category?.items).map(item => ({
    name: asString(item?.name),
    linkKey: asOptionalString(item?.link_key),
    className: asString(item?.class_name),
    title: asOptionalString(item?.title),
  })),
}))

const skillLinksTable = asTable(siteData?.skill_links)
const skillLinks: Record<string, string> = Object.fromEntries(
  Object.entries(skillLinksTable).flatMap(([name, url]) =>
    typeof url === 'string' ? [[name, url] as const] : [],
  ),
)

export const aboutData = {
  profile: siteLinks.profile,
  contact: siteLinks.contact,
  summaryItems: asStringArray(summary?.items),
  impactItems: asStringArray(impact?.items),
  topSkills,
  experience: experience as Experience[],
  education: education as Education[],
  skillCategories: skillCategories as SkillCategory[],
  skillUrl: (name: string): string | null => skillLinks[name] ?? null,
}
