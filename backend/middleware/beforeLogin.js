const jwt = require('jsonwebtoken');

function beforeLogin(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, 'secretsecret', (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Token tidak valid atau telah kedaluwarsa.",
                });
            }
            req.userId = decoded.id;
            req.userRole = decoded.role;
            req.userNip = decoded.nip;

            if (req.userRole == "user") {
                return res.redirect("/");
            } else if (req.userRole == "ktu") {
                return res.redirect("/ktu/dashboard");
            } else if (req.userRole == "pimpinan") {
                return res.redirect("/pimpinan/dashboard");
            }
        });
    } else {
        next(); // Jika tidak ada token, lanjutkan ke middleware berikutnya
    }
}

module.exports = beforeLogin;
