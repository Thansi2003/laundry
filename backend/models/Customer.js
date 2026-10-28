const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		name: {
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
	},
	{ timestamps: true },
)

customerSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema)