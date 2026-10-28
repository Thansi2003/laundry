import { useState } from 'react'
import api from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shirt } from 'lucide-react'

function Register() {
	const navigate = useNavigate()
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})

	function handleChange(event) {
		const { name, value } = event.target
		setFormData((current) => ({ ...current, [name]: value }))
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')

		if (formData.password !== formData.confirmPassword) {
			setError('The passwords do not match.')
			return
		}

		setSubmitting(true)
		try {
			await api.post('/api/auth/register', {
				name: formData.name,
				email: formData.email,
				password: formData.password,
			})
			navigate('/login', {
				replace: true,
				state: { notice: 'Account created. You can now sign in.' },
			})
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ||
					'Could not create your account. Check the backend connection and try again.',
			)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<main className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
			<div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 lg:min-h-[620px] lg:grid-cols-2">
				<section className="flex flex-col justify-between bg-teal-800 p-8 text-white sm:p-12">
					<Link
						className="inline-flex w-fit items-center gap-3 text-white no-underline"
						to="/login"
						aria-label="Laundry sign in"
					>
						<span className="grid size-11 place-items-center rounded-xl bg-white/10">
							<Shirt size={23} aria-hidden="true" />
						</span>
						<span className="text-xl font-bold tracking-tight">
							laundry<span className="text-teal-200">.</span>
						</span>
					</Link>

					<div className="my-12 max-w-md">
						<h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
							Make laundry management a little easier.
						</h1>
						<p className="mt-4 leading-7 text-teal-100">
							Create an account to organize orders and keep your business moving.
						</p>
					</div>

					<p className="text-sm text-teal-100">Simple tools for a smoother laundry day.</p>
				</section>

				<section className="flex items-center justify-center p-8 sm:p-12">
					<div className="w-full max-w-sm">
						<p className="text-sm font-semibold text-teal-700">Get started</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
							Create account
						</h2>
						<p className="mt-2 text-sm text-slate-500">
							Enter your details to set up your account.
						</p>

						<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
							<label className="block text-sm font-medium text-slate-700">
								Full name
								<input
									className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									autoComplete="name"
									maxLength={100}
									required
								/>
							</label>

							<label className="block text-sm font-medium text-slate-700">
								Email address
								<input
									className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									autoComplete="email"
									maxLength={254}
									placeholder="you@example.com"
									required
								/>
							</label>

							<label className="block text-sm font-medium text-slate-700">
								Password
								<span className="relative mt-2 block">
									<input
										className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
										type={passwordVisible ? 'text' : 'password'}
										name="password"
										value={formData.password}
										onChange={handleChange}
										autoComplete="new-password"
										minLength={8}
										maxLength={72}
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
								<span className="mt-1 block text-xs font-normal text-slate-500">
									Use 8 to 72 characters.
								</span>
							</label>

							<label className="block text-sm font-medium text-slate-700">
								Confirm password
								<input
									className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
									type={passwordVisible ? 'text' : 'password'}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									autoComplete="new-password"
									minLength={8}
									maxLength={72}
									required
								/>
							</label>

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
								{submitting ? 'Creating account…' : 'Create account'}
							</button>
						</form>

						<p className="mt-6 text-center text-sm text-slate-600">
							Already have an account?{' '}
							<Link className="font-semibold text-teal-700 hover:text-teal-800" to="/login">
								Sign in
							</Link>
						</p>
					</div>
				</section>
			</div>
		</main>
	)
}

export default Register
