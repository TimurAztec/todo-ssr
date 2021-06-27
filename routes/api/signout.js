async function AuthSignOutAPIController(req, res, next) {
    if (req.method === 'POST') {
        res.clearCookie('sessionId');
        res.send('Session ended!');
    }
}

module.exports = AuthSignOutAPIController;