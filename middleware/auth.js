
function requireRole(role) {
    return (req, res, next) => {
        if (req.session.user && req.session.user.rol === role) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

function requireAnyRole(roles) {
    return (req, res, next) => {
        if (req.session.user && roles.includes(req.session.user.rol)) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}



module.exports = { requireAnyRole, requireRole };