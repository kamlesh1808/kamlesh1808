export interface ContactLink {
  url: string
  ariaLabel: string
  iconClass: string
  external: boolean
}

export interface Experience {
  date: string
  employer: string
  employerUrl?: string
  role: string
  bullets: string[]
  projectPrefix?: string
  projectUrl?: string
}

export interface Education {
  date: string
  program: string
  credentialLabel: string
  credentialUrl: string
  duration: string
  institution: string
}

export interface Skill {
  name: string
  linkKey?: string
  className: string
  title?: string
}

export interface SkillCategory {
  name: string
  items: Skill[]
}
