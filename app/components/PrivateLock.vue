<!-- Obscurity gate only: on static GitHub Pages hosting the drafts JSON and
     prerendered payloads remain fetchable by URL. This component hides content
     in the UI until the visitor enters the passcode; it is not access control. -->
<script setup lang="ts">
const emit = defineEmits<{ unlocked: [] }>()

const { isConfigured, verifyPasscode } = usePrivateAuth()
const passcode = ref('')
const error = ref('')
const checking = ref(false)

async function onSubmit(): Promise<void> {
  error.value = ''
  if (!isConfigured.value) return
  if (!passcode.value) {
    error.value = 'Enter the passcode.'
    return
  }
  checking.value = true
  try {
    const ok = await verifyPasscode(passcode.value)
    if (ok) {
      passcode.value = ''
      emit('unlocked')
    } else {
      error.value = 'Wrong passcode — try again.'
    }
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <section class="container content-section">
    <p class="eyebrow">PRIVATE</p>
    <h1>Passcode required</h1>
    <p>This area is passcode-gated. Enter the passcode to continue.</p>
    <div v-if="!isConfigured" class="alert alert-warning" role="status">
      Passcode not configured — set NUXT_PRIVATE_PASSCODE_HASH at build/dev time.
    </div>
    <form v-else novalidate @submit.prevent="onSubmit">
      <div class="col-md-6">
        <label class="form-label" for="private-passcode">Passcode</label>
        <input
          id="private-passcode"
          v-model="passcode"
          class="form-control"
          :class="{ 'is-invalid': error !== '' }"
          type="password"
          autocomplete="current-password"
        >
        <div v-if="error" class="invalid-feedback">{{ error }}</div>
      </div>
      <div class="d-flex gap-2 mt-3">
        <button class="btn btn-dark" type="submit" :disabled="checking">
          {{ checking ? 'Checking…' : 'Unlock' }}
        </button>
      </div>
    </form>
  </section>
</template>
