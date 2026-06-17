'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'
import { labelClass } from '../forms/field-styles'

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        active ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  )
}

/**
 * TipTap rich-text editor. Emits HTML via onChange.
 */
export default function RichTextEditor({ label = 'Content', value = '', onChange }) {
  const editor = useEditor({
    // Avoid SSR hydration mismatch in the Next.js App Router.
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[200px] px-3 py-2 focus:outline-none text-white',
      },
    },
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  })

  // Sync external value changes (e.g. async initialData load) into the editor.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value])

  if (!editor) {
    return (
      <div>
        <label className={labelClass}>{label}</label>
        <div className="bg-gray-800 border border-gray-700 rounded-lg min-h-[200px]" />
      </div>
    )
  }

  function setLink() {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-850">
          <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolbarButton>
          <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolbarButton>
          <ToolbarButton title="Strike" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></ToolbarButton>
          <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
          <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
          <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
          <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarButton>
          <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</ToolbarButton>
          <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}>🔗</ToolbarButton>
          <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>✕</ToolbarButton>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
