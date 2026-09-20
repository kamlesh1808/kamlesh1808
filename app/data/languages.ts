import languagesToml from './languages.toml?raw'
import { parseToml, type TomlTable, type TomlValue } from '~/utils/toml'

export interface Language {
  code: string
  name: string
  usersMillions: number
  approx?: boolean
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

function numberValue(value: TomlValue | undefined, name: string): number {
  if (typeof value !== 'number') throw new Error(`Expected TOML number: ${name}`)
  return value
}

function optionalBoolean(value: TomlValue | undefined, name: string): boolean | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'boolean') throw new Error(`Expected TOML boolean: ${name}`)
  return value
}

const languages: Language[] = tableArray(parseToml(languagesToml).language, 'language').map((item) => {
  const usersMillions = numberValue(item.users_millions, 'language.users_millions')
  if (!(usersMillions > 0)) throw new Error('Expected positive TOML number: language.users_millions')
  return {
    code: stringValue(item.code, 'language.code'),
    name: stringValue(item.name, 'language.name'),
    usersMillions,
    approx: optionalBoolean(item.approx, 'language.approx'),
  }
})

const seenCodes = new Set<string>()
for (const language of languages) {
  if (seenCodes.has(language.code)) throw new Error(`Duplicate language code: ${language.code}`)
  seenCodes.add(language.code)
}

export const LANGUAGES: Language[] = languages
export const LANGUAGE_CODES: string[] = languages.map(language => language.code)
