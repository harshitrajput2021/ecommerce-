import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function AuthGuard({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children ?? <Outlet />}
    </>
  );
}

export default AuthGuard;
