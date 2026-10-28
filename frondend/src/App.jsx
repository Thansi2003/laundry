import { lazy, Suspense, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
import Footer from "./components/Footer"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Orders = lazy(() => import("./pages/Oders"))
const Customers = lazy(() => import("./pages/Customers"))
const Services = lazy(() => import("./pages/Services"))

function AppLayout() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className="flex min-w-0 flex-1">
        <Sidebar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/orders"
              element={<Orders searchTerm={searchTerm} />}
            />
            <Route
              path="/customers"
              element={<Customers searchTerm={searchTerm} />}
            />
            <Route path="/services" element={<Services searchTerm={searchTerm} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
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