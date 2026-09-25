import { onBeforeUnmount, onMounted } from 'vue'
import { LANGUAGE_CODES } from '~/data/languages'

interface GoogleTranslateElementOptions {
  pageLanguage: string
  autoDisplay: boolean
  includedLanguages: string
}

interface GoogleTranslateApi {
  TranslateElement: new (options: GoogleTranslateElementOptions, elementId: string) => unknown
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: GoogleTranslateApi
    }
  }
}

const WIDGET_ID = 'google_translate_element'
const SCRIPT_SELECTOR = 'script[data-google-translate]'
const SCRIPT_SRC = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'

function initializeWidget(widgetId: string = WIDGET_ID): boolean {
  const TranslateElement = window.google?.translate?.TranslateElement
  if (!TranslateElement) return false
  try {
    // eslint-disable-next-line no-new
    new TranslateElement({ pageLanguage: 'en', autoDisplay: false, includedLanguages: LANGUAGE_CODES.join(',') }, widgetId)
    return true
  }
  catch (error) {
    console.error('[GoogleTranslate] Failed to initialize widget', error)
    return false
  }
}

function ensureScript(onReady: () => void): void {
  const existing = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR)
  if (existing) {
    // Script already present (e.g. client-side nav): init immediately if API ready.
    if (window.google?.translate?.TranslateElement) onReady()
    return
  }
  window.googleTranslateElementInit = onReady
  const script = document.createElement('script')
  script.src = SCRIPT_SRC
  script.async = true
  script.dataset.googleTranslate = 'true'
  script.onerror = () => {
    console.error('[GoogleTranslate] Failed to load translate script')
    delete window.googleTranslateElementInit
  }
  document.head.appendChild(script)
}

/**
 * Mounts the Google Translate widget into `widgetId` and cleans up the
 * global callback on unmount. Keeps the component thin; all DOM/script
 * side effects live here with error handling.
 */
export function useGoogleTranslate(widgetId: string = WIDGET_ID) {
  function init(): void {
    ensureScript(() => {
      initializeWidget(widgetId)
    })
  }

  function cleanup(): void {
    delete window.googleTranslateElementInit
  }

  onMounted(init)
  onBeforeUnmount(cleanup)

  return { widgetId, init, cleanup }
}
