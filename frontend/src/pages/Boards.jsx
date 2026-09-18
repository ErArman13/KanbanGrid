import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post('/boards', { title });
      setBoards((prev) => [res.data.data, ...prev]);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your boards</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-gray-200"
        >
          Log out
        </button>
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New board title"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          Create
        </button>
      </form>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading boards…</p>
      ) : boards.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No boards yet — create your first one above.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board._id}
              to={`/boards/${board._id}`}
              className="block bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg px-4 py-3 transition"
            >
              <p className="font-medium">{board.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                Created {new Date(board.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
