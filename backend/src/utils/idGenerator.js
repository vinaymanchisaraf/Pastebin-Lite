const crypto = require('crypto');

function generateId() {
    return crypto.randomBytes(4).toString('hex');
}

module.exports = { generateId };