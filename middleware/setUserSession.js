const sequelize = require("../database");


module.exports = async function setUserSession(req, res, next) {
    try {
        if (req.session.user && req.session.user.id) {
            const userId = req.session.user.id;

            await sequelize.query(`
                EXEC sp_set_session_context 
                    @key = 'usuario_app', 
                    @value = ${userId};
            `);
        }

        next();
    } catch (err) {
        console.error("Error setting SQL session user:", err);
        next();
    }
};
