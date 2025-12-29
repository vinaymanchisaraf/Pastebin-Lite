const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/healthz', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({ ok: true });
    } catch (error) {
        res.status(503).json({ ok: false, error: 'Database unavailable' });
    }
});

module.exports = router;