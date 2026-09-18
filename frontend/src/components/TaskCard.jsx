const STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TaskCard({ task, onMove, onDelete }) {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const prevStatus = STATUS_ORDER[currentIndex - 1];
  const nextStatus = STATUS_ORDER[currentIndex + 1];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2">
      <p className="text-sm font-medium">{task.title}</p>
      {task.description && (
        <p className="text-xs text-gray-500">{task.description}</p>
      )}
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-1">
          {prevStatus && (
            <button
              onClick={() => onMove(task._id, prevStatus)}
              className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 rounded px-2 py-0.5"
            >
              ← {prevStatus.replace('_', ' ')}
            </button>
          )}
          {nextStatus && (
            <button
              onClick={() => onMove(task._id, nextStatus)}
              className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 rounded px-2 py-0.5"
            >
              {nextStatus.replace('_', ' ')} →
            </button>
          )}
        </div>
        <button
          onClick={() => onDelete(task._id)}
          className="text-xs text-red-500/70 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
