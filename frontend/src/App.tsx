import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { NotificationProvider } from './context/NotificationContext.js';

// Common Components
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { ProtectedRoute } from './components/common/ProtectedRoute.js';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.js';
import { LoginPage } from './pages/public/LoginPage.js';
import { RegisterPage } from './pages/public/RegisterPage.js';
import { UnauthorizedPage } from './pages/public/UnauthorizedPage.js';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard.js';
import { MenuPage } from './pages/student/MenuPage.js';
import { CartPage } from './pages/student/CartPage.js';
import { CheckoutPage } from './pages/student/CheckoutPage.js';
import { OrderSuccessPage } from './pages/student/OrderSuccessPage.js';
import { OrderTrackingPage } from './pages/student/OrderTrackingPage.js';
import { OrderHistoryPage } from './pages/student/OrderHistoryPage.js';

// Kitchen Pages
import { KitchenDashboardPage } from './pages/kitchen/KitchenDashboardPage.js';
import { KitchenPrepAdvicePage } from './pages/kitchen/KitchenPrepAdvicePage.js';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { FoodManagementPage } from './pages/admin/FoodManagementPage.js';
import { UserManagementPage } from './pages/admin/UserManagementPage.js';
import { OrderMonitoringPage } from './pages/admin/OrderMonitoringPage.js';
import { SalesAnalyticsPage } from './pages/admin/SalesAnalyticsPage.js';
import { DemandForecastPage } from './pages/admin/DemandForecastPage.js';
import { ReportsPage } from './pages/admin/ReportsPage.js';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <NotificationProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-brand-500 selection:text-white">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Student Protected Routes */}
                    <Route
                      path="/student/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                          <StudentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/menu"
                      element={<MenuPage />}
                    />
                    <Route
                      path="/student/cart"
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                          <CartPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/checkout"
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/order-success/:id"
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                          <OrderSuccessPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/track/:id"
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT', 'KITCHEN_STAFF', 'ADMIN']}>
                          <OrderTrackingPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/orders"
                      element={
                        <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                          <OrderHistoryPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Kitchen Protected Routes */}
                    <Route
                      path="/kitchen/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['KITCHEN_STAFF', 'ADMIN']}>
                          <KitchenDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/kitchen/prep-advice"
                      element={
                        <ProtectedRoute allowedRoles={['KITCHEN_STAFF', 'ADMIN']}>
                          <KitchenPrepAdvicePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Protected Routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/foods"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <FoodManagementPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <UserManagementPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <OrderMonitoringPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/analytics"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <SalesAnalyticsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/forecast"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <DemandForecastPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                          <ReportsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </NotificationProvider>
        </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
};
