import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import TaskCard from '../components/TaskCard';

const LANES = [
  { status: 'TODO', label: 'To Do' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
];

export default function BoardView() {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/${boardId}`);
      setTasks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post('/tasks', { title, boardId });
      setTasks((prev) => [...prev, res.data.data]);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  // Single source of truth: one tasks array, three lanes derived from it
  // with .filter(). No separate state per column.
  const handleMove = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.data : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to move task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/boards" className="text-sm text-gray-400 hover:text-gray-200">
        ← Back to boards
      </Link>

      <form onSubmit={handleCreate} className="flex gap-2 my-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          Add task
        </button>
      </form>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading tasks…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {LANES.map((lane) => {
            const laneTasks = tasks.filter((t) => t.status === lane.status);
            return (
              <div key={lane.status} className="bg-gray-950 border border-gray-900 rounded-xl p-3">
                <h2 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  {lane.label}
                  <span className="text-xs text-gray-600">{laneTasks.length}</span>
                </h2>
                <div className="space-y-2">
                  {laneTasks.length === 0 ? (
                    <p className="text-xs text-gray-600">No tasks</p>
                  ) : (
                    laneTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onMove={handleMove}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
