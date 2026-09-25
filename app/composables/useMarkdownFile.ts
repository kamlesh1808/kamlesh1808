import type { Ref } from 'vue'

/** Clipboard + download helpers for generated markdown output. */
export function useMarkdownFile(result: Ref<{ filename: string; markdown: string } | null>, copyStatus: Ref<string>) {
  async function copyMarkdown(): Promise<void> {
    if (!result.value) return
    try {
      await navigator.clipboard.writeText(result.value.markdown)
      copyStatus.value = 'Copied to clipboard.'
    }
    catch {
      const area = document.createElement('textarea')
      area.value = result.value.markdown
      document.body.appendChild(area)
      area.select()
      try {
        document.execCommand('copy')
        copyStatus.value = 'Copied to clipboard.'
      }
      catch {
        copyStatus.value = 'Copy failed — select the text manually.'
      }
      document.body.removeChild(area)
    }
  }

  function downloadMarkdown(): void {
    if (!result.value) return
    const blob = new Blob([result.value.markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = result.value.filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  return { copyMarkdown, downloadMarkdown }
}
