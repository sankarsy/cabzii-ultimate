"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { wordCount, readingTimeMinutes } from "../../../lib/vehicleEnterpriseSeo";

function Btn({ active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded px-2 py-1 text-[11px] font-semibold ${
        active ? "bg-sky-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export default function SeoRichTextEditor({ value = "", onChange, disabled = false, dark = false }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: "Write long-form SEO content…" }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none min-h-[180px] px-3 py-2 focus:outline-none ${
          dark ? "prose-invert text-slate-100" : "text-slate-800"
        }`
      }
    }
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current && value !== undefined) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return <div className="h-48 animate-pulse rounded-xl bg-slate-100" />;
  }

  const words = wordCount(editor.getHTML());

  return (
    <div className={`overflow-hidden rounded-xl border ${dark ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white"}`}>
      <div className={`flex flex-wrap gap-1 border-b px-2 py-1.5 ${dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"}`}>
        <Btn disabled={disabled} active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</Btn>
        <Btn disabled={disabled} active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>I</Btn>
        <Btn disabled={disabled} active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</Btn>
        <Btn disabled={disabled} active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn disabled={disabled} active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <Btn disabled={disabled} active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn disabled={disabled} active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <Btn disabled={disabled} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</Btn>
        <Btn disabled={disabled} active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</Btn>
        <Btn
          disabled={disabled}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </Btn>
        <Btn
          disabled={disabled}
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Image
        </Btn>
        <Btn disabled={disabled} onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}>Table</Btn>
        <Btn disabled={disabled} onClick={() => editor.chain().focus().undo().run()}>Undo</Btn>
        <Btn disabled={disabled} onClick={() => editor.chain().focus().redo().run()}>Redo</Btn>
      </div>
      <EditorContent editor={editor} />
      <div className={`border-t px-3 py-1.5 text-[11px] ${dark ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}>
        {words} words · ~{readingTimeMinutes(words)} min read
      </div>
    </div>
  );
}
