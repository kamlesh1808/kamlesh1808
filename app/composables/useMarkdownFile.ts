import type { Ref } from 'vue'

type CopyStrategy = (text: string) => Promise<void>

async function copyViaClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

async function copyViaExecCommand(text: string): Promise<void> {
  const area = document.createElement('textarea')
  area.value = text
  document.body.appendChild(area)
  try {
    area.select()
    const ok = document.execCommand('copy')
    if (!ok) throw new Error('execCommand copy failed')
  }
  finally {
    document.body.removeChild(area)
  }
}

const COPY_STRATEGIES: CopyStrategy[] = [copyViaClipboard, copyViaExecCommand]

/** Clipboard + download helpers for generated markdown output. */
export function useMarkdownFile(result: Ref<{ filename: string; markdown: string } | null>, copyStatus: Ref<string>) {
  async function copyMarkdown(): Promise<void> {
    if (!result.value) return
    const text = result.value.markdown
    for (const strategy of COPY_STRATEGIES) {
      try {
        await strategy(text)
        copyStatus.value = 'Copied to clipboard.'
        return
      }
      catch {
        // Try the next clipboard strategy.
      }
    }
    copyStatus.value = 'Copy failed — select the text manually.'
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
