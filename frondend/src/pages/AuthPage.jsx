import { useState } from 'react'
import { ArrowRight, Shirt } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

function AuthPage({ mode }) {
	const isRegister = mode === 'register'
	const navigate = useNavigate()
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()

		if (isRegister && password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		const formData = new FormData(event.currentTarget)
		setIsSubmitting(true)
		setError('')

		try {
			await api.post(`/api/auth/${isRegister ? 'register' : 'login'}`, {
				name: formData.get('name'),
				email: formData.get('email'),
				password,
			})
			navigate('/dashboard', { replace: true })
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ??
					'Could not connect to the server. Please try again.',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
			<div className="w-full max-w-md">
				<Link
					className="mx-auto mb-7 flex w-fit items-center gap-3 text-slate-900 no-underline"
					to="/dashboard"
					aria-label="Laundry dashboard"
				>
					<span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
						<Shirt size={23} aria-hidden="true" />
					</span>
					<span className="text-2xl font-bold tracking-tight">
						laundry<span className="text-teal-600">.</span>
					</span>
				</Link>

				<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<div className="mb-7">
						<p className="text-sm font-medium text-teal-700">
							{isRegister ? 'Get started' : 'Welcome back'}
						</p>
						<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
							{isRegister ? 'Create your account' : 'Sign in to your account'}
						</h1>
						<p className="mt-2 text-sm leading-6 text-slate-500">
							{isRegister
								? 'Create an account to manage your laundry business.'
								: 'Sign in to manage your laundry business.'}
						</p>
					</div>

					<form className="space-y-5" onSubmit={handleSubmit}>
						{isRegister && (
							<div>
								<label
									className="mb-1.5 block text-sm font-medium text-slate-700"
									htmlFor="name"
								>
									Full name
								</label>
								<input
									className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
									id="name"
									name="name"
									autoComplete="name"
									placeholder="Your name"
									required
								/>
							</div>
						)}

						<div>
							<label
								className="mb-1.5 block text-sm font-medium text-slate-700"
								htmlFor="email"
							>
								Email address
							</label>
							<input
								className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								placeholder="you@example.com"
								required
							/>
						</div>

						<div>
							<label
								className="mb-1.5 block text-sm font-medium text-slate-700"
								htmlFor="password"
							>
								Password
							</label>
							<input
								className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
								id="password"
								name="password"
								type="password"
								autoComplete={isRegister ? 'new-password' : 'current-password'}
								placeholder="Enter your password"
								value={password}
								onChange={(event) => {
									setPassword(event.target.value)
									setError('')
								}}
								required
								minLength={8}
							/>
						</div>

						{isRegister && (
							<div>
								<label
									className="mb-1.5 block text-sm font-medium text-slate-700"
									htmlFor="confirm-password"
								>
									Confirm password
								</label>
								<input
									className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
									id="confirm-password"
									name="confirm-password"
									type="password"
									autoComplete="new-password"
									placeholder="Re-enter your password"
									value={confirmPassword}
									onChange={(event) => {
										setConfirmPassword(event.target.value)
										setError('')
									}}
									required
									minLength={8}
								/>
							</div>
						)}

						{error && (
							<p className="text-sm text-rose-700" role="alert">
								{error}
							</p>
						)}

						<button
							className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting
								? 'Please wait…'
								: isRegister
									? 'Create account'
									: 'Sign in'}
							{!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-slate-600">
						{isRegister ? 'Already have an account?' : 'New to laundry?'}{' '}
						<Link
							className="font-semibold text-teal-700 hover:text-teal-800"
							to={isRegister ? '/login' : '/register'}
						>
							{isRegister ? 'Sign in' : 'Create an account'}
						</Link>
					</p>
				</section>

				<p className="mt-5 text-center text-xs leading-5 text-slate-500">
					Passwords are securely hashed. Sign-in uses a server session cookie, not a JWT.
				</p>
			</div>
		</main>
	)
}

export default AuthPage
