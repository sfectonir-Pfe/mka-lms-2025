import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentRole } from './token';

/**
 * Use:
 * <ProtectedRoute><Dashboard /></ProtectedRoute>
 */
export function ProtectedRoute({ children }) {
  const loc = useLocation();
  if (!isAuthenticated()) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

/**
 * Use:
 * <RoleProtectedRoute roles={['CreateurDeFormation','Admin']}>
 *   <CourseList />
 * </RoleProtectedRoute>
 */
export function RoleProtectedRoute({ roles = [], children }) {
  const loc = useLocation();

  if (!isAuthenticated()) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  const role = (getCurrentRole() || '').toString().toLowerCase();
  const allow = roles.map((r) => r.toLowerCase()).includes(role);

  if (!allow) {
    return <Navigate to="/403" replace />;
  }
  return children;
}
