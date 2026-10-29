function requireAuth(request, response, next) {
	if (!request.session?.userId) {
		return response.status(401).json({ message: 'Please sign in to continue.' })
	}

	return next()
}

module.exports = requireAuth
