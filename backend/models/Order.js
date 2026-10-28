const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
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

orderSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema)