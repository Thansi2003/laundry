const crypto = require('node:crypto')
const { promisify } = require('node:util')
const express = require('express')
const User = require('../models/User')

const router = express.Router()
const scrypt = promisify(crypto.scrypt)

function publicUser(user) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
	}
}

async function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('hex')
	const derivedKey = await scrypt(password, salt, 64)
	return `${salt}:${derivedKey.toString('hex')}`
}

async function passwordMatches(password, storedHash) {
	const [salt, hash] = storedHash.split(':')
	if (!/^[\da-f]{32}$/i.test(salt) || !/^[\da-f]{128}$/i.test(hash)) {
		return false
	}

	const expected = Buffer.from(hash, 'hex')
	const actual = await scrypt(password, salt, expected.length)
	return crypto.timingSafeEqual(expected, actual)
}

function createSession(request, userId) {
	return new Promise((resolve, reject) => {
		request.session.regenerate((error) => {
			if (error) {
				reject(error)
				return
			}

			request.session.userId = userId
			request.session.save((saveError) => {
				if (saveError) reject(saveError)
				else resolve()
			})
		})
	})
}

router.post('/register', async (request, response, next) => {
	try {
		const { name, email, password } = request.body ?? {}
		const normalizedEmail =
			typeof email === 'string' ? email.trim().toLowerCase() : ''

		if (
			typeof name !== 'string' ||
			!name.trim() ||
			name.trim().length > 100 ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
			normalizedEmail.length > 254 ||
			typeof password !== 'string' ||
			password.length < 8 ||
			password.length > 128
		) {
			return response.status(400).json({
				message: 'Provide a name, valid email, and password between 8 and 128 characters.',
			})
		}

		const existingUser = await User.exists({ email: normalizedEmail })
		if (existingUser) {
			return response.status(409).json({ message: 'An account with this email already exists.' })
		}

		const user = await User.create({
			name: name.trim(),
			email: normalizedEmail,
			passwordHash: await hashPassword(password),
		})

		await createSession(request, user.id)
		return response.status(201).json({ user: publicUser(user) })
	} catch (error) {
		if (error.code === 11000) {
			return response.status(409).json({ message: 'An account with this email already exists.' })
		}
		return next(error)
	}
})

router.post('/login', async (request, response, next) => {
	try {
		const { email, password } = request.body ?? {}
		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			password.length > 128
		) {
			return response.status(400).json({ message: 'Enter a valid email and password.' })
		}

		const user = await User.findOne({ email: email.trim().toLowerCase() })
			.select('+passwordHash')
		if (!user || !(await passwordMatches(password, user.passwordHash))) {
			return response.status(401).json({ message: 'Email or password is incorrect.' })
		}

		await createSession(request, user.id)
		return response.json({ user: publicUser(user) })
	} catch (error) {
		return next(error)
	}
})

router.get('/me', async (request, response, next) => {
	try {
		if (!request.session.userId) {
			return response.status(401).json({ message: 'Please sign in to continue.' })
		}

		const user = await User.findById(request.session.userId)
		if (!user) {
			request.session.destroy((error) => {
				if (error) return next(error)
				return response.status(401).json({ message: 'Please sign in to continue.' })
			})
			return
		}

		return response.json({ user: publicUser(user) })
	} catch (error) {
		return next(error)
	}
})

router.post('/logout', (request, response, next) => {
	request.session.destroy((error) => {
		if (error) return next(error)
		response.clearCookie('laundry.sid')
		return response.json({ message: 'Signed out.' })
	})
})

module.exports = router
