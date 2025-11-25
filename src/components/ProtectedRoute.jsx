import React from "react";
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  // const { isAuthenticated } = useAuth();

  // TODO: 추후 로그인 기능 구현 후 아래 주석을 해제하고 원래 로직으로 복원해야 합니다.
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}
