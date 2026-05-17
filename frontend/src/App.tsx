import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import ProtectedRouteWrapper from "./router/ProtectedRouteWrapper";

import { Spinner } from "./components/Spinner";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })),
);
const LeadDetail = lazy(() =>
  import("./pages/LeadDetail").then((module) => ({
    default: module.LeadDetail,
  })),
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Register = lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register })),
);

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Suspense fallback={<Spinner />}>
            <Navbar/>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRouteWrapper>
                  <Dashboard />
                </ProtectedRouteWrapper>
              }
            />
            <Route
              path="/leads/:id"
              element={
                <ProtectedRouteWrapper>
                  <LeadDetail />
                </ProtectedRouteWrapper>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
