const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRouter = require('./routes/health');
const pastesRouter = require('./routes/pastes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', healthRouter);
app.use('/api', pastesRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});