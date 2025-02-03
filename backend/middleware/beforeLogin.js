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
            req.userEmail = decoded.email;

            if (req.userRole == "user") {
                return res.redirect("/");
            } else if (req.userRole == "tu") {
                return res.redirect("/tu/dashboard");
            } else if (req.userRole == "admin") {
                return res.redirect("/admin/dashboard");
            }
        });
    } else {
        next(); // Jika tidak ada token, lanjutkan ke middleware berikutnya
    }
}

module.exports = beforeLogin;
