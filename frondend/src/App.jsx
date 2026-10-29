import { lazy, Suspense, useEffect, useState } from "react"
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Loading from "./components/Loading"
import Footer from "./components/Footer"
import AuthPage from "./pages/AuthPage"
import api from "./lib/api"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Orders = lazy(() => import("./pages/Oders"))
const Customers = lazy(() => import("./pages/Customers"))
const Services = lazy(() => import("./pages/Services"))

function AppLayout({ user }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [logoutError, setLogoutError] = useState("")
  const navigate = useNavigate()

  async function handleSignOut() {
    setLogoutError("")
    try {
      await api.post("/api/auth/logout")
      navigate("/login", { replace: true })
    } catch (error) {
      setLogoutError(
        error.response?.data?.message ?? "Could not sign out. Please try again.",
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuClick={() => setIsSidebarOpen(true)}
        isMenuOpen={isSidebarOpen}
        userName={user.name}
        onSignOut={handleSignOut}
      />
      {logoutError && (
        <p className="bg-rose-50 px-4 py-2 text-center text-sm text-rose-800" role="alert">
          {logoutError}
        </p>
      )}
      <div className="flex min-w-0 flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <Suspense fallback={<Loading />}>
          <Routes>
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

function AuthenticatedApp() {
  const [status, setStatus] = useState("loading")
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true

    api.get("/api/auth/me")
      .then(({ data }) => {
        if (!active) return
        setUser(data.user)
        setStatus("authenticated")
      })
      .catch((requestError) => {
        if (!active) return
        if (requestError.response?.status === 401) {
          setStatus("unauthenticated")
          return
        }
        setError(
          requestError.response?.data?.message ??
            "Could not verify your sign-in. Check the server connection and try again.",
        )
        setStatus("error")
      })

    return () => {
      active = false
    }
  }, [retry])

  if (status === "loading") return <Loading />
  if (status === "unauthenticated") return <Navigate to="/login" replace />
  if (status === "error") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 text-center">
          <p className="text-sm text-rose-800" role="alert">{error}</p>
          <button
            className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            type="button"
            onClick={() => {
              setStatus("loading")
              setRetry((value) => value + 1)
            }}
          >
            Try again
          </button>
          <Link className="ml-4 text-sm font-semibold text-teal-700" to="/login">
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  return <AppLayout user={user} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App