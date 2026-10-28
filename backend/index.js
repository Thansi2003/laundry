require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Order = require('./models/Order')
const Customer = require('./models/Customer')
const User = require('./models/User')

const app = express()
const port = Number(process.env.PORT) || 5000
const mongoUri =
	process.env.MONGODB_URI
const allowedOrigins = (
	process.env.FRONTEND_URL ||
	'http://localhost:5173,http://localhost:4173,https://laundry-h5zwmx0n6-thansi2003s-projects.vercel.app'
)
	.split(',')
	.map((origin) => origin.trim().replace(/\/+$/, ''))
	.filter(Boolean)

app.use(
	cors({
		origin(origin, callback) {
			callback(null, !origin || allowedOrigins.includes(origin))
		},
	}),
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (request, response) => {
	response.json({ status: 'ok', database: mongoose.connection.readyState === 1 })
})

app.post('/api/auth/register', async (request, response, next) => {
	try {
		const { name, email, password } = request.body
		const normalizedEmail =
			typeof email === 'string' ? email.trim().toLowerCase() : ''

		if (
			typeof name !== 'string' ||
			!name.trim() ||
			name.trim().length > 100 ||
			!normalizedEmail ||
			normalizedEmail.length > 254 ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
			typeof password !== 'string' ||
			password.length < 8 ||
			password.length > 72
		) {
			return response.status(400).json({
				message: 'Enter a valid name and email, and a password between 8 and 72 characters.',
			})
		}

		const passwordHash = await bcrypt.hash(password, 12)
		const user = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			passwordHash,
		})

		return response.status(201).json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			message: 'Account created. You can now sign in.',
		})
	} catch (error) {
		return next(error)
	}
})

app.post('/api/auth/login', async (request, response, next) => {
	try {
		const { email, password } = request.body
		const normalizedEmail =
			typeof email === 'string' ? email.trim().toLowerCase() : ''

		if (!normalizedEmail || typeof password !== 'string') {
			return response.status(400).json({ message: 'Enter your email and password.' })
		}

		const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash')
		const passwordMatches =
			user && (await bcrypt.compare(password, user.passwordHash))

		if (!passwordMatches) {
			return response.status(401).json({ message: 'Email or password is incorrect.' })
		}

		return response.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			message: 'Sign-in successful.',
		})
	} catch (error) {
		return next(error)
	}
})

app.get('/api/orders', async (request, response, next) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 }).lean()
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
			? { phone: customerDetails.phone }
			: customerDetails.email
				? { email: customerDetails.email }
				: null

		if (customerFilter) {
			await Customer.findOneAndUpdate(
				customerFilter,
				{ $set: customerDetails },
				{
					returnDocument: 'after',
					upsert: true,
					runValidators: true,
					setDefaultsOnInsert: true,
				},
			)
		} else {
			await Customer.create(customerDetails)
		}

		const order = await Order.create({
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

app.get('/api/customers', async (request, response, next) => {
	try {
		const customers = await Customer.find().sort({ createdAt: -1 }).lean()
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