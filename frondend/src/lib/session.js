const userStorageKey = 'laundry.user'

export function getSavedUser() {
	const serializedUser = window.localStorage.getItem(userStorageKey)
	if (!serializedUser) return null

	try {
		const user = JSON.parse(serializedUser)
		if (
			typeof user?.id === 'string' &&
			typeof user.name === 'string' &&
			typeof user.email === 'string'
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

export function saveUser(user) {
	if (
		typeof user?.id !== 'string' ||
		typeof user.name !== 'string' ||
		typeof user.email !== 'string'
	) {
		throw new Error('The sign-in response did not include valid profile details.')
	}

	window.localStorage.setItem(userStorageKey, JSON.stringify(user))
}

export function clearSavedUser() {
	window.localStorage.removeItem(userStorageKey)
}
