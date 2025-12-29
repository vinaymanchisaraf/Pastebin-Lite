const express = require('express');
const router = express.Router();
const db = require('../database');
const { generateId } = require('../utils/idGenerator');
function getNow(testMode, testHeader) {
    if (testMode && testHeader) {
        return parseInt(testHeader);
    }
    return Date.now();
}

async function checkPasteAvailability(id, testMode = false, testNow = null) {
    const now = getNow(testMode, testNow);
    
    const paste = await db.query(
        'SELECT * FROM pastes WHERE id = ? AND is_active = 1',
        [id]
    );

    if (paste.length === 0) return null;

    const p = paste[0];
    
    if (p.expires_at && now > p.expires_at) {
        await db.run('UPDATE pastes SET is_active = 0 WHERE id = ?', [id]);
        return null;
    }
    
    
    if (p.max_views && p.view_count >= p.max_views) {
        await db.run('UPDATE pastes SET is_active = 0 WHERE id = ?', [id]);
        return null;
    }
    
    return p;
}
router.post('/pastes', async (req, res) => {
    try {
        const { content, ttl_seconds, max_views } = req.body;
    
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
        }
        
        if (ttl_seconds && (typeof ttl_seconds !== 'number' || ttl_seconds < 1 || !Number.isInteger(ttl_seconds))) {
            return res.status(400).json({ error: 'ttl_seconds must be an integer ≥ 1' });
        }
        
        if (max_views && (typeof max_views !== 'number' || max_views < 1 || !Number.isInteger(max_views))) {
            return res.status(400).json({ error: 'max_views must be an integer ≥ 1' });
        }
        
        const id = generateId();
        const now = Date.now();
        const expires_at = ttl_seconds ? now + (ttl_seconds * 1000) : null;
        await db.run(
            `INSERT INTO pastes (id, content, created_at, ttl_seconds, expires_at, max_views, view_count, is_active)
             VALUES (?, ?, ?, ?, ?, ?, 0, 1)`,
            [id, content, now, ttl_seconds, expires_at, max_views]
        );
    
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.status(201).json({
            id,
            url: `${baseUrl}/p/${id}`
        });
        
    } catch (error) {
        console.error('Error creating paste:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/pastes/:id', async (req, res) => {
    try {
        const testMode = process.env.TEST_MODE === '1';
        const testNow = req.headers['x-test-now-ms'];
        
        const paste = await checkPasteAvailability(req.params.id, testMode, testNow);
        
        if (!paste) {
            return res.status(404).json({ error: 'Paste not found or unavailable' });
        }
        await db.run(
            'UPDATE pastes SET view_count = view_count + 1 WHERE id = ?',
            [req.params.id]
        );
        const remaining_views = paste.max_views 
            ? Math.max(0, paste.max_views - (paste.view_count + 1))
            : null;
        
       
        const expires_at = paste.expires_at 
            ? new Date(paste.expires_at).toISOString()
            : null;
        
        res.status(200).json({
            content: paste.content,
            remaining_views,
            expires_at
        });
        
    } catch (error) {
        console.error('Error fetching paste:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/p/:id', async (req, res) => {
    try {
        const testMode = process.env.TEST_MODE === '1';
        const testNow = req.headers['x-test-now-ms'];
        
        const paste = await checkPasteAvailability(req.params.id, testMode, testNow);
        
        if (!paste) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Paste Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #d32f2f; }
                    </style>
                </head>
                <body>
                    <h1 class="error">404 - Paste Not Found</h1>
                    <p>This paste may have expired or been deleted.</p>
                </body>
                </html>
            `);
        }
        
        await db.run(
            'UPDATE pastes SET view_count = view_count + 1 WHERE id = ?',
            [req.params.id]
        );
        
        const escapedContent = paste.content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Pastebin Lite - ${paste.id}</title>
                <style>
                    body { font-family: 'Courier New', monospace; max-width: 800px; margin: 0 auto; padding: 20px; }
                    .content { background: #f5f5f5; padding: 20px; border-radius: 5px; white-space: pre-wrap; }
                    .meta { color: #666; font-size: 0.9em; margin-top: 20px; }
                </style>
            </head>
            <body>
                <h1>Paste #${paste.id}</h1>
                <div class="content">${escapedContent}</div>
                <div class="meta">
                    Created: ${new Date(paste.created_at).toLocaleString()}<br>
                    ${paste.expires_at ? `Expires: ${new Date(paste.expires_at).toLocaleString()}<br>` : ''}
                    ${paste.max_views ? `Views: ${paste.view_count + 1}/${paste.max_views}` : ''}
                </div>
            </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Error rendering paste:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;