<script setup lang="ts">
interface GoogleTranslateElementOptions {
  pageLanguage: string
  autoDisplay: boolean
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

const widgetId = 'google_translate_element'

function initializeWidget() {
  const TranslateElement = window.google?.translate?.TranslateElement
  if (!TranslateElement) return
  new TranslateElement({ pageLanguage: 'en', autoDisplay: false }, widgetId)
}

onMounted(() => {
  window.googleTranslateElementInit = initializeWidget

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-translate]')
  if (existingScript) {
    if (window.google?.translate?.TranslateElement) initializeWidget()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  script.dataset.googleTranslate = 'true'
  document.head.appendChild(script)
})

onBeforeUnmount(() => {
  delete window.googleTranslateElementInit
})
</script>

<template>
  <div class="google-translate">
    <span class="visually-hidden">Translate this page</span>
    <div :id="widgetId" />
  </div>
</template>
