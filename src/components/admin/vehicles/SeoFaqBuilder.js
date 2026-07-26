"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600 disabled:bg-slate-50";
}

function SortableFaq({ id, item, idx, disabled, expanded, onToggle, onChange, onRemove, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            className="cursor-grab rounded border border-slate-200 px-2 py-0.5 text-xs text-slate-500 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            ⋮⋮
          </button>
          <button type="button" className="text-xs font-bold text-slate-500" onClick={onToggle}>
            FAQ #{idx + 1} {expanded ? "▾" : "▸"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          <button type="button" disabled={disabled} className="rounded border px-2 text-xs" onClick={onDuplicate}>
            Duplicate
          </button>
          <button type="button" disabled={disabled} className="rounded border border-rose-200 px-2 text-xs text-rose-600" onClick={onRemove}>
            Delete
          </button>
        </div>
      </div>
      {expanded ? (
        <>
          <input
            className={`${inputCls()} mb-2`}
            disabled={disabled}
            placeholder="Question"
            value={item.question || ""}
            onChange={(e) => onChange({ ...item, question: e.target.value })}
          />
          <textarea
            className={`${inputCls()} min-h-[64px]`}
            disabled={disabled}
            placeholder="Answer"
            value={item.answer || ""}
            onChange={(e) => onChange({ ...item, answer: e.target.value })}
          />
        </>
      ) : (
        <p className="truncate text-sm text-slate-700">{item.question || "Untitled question"}</p>
      )}
    </div>
  );
}

export default function SeoFaqBuilder({ faq = [], onChange, disabled = false, onGenerate, generating = false }) {
  const [query, setQuery] = useState("");
  const [openMap, setOpenMap] = useState({});
  const list = Array.isArray(faq) ? faq : [];
  const ids = useMemo(() => list.map((_, i) => `faq-${i}`), [list]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredIndexes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list.map((_, i) => i);
    return list
      .map((item, i) => ({ i, text: `${item.question || ""} ${item.answer || ""}`.toLowerCase() }))
      .filter((x) => x.text.includes(q))
      .map((x) => x.i);
  }, [list, query]);

  const updateAt = (idx, nextItem) => {
    const next = [...list];
    next[idx] = nextItem;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange([...list, { question: "", answer: "" }])}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Add FAQ
        </button>
        <button
          type="button"
          disabled={disabled || generating}
          onClick={onGenerate}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate FAQ (AI)"}
        </button>
        <input
          className="min-w-[180px] flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
          placeholder="Search FAQ…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;
          const oldIndex = ids.indexOf(active.id);
          const newIndex = ids.indexOf(over.id);
          if (oldIndex < 0 || newIndex < 0) return;
          onChange(arrayMove(list, oldIndex, newIndex));
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {filteredIndexes.map((idx) => {
              const item = list[idx];
              const expanded = openMap[idx] !== false;
              return (
                <SortableFaq
                  key={ids[idx]}
                  id={ids[idx]}
                  item={item}
                  idx={idx}
                  disabled={disabled || Boolean(query.trim())}
                  expanded={expanded}
                  onToggle={() => setOpenMap((m) => ({ ...m, [idx]: !expanded }))}
                  onChange={(next) => updateAt(idx, next)}
                  onRemove={() => onChange(list.filter((_, i) => i !== idx))}
                  onDuplicate={() => {
                    const next = [...list];
                    next.splice(idx + 1, 0, { ...item });
                    onChange(next);
                  }}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {!list.length ? <p className="text-xs text-slate-500">No FAQs yet. Add or generate with AI.</p> : null}
      <p className="text-[11px] text-slate-500">FAQ schema is generated automatically from these Q&As.</p>
    </div>
  );
}
