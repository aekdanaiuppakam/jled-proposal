import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load pages for code splitting
const PresentationPage = lazy(() => import('./pages/PresentationPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProjectEditorPage = lazy(() => import('./pages/ProjectEditorPage'));
const CreateProjectPage = lazy(() => import('./pages/CreateProjectPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#334155] border-t-[var(--accent-color)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#94A3B8] text-sm">กำลังโหลด...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Client Presentation (Public) */}
        <Route path="/p/:slug" element={<PresentationPage />} />

        {/* Admin Login Gate */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Dashboard & Management */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="create" element={<CreateProjectPage />} />
          <Route path="edit/:id" element={<ProjectEditorPage />} />
        </Route>

        {/* Default redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}
