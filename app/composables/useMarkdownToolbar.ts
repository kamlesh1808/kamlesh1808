import { nextTick, type Ref } from 'vue'

export interface ToolbarAction {
  action: string
  icon: string
  label: string
  suffix?: string
}

export const toolbarActions: ToolbarAction[] = [
  { action: 'bold', icon: 'fa-solid fa-bold', label: 'Bold' },
  { action: 'italic', icon: 'fa-solid fa-italic', label: 'Italic' },
  { action: 'h2', icon: 'fa-solid fa-heading', label: 'Heading 2', suffix: '2' },
  { action: 'h3', icon: 'fa-solid fa-heading', label: 'Heading 3', suffix: '3' },
  { action: 'ul', icon: 'fa-solid fa-list-ul', label: 'Bullet list' },
  { action: 'ol', icon: 'fa-solid fa-list-ol', label: 'Numbered list' },
  { action: 'quote', icon: 'fa-solid fa-quote-left', label: 'Quote' },
  { action: 'code', icon: 'fa-solid fa-code', label: 'Code' },
  { action: 'link', icon: 'fa-solid fa-link', label: 'Link' },
]

function focusSelection(el: HTMLTextAreaElement | null, start: number, end: number): void {
  if (!el) return
  el.focus()
  el.setSelectionRange(start, end)
}

/**
 * Editor text transformations for the markdown toolbar.
 * Operates on the body ref + body model passed in from the page.
 */
export function useMarkdownToolbar(body: Ref<string>, bodyRef: Ref<HTMLTextAreaElement | null>) {
  function surround(before: string, after: string, placeholder = 'text'): void {
    const el = bodyRef.value
    const current = body.value
    const start = el?.selectionStart ?? current.length
    const end = el?.selectionEnd ?? current.length
    const selected = current.slice(start, end) || placeholder
    body.value = current.slice(0, start) + before + selected + after + current.slice(end)
    nextTick(() => focusSelection(bodyRef.value, start + before.length, start + before.length + selected.length))
  }

  function prefixSelectedLines(prefix: string | ((index: number) => string)): void {
    const el = bodyRef.value
    const current = body.value
    const start = el?.selectionStart ?? current.length
    const end = el?.selectionEnd ?? current.length
    const lineStart = current.lastIndexOf('\n', start - 1) + 1
    const lineEnd = current.indexOf('\n', end)
    const blockEnd = lineEnd === -1 ? current.length : lineEnd
    const block = current.slice(lineStart, blockEnd)
    const lines = block.split('\n')
    const prefixed = lines.map((line, index) => {
      const marker = typeof prefix === 'function' ? prefix(index) : prefix
      return line.startsWith(marker) ? line : marker + line.replace(/^([#>\-\d.]+\s)*/, '')
    }).join('\n')
    body.value = current.slice(0, lineStart) + prefixed + current.slice(blockEnd)
    nextTick(() => {
      const elAfter = bodyRef.value
      if (!elAfter) return
      elAfter.focus()
      elAfter.setSelectionRange(lineStart, lineStart + prefixed.length)
    })
  }

  function applyToolbar(action: string): void {
    switch (action) {
      case 'bold': surround('**', '**'); break
      case 'italic': surround('*', '*'); break
      case 'h2': prefixSelectedLines('## '); break
      case 'h3': prefixSelectedLines('### '); break
      case 'ul': prefixSelectedLines('- '); break
      case 'ol': prefixSelectedLines(index => `${index + 1}. `); break
      case 'quote': prefixSelectedLines('> '); break
      case 'code': surround('`', '`', 'code'); break
      case 'link': surround('[', '](https://)', 'text'); break
    }
  }

  return { surround, prefixSelectedLines, applyToolbar, toolbarActions }
}
