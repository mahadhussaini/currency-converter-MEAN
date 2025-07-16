import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const API_KEY = process.env.CURRENCY_API_KEY;
const BASE_URL = 'https://api.freecurrencyapi.com/v1';

interface ConvertRequestBody {
    from: string;
    to: string;
    amount: number;
}

interface ApiResult {
    data: Record<string, number>;
    // ...other fields as needed
}

interface ApiResponse {
    data: Record<string, number>; // or whatever the actual type is
    // ...other fields
}

function handleApiResponse(response: unknown) {
  if (
    typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        typeof (response as { data?: unknown }).data === 'object'
  ) {
    const data = (response as { data: Record<string, number> }).data;
    // ...
  }
}

// GET /api/currencies - List all supported currencies
router.get('/', async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${BASE_URL}/currencies`, {
      params: { apikey: API_KEY },
    });
    res.json(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to fetch currencies', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch currencies', details: 'Unknown error' });
    }
  }
});

// POST /api/currencies - Convert currency
router.post('/convert', async (req: Request, res: Response) => {
  const { from, to, amount } = req.body as ConvertRequestBody;
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
    const apiResult: unknown = response.data;
    if (
      typeof apiResult === 'object' &&
            apiResult !== null &&
            'data' in apiResult &&
            typeof (apiResult as { data?: unknown }).data === 'object'
    ) {
      const data = (apiResult as { data: Record<string, number> }).data;
      const rate = data[to];
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
    } else {
      res.status(500).json({ error: 'Failed to parse API response' });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

export default router; 