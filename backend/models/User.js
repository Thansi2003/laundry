const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
			maxlength: 254,
		},
		username: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 30,
		},
		passwordHash: {
			type: String,
			required: true,
			select: false,
		},
	},
	{ timestamps: true },
)

userSchema.index(
	{ username: 1 },
	{
		unique: true,
		partialFilterExpression: { username: { $type: 'string' } },
	},
)

module.exports = mongoose.models.User || mongoose.model('User', userSchema)