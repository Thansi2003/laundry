require('dotenv').config({ path: require('node:path').join(__dirname, '.env') })

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Order = require('./models/Order')
const Customer = require('./models/Customer')
const User = require('./models/User')

const app = express()
const port = Number(process.env.PORT) || 5000
const mongoUri =
	process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET
const hasJwtSecret = typeof jwtSecret === 'string' && jwtSecret.length >= 32
const allowedOrigins = new Set(
	[
		'http://localhost:5173',
		'http://localhost:4173',
		'https://laundry-6qy7.vercel.app',
		'https://laundry-w1g7.vercel.app',
		...(process.env.FRONTEND_URL || '').split(','),
	]
		.map((origin) => origin.trim().replace(/\/+$/, ''))
		.filter(Boolean),
)

app.use(
	cors({
		origin(origin, callback) {
			callback(null, !origin || allowedOrigins.has(origin))
		},
	}),
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (request, response) => {
	response.json({
		status: 'ok',
		database: mongoose.connection.readyState === 1,
		authenticationConfigured: hasJwtSecret,
	})
})

function createAccessToken(user) {
	return jwt.sign({ sub: user.id }, jwtSecret, { expiresIn: '7d' })
}

function authenticate(request, response, next) {
	if (!hasJwtSecret) {
		return response.status(503).json({
			message: 'Authentication is not configured. Set JWT_SECRET on the backend.',
		})
	}

	const authorization = request.get('authorization') || ''
	const [scheme, token] = authorization.split(' ')

	if (scheme !== 'Bearer' || !token) {
		return response.status(401).json({ message: 'Please sign in to continue.' })
	}

	try {
		const payload = jwt.verify(token, jwtSecret)
		if (!payload || typeof payload === 'string' || typeof payload.sub !== 'string') {
			return response.status(401).json({ message: 'Your session is invalid. Please sign in again.' })
		}

		request.userId = payload.sub
		return next()
	} catch {
		return response.status(401).json({ message: 'Your session has expired. Please sign in again.' })
	}
}

function normalizeUsername(value) {
	return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

async function assignLegacyUsername(user, email) {
	if (user.username) return user

	const emailBase = email
		.split('@')[0]
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '')
		.slice(0, 24)
	const base = emailBase.length >= 3 ? emailBase : 'user'

	for (let suffix = 0; suffix < 1000; suffix += 1) {
		const username =
			suffix === 0 ? base : `${base.slice(0, 30 - String(suffix).length - 1)}${suffix}`

		try {
			return await User.findByIdAndUpdate(
				user.id,
				{ $set: { username } },
				{ new: true, runValidators: true },
			)
		} catch (error) {
			if (error.name !== 'MongoServerError' || error.code !== 11000) throw error
		}
	}

	throw new Error('Could not assign a unique username to this account.')
}

app.post('/api/auth/register', async (request, response, next) => {
	try {
		if (!hasJwtSecret) {
			return response.status(503).json({
				message: 'Authentication is not configured. Set JWT_SECRET on the backend.',
			})
		}

		const { name, email, password } = request.body
		const username = normalizeUsername(request.body.username)
		const normalizedEmail =
			typeof email === 'string' ? email.trim().toLowerCase() : ''

		if (
			typeof name !== 'string' ||
			!name.trim() ||
			name.trim().length > 100 ||
			!/^[a-z0-9_]{3,30}$/.test(username) ||
			!normalizedEmail ||
			normalizedEmail.length > 254 ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
			typeof password !== 'string' ||
			password.length < 8 ||
			password.length > 72
		) {
			return response.status(400).json({
				message: 				'Enter a valid name, username, email, and a password between 8 and 72 characters.',
			})
		}

		const passwordHash = await bcrypt.hash(password, 12)
		const user = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			username,
			passwordHash,
		})

		return response.status(201).json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				username: user.username,
			},
			message: 'Account created. You can now sign in.',
		})
	} catch (error) {
		if (error.name === 'MongoServerError' && error.code === 11000) {
			if (error.keyPattern?.username) {
				return response.status(409).json({
					message: 'That username is already taken. Choose another one.',
				})
			}
			if (error.keyPattern?.email) {
				return response.status(409).json({
					message: 'An account with this email already exists.',
				})
			}
		}
		return next(error)
	}
})

app.post('/api/auth/login', async (request, response, next) => {
	try {
		if (!hasJwtSecret) {
			return response.status(503).json({
				message: 'Authentication is not configured. Set JWT_SECRET on the backend.',
			})
		}

		const { email, password } = request.body
		const normalizedEmail =
			typeof email === 'string' ? email.trim().toLowerCase() : ''

		if (!normalizedEmail || typeof password !== 'string') {
			return response.status(400).json({ message: 'Enter your username or email and password.' })
		}

		const user = await User.findOne({
			$or: [{ email: normalizedEmail }, { username: normalizeUsername(email) }],
		}).select('+passwordHash')
		const passwordMatches =
			user && (await bcrypt.compare(password, user.passwordHash))

		if (!passwordMatches) {
			return response.status(401).json({ message: 'Email or password is incorrect.' })
		}

		const userWithUsername = await assignLegacyUsername(user, user.email)

		return response.json({
			token: createAccessToken(userWithUsername),
			user: {
				id: userWithUsername.id,
				name: userWithUsername.name,
				email: userWithUsername.email,
				username: userWithUsername.username,
			},
			message: 'Sign-in successful.',
		})
	} catch (error) {
		return next(error)
	}
})

app.use('/api/orders', authenticate)
app.get('/api/orders', async (request, response, next) => {
	try {
		const orders = await Order.find({ userId: request.userId }).sort({ createdAt: -1 }).lean()
		response.json(orders)
	} catch (error) {
		next(error)
	}
})

app.post('/api/orders', async (request, response, next) => {
	try {
		const { customerName, phone = '', email = '', service, receivedAt, dueAt, total } =
			request.body
		const parsedReceivedAt = new Date(receivedAt)
		const parsedDueAt = new Date(dueAt)
		const parsedTotal = Number(total)

		if (
			typeof customerName !== 'string' ||
			!customerName.trim() ||
			typeof service !== 'string' ||
			!service.trim() ||
			!receivedAt ||
			!dueAt ||
			Number.isNaN(parsedReceivedAt.getTime()) ||
			Number.isNaN(parsedDueAt.getTime()) ||
			parsedDueAt < parsedReceivedAt ||
			!Number.isFinite(parsedTotal) ||
			parsedTotal < 0
		) {
			return response.status(400).json({ message: 'Please provide valid order details.' })
		}

		const customerDetails = {
			name: customerName.trim(),
			phone: typeof phone === 'string' ? phone.trim() : '',
			email: typeof email === 'string' ? email.trim().toLowerCase() : '',
		}
		const customerFilter = customerDetails.phone
			? { userId: request.userId, phone: customerDetails.phone }
			: customerDetails.email
				? { userId: request.userId, email: customerDetails.email }
				: null

		if (customerFilter) {
			await Customer.findOneAndUpdate(
				customerFilter,
				{
					$set: customerDetails,
					$setOnInsert: { userId: request.userId },
				},
				{
					returnDocument: 'after',
					upsert: true,
					runValidators: true,
					setDefaultsOnInsert: true,
				},
			)
		} else {
			await Customer.create({ ...customerDetails, userId: request.userId })
		}

		const order = await Order.create({
			userId: request.userId,
			customerName: customerDetails.name,
			phone: customerDetails.phone,
			email: customerDetails.email,
			service: service.trim(),
			receivedAt: parsedReceivedAt,
			dueAt: parsedDueAt,
			total: parsedTotal,
		})

		return response.status(201).json(order)
	} catch (error) {
		return next(error)
	}
})

app.use('/api/customers', authenticate)
app.get('/api/customers', async (request, response, next) => {
	try {
		const customers = await Customer.find({ userId: request.userId })
			.sort({ createdAt: -1 })
			.lean()
		response.json(customers)
	} catch (error) {
		next(error)
	}
})

app.use((error, request, response, next) => {
	console.error('API request failed:', error)
	if (response.headersSent) return next(error)

	if (error.name === 'ValidationError') {
		return response.status(400).json({ message: error.message })
	}

	if (error.name === 'MongoServerError' && error.code === 11000) {
		if (error.keyPattern?.email) {
			return response.status(409).json({
				message: 'An account with this email already exists.',
			})
		}

		if (error.keyPattern?.username) {
			return response.status(409).json({
				message: 'That username is already taken. Choose another one.',
			})
		}

		return response.status(409).json({ message: 'A record with these details already exists.' })
	}

	return response.status(500).json({ message: 'The request could not be completed.' })
})

async function startServer() {
	try {
		if (typeof mongoUri !== 'string' || !mongoUri.trim()) {
			throw new Error('MONGODB_URI is not configured.')
		}
		await mongoose.connect(mongoUri)
		app.listen(port, () => {
			console.log(`Laundry API listening on http://localhost:${port}`)
			console.log(`Connected to MongoDB database "${mongoose.connection.name}"`)
		})
	} catch (error) {
		console.error('Unable to connect to MongoDB:', error.message)
		process.exitCode = 1
	}
}

startServer()