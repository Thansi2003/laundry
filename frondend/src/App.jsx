import { lazy, Suspense, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
import Footer from "./components/Footer"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Orders = lazy(() => import("./pages/Oders"))
const Customers = lazy(() => import("./pages/Customers"))
const Services = lazy(() => import("./pages/Services"))
const Login = lazy(() => import("./pages/Login"))
const Register = lazy(() => import("./pages/Register"))

function AppLayout() {
  const [searchTerm, setSearchTerm] = useState("")
  const { pathname } = useLocation()
  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && (
        <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      )}
      <div className="flex flex-1">
        {!isAuthPage && <Sidebar />}
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/orders"
              element={<Orders searchTerm={searchTerm} />}
            />
            <Route
              path="/customers"
              element={<Customers searchTerm={searchTerm} />}
            />
            <Route path="/services" element={<Services />} />
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