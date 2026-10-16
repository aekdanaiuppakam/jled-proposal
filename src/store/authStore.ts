import { useSyncExternalStore } from 'react';

const PASSCODE_STORAGE_KEY = 'jled_admin_passcode';
const AUTH_TOKEN_KEY = 'jled_admin_authenticated';
const DEFAULT_PASSCODE = 'jled2026';

// Event listeners for reactive state updates
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPasscode(): string {
  return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_PASSCODE;
}

export function isAuthenticated(): boolean {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) === 'true' ||
    sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true'
  );
}

export function login(
  passcode: string,
  rememberMe: boolean = true
): { success: boolean; error?: string } {
  const currentPass = getPasscode();
  if (passcode.trim() === currentPass) {
    if (rememberMe) {
      localStorage.setItem(AUTH_TOKEN_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
    }
    notify();
    return { success: true };
  }
  return { success: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' };
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  notify();
}

export function changePasscode(
  currentPass: string,
  newPass: string
): { success: boolean; error?: string } {
  if (currentPass !== getPasscode()) {
    return { success: false, error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' };
  }
  if (!newPass || newPass.trim().length < 4) {
    return { success: false, error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' };
  }
  localStorage.setItem(PASSCODE_STORAGE_KEY, newPass.trim());
  notify();
  return { success: true };
}

export function resetPasscode(): void {
  localStorage.removeItem(PASSCODE_STORAGE_KEY);
  notify();
}

// React Hook
export function useAuth() {
  const isAuth = useSyncExternalStore(subscribeAuth, isAuthenticated);

  return {
    isAuthenticated: isAuth,
    login,
    logout,
    changePasscode,
    getPasscode,
  };
}
