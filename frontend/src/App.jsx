import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Boards from './pages/Boards';
import BoardView from './pages/BoardView';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/boards"
            element={
              <PrivateRoute>
                <Boards />
              </PrivateRoute>
            }
          />
          <Route
            path="/boards/:boardId"
            element={
              <PrivateRoute>
                <BoardView />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/boards" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
