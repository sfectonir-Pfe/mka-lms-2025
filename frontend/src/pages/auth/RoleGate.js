import React from 'react';
import { getCurrentRole } from './token';

/**
 * Conditionally render children based on role.
 * 
 * Props:
 * - roles: array of allowed roles (case-insensitive)
 * - fallback: node to render when not allowed (default: null)
 * 
 * Example:
 * <RoleGate roles={['CreateurDeFormation','Admin']}>
 *   <Button onClick={...}>Delete</Button>
 * </RoleGate>
 */
export default function RoleGate({ roles = [], fallback = null, children }) {
  const current = (getCurrentRole() || '').toString().toLowerCase();
  const allowed = roles.map((r) => r.toLowerCase()).includes(current);
  return allowed ? children : fallback;
}
