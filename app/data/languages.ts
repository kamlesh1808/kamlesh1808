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

type LanguageFieldParser<T> = (value: TomlValue | undefined, name: string) => T

const LANGUAGE_FIELD_PARSERS = {
  code: ((value: TomlValue | undefined, name: string): string => {
    if (typeof value !== 'string') throw new Error(`Expected TOML string: ${name}`)
    return value
  }) satisfies LanguageFieldParser<string>,
  name: ((value: TomlValue | undefined, name: string): string => {
    if (typeof value !== 'string') throw new Error(`Expected TOML string: ${name}`)
    return value
  }) satisfies LanguageFieldParser<string>,
  usersMillions: ((value: TomlValue | undefined, name: string): number => {
    if (typeof value !== 'number') throw new Error(`Expected TOML number: ${name}`)
    if (!(value > 0)) throw new Error(`Expected positive TOML number: ${name}`)
    return value
  }) satisfies LanguageFieldParser<number>,
  approx: ((value: TomlValue | undefined, name: string): boolean | undefined => {
    if (value === undefined) return undefined
    if (typeof value !== 'boolean') throw new Error(`Expected TOML boolean: ${name}`)
    return value
  }) satisfies LanguageFieldParser<boolean | undefined>,
}

function parseLanguageItem(item: TomlTable): Language {
  const usersMillions = LANGUAGE_FIELD_PARSERS.usersMillions(item.users_millions, 'language.users_millions')
  return {
    code: LANGUAGE_FIELD_PARSERS.code(item.code, 'language.code'),
    name: LANGUAGE_FIELD_PARSERS.name(item.name, 'language.name'),
    usersMillions,
    approx: LANGUAGE_FIELD_PARSERS.approx(item.approx, 'language.approx'),
  }
}

function assertUniqueCodes(languages: Language[]): void {
  const seenCodes = new Set<string>()
  for (const language of languages) {
    if (seenCodes.has(language.code)) throw new Error(`Duplicate language code: ${language.code}`)
    seenCodes.add(language.code)
  }
}

const languages: Language[] = tableArray(parseToml(languagesToml).language, 'language').map(parseLanguageItem)

assertUniqueCodes(languages)

export const LANGUAGES: Language[] = languages
export const LANGUAGE_CODES: string[] = languages.map(language => language.code)
