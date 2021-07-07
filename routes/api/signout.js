async function AuthSignOutAPIController(req, res, next) {
    if (req.method === 'POST') {
        res.clearCookie('sessionId');
        res.redirect('/auth');
    }
}

module.exports = AuthSignOutAPIController;