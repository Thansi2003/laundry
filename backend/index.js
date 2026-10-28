require('dotenv').config({ path: require('node:path').join(__dirname, '.env') })

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Order = require('./models/Order')
const Customer = require('./models/Customer')

const app = express()
const port = Number(process.env.PORT) || 5000
const mongoUri =
	process.env.MONGODB_URI
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
	})
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