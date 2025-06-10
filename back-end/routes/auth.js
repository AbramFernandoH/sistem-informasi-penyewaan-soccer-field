const express = require('express');
const passport = require('passport');
const router = express.Router();

router.route('/login')
    .post(passport.authenticate('user-local'), async (req, res) => {
        try {
            req.login(req.user, () => res.json({
                code: 200,
                success: true,
                message: 'OK',
                data: req.user,
            }));
        } catch {
            res.json({
                code: 500,
                success: false,
                message: 'Failed to login',
                data: null,
            });
        }
    });

router.get('/logout', async (req, res) => {
    try {
        req.logout({}, () => res.json({
            code: 200,
            success: true,
            message: 'OK',
            data: null,
        }));
    } catch {
        res.json({
            code: 500,
            success: false,
            message: 'Failed to logout',
            data: null,
        });
    }
});

module.exports = router;
