import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const API_KEY = process.env.CURRENCY_API_KEY;
const BASE_URL = 'https://api.freecurrencyapi.com/v1';

// GET /api/currencies - List all supported currencies
router.get('/', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get(`${BASE_URL}/currencies`, {
            params: { apikey: API_KEY },
        });
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch currencies', details: error.message });
    }
});

// POST /api/currencies - Convert currency
router.post('/convert', async (req: Request, res: Response) => {
    const { from, to, amount } = req.body;
    if (!from || !to || typeof amount !== 'number') {
        return res.status(400).json({ error: 'from, to, and amount are required' });
    }
    try {
        const response = await axios.get(`${BASE_URL}/latest`, {
            params: {
                apikey: API_KEY,
                base_currency: from,
                currencies: to,
            },
        });
        const rate = response.data.data[to];
        if (!rate) {
            return res.status(400).json({ error: 'Invalid target currency' });
        }
        res.json({
            from,
            to,
            amount,
            rate,
            result: amount * rate,
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to convert currency', details: error.message });
    }
});

export default router; 