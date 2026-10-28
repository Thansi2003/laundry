const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
	{
		customerName: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
			default: '',
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			default: '',
		},
		service: {
			type: String,
			required: true,
			trim: true,
		},
		receivedAt: {
			type: Date,
			required: true,
		},
		dueAt: {
			type: Date,
			required: true,
		},
		total: {
			type: Number,
			required: true,
			min: 0,
		},
		status: {
			type: String,
			enum: ['Pending', 'In Progress', 'Ready', 'Completed', 'Cancelled'],
			default: 'Pending',
		},
	},
	{ timestamps: true },
)

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)