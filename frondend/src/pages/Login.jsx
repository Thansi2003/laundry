import { useState } from 'react'
import api from '../lib/api'
import { Eye, EyeOff, Shirt, Sparkles } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Login() {
	const navigate = useNavigate()
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const { state } = useLocation()
	const [notice, setNotice] = useState(state?.notice ?? '')
	const [credentials, setCredentials] = useState({ email: '', password: '' })

	function handleChange(event) {
		const { name, value } = event.target
		setCredentials((current) => ({ ...current, [name]: value }))
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setNotice('')
		setSubmitting(true)

		try {
			await api.post('/api/auth/login', credentials)
			navigate('/dashboard', { replace: true })
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ||
					'Could not sign in. Check that the backend is running and try again.',
			)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<main className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
			<div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:min-h-[620px] lg:grid-cols-2">
				<section className="flex flex-col justify-between bg-teal-800 p-8 text-white sm:p-12">
					<a className="inline-flex w-fit items-center gap-3 text-white no-underline" href="/login" aria-label="Laundry sign in">
						<span className="grid size-11 place-items-center rounded-xl bg-white/10">
							<Shirt size={23} aria-hidden="true" />
						</span>
						<span className="text-xl font-bold tracking-tight">
							laundry<span className="text-teal-200">.</span>
						</span>
					</a>

					<div className="my-12 max-w-md">
						<span className="mb-6 grid size-14 place-items-center rounded-2xl bg-white/10 text-teal-100">
							<Sparkles size={26} aria-hidden="true" />
						</span>
						<h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
							Your laundry business, all in one place.
						</h1>
						<p className="mt-4 leading-7 text-teal-100">
							Manage orders, keep customer details close, and stay on top of every service.
						</p>
					</div>

					<p className="text-sm text-teal-100">
						Simple tools for a smoother laundry day.
					</p>
				</section>

				<section className="flex items-center justify-center p-8 sm:p-12">
					<div className="w-full max-w-sm">
						<p className="text-sm font-semibold text-teal-700">Welcome back</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
							Sign in
						</h2>
						<p className="mt-2 text-sm text-slate-500">
							Enter your account details to continue.
						</p>

						<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
							<label className="block text-sm font-medium text-slate-700">
								Email address
								<input
									className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
									type="email"
									name="email"
									value={credentials.email}
									onChange={handleChange}
									autoComplete="username"
									placeholder="you@example.com"
									required
								/>
							</label>

							<label className="block text-sm font-medium text-slate-700">
								Password
								<span className="relative mt-2 block">
									<input
										className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
										type={passwordVisible ? 'text' : 'password'}
										name="password"
										value={credentials.password}
										onChange={handleChange}
										autoComplete="current-password"
										placeholder="Enter your password"
										required
									/>
									<button
										className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 hover:text-slate-700"
										type="button"
										onClick={() => setPasswordVisible((visible) => !visible)}
										aria-label={passwordVisible ? 'Hide password' : 'Show password'}
									>
										{passwordVisible ? (
											<EyeOff size={18} aria-hidden="true" />
										) : (
											<Eye size={18} aria-hidden="true" />
										)}
									</button>
								</span>
							</label>

							<div className="flex items-center justify-between gap-3">
								<label className="flex items-center gap-2 text-sm text-slate-600">
									<input
										className="size-4 rounded border-slate-300 accent-teal-700"
										type="checkbox"
										name="remember"
									/>
									Remember me
								</label>
								<span className="text-sm text-slate-400">Forgot password?</span>
							</div>

							{notice && (
								<p
									className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800"
									role="status"
								>
									{notice}
								</p>
							)}
							{error && (
								<p
									className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800"
									role="alert"
								>
									{error}
								</p>
							)}

							<button
								className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
								type="submit"
								disabled={submitting}
							>
								{submitting ? 'Signing in…' : 'Sign in'}
							</button>
						</form>
						<p className="mt-6 text-center text-sm text-slate-600">
							Don’t have an account?{' '}
							<Link className="font-semibold text-teal-700 hover:text-teal-800" to="/register">
								Create account
							</Link>
						</p>
					</div>
				</section>
			</div>
		</main>
	)
}

export default Login