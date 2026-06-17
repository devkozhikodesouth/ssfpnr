'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }
  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <button
        type="button"
        className="flex-shrink-0 px-2 flex items-center text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing touch-none rounded bg-gray-800/60"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

/**
 * Generic vertical drag-to-reorder list built on @dnd-kit/sortable. The caller
 * owns the data; this component only deals in an ordered array of string ids and
 * calls onReorder(newIds) when a drag completes. Each row is rendered via
 * renderRow(id) and gets a drag handle automatically. Reused by the Homepage tab
 * (section reorder) and the Path Manage page (nav reorder).
 *
 * @param {string[]} ids
 * @param {(newIds: string[]) => void} onReorder
 * @param {(id: string) => React.ReactNode} renderRow
 */
export default function SortableList({ ids, onReorder, renderRow }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(ids, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {ids.map((id) => (
            <SortableRow key={id} id={id}>
              {renderRow(id)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
