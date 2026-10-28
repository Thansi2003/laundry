import { lazy, Suspense, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
import Footer from "./components/Footer"
import { getSavedUser } from "./lib/session"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Orders = lazy(() => import("./pages/Oders"))
const Customers = lazy(() => import("./pages/Customers"))
const Services = lazy(() => import("./pages/Services"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))

function RequireAuth({ children }) {
  return getSavedUser() ? children : <Navigate to="/login" replace />
}

function AppLayout() {
  const [searchTerm, setSearchTerm] = useState("")
  const { pathname } = useLocation()
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && (
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      )}
      <div className="flex min-w-0 flex-1">
        {!isAuthPage && <Sidebar />}
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route
              path="/orders"
              element={<RequireAuth><Orders searchTerm={searchTerm} /></RequireAuth>}
            />
            <Route
              path="/customers"
              element={<RequireAuth><Customers searchTerm={searchTerm} /></RequireAuth>}
            />
            <Route path="/services" element={<RequireAuth><Services /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App