const userStorageKey = 'laundry.user'
const tokenStorageKey = 'laundry.token'

export function getSavedUser() {
	const serializedUser = window.localStorage.getItem(userStorageKey)
	if (!serializedUser) return null

	try {
		const user = JSON.parse(serializedUser)
		if (
			typeof user?.id === 'string' &&
			typeof user.name === 'string' &&
			typeof user.email === 'string' &&
			typeof user.username === 'string'
		) {
			return user
		}

		window.localStorage.removeItem(userStorageKey)
		return null
	} catch (error) {
		console.error('Unable to read saved profile details:', error)
		window.localStorage.removeItem(userStorageKey)
		return null
	}
}

export function getSavedToken() {
	return window.localStorage.getItem(tokenStorageKey)
}

export function saveSession(user, token) {
	if (
		typeof user?.id !== 'string' ||
		typeof user.name !== 'string' ||
		typeof user.email !== 'string' ||
		typeof user.username !== 'string' ||
		typeof token !== 'string' ||
		!token
	) {
		throw new Error('The sign-in response did not include a valid profile and access token.')
	}

	window.localStorage.setItem(userStorageKey, JSON.stringify(user))
	window.localStorage.setItem(tokenStorageKey, token)
}

export function clearSavedUser() {
	window.localStorage.removeItem(userStorageKey)
	window.localStorage.removeItem(tokenStorageKey)
}
