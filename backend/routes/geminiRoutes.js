// Gemini API Routes for J&K Career Navigator
// Handles cryptocurrency and financial data from Gemini Exchange API

import express from 'express';

const router = express.Router();

// Health check endpoint for Gemini API
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Gemini Cryptocurrency API',
        version: '1.0.0',
        base_url: BASE_URL,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
        features: [
            'Real-time Cryptocurrency Prices',
            'Market Data & Order Books',
            'Trading Volume & History',
            'Symbol Information',
            'API Call Logging',
            'Performance Analytics'
        ],
        endpoints: {
            'symbols': '/api/gemini/symbols',
            'price': '/api/gemini/price/:symbol',
            'prices': '/api/gemini/prices',
            'order_book': '/api/gemini/book/:symbol',
            'trades': '/api/gemini/trades/:symbol',
            'market_data': '/api/gemini/market/:symbol',
            'stats': '/api/gemini/stats'
        },
        status_info: 'Service operational - Ready to fetch cryptocurrency data'
    });
});

// Configuration
const GEMINI_BASE_URL = 'https://api.gemini.com/v1';
const GEMINI_SANDBOX_URL = 'https://api.sandbox.gemini.com/v1';

// Use sandbox for development, production for live
const BASE_URL = process.env.NODE_ENV === 'production' ? GEMINI_BASE_URL : GEMINI_SANDBOX_URL;

// Helper function for error handling
const handleError = (res, error, operation) => {
    console.error(`Error in ${operation}:`, error);
    res.status(500).json({ 
        success: false, 
        error: `${operation} failed: ${error.message}` 
    });
};

// Helper function for successful responses
const sendSuccess = (res, data, message = 'Success') => {
    res.json({
        success: true,
        message,
        data
    });
};

// Helper function to make API calls to Gemini
const callGeminiAPI = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw error;
    }
};

// Helper function to log Gemini API calls to database
const logGeminiCall = async (db, endpoint, requestType, symbol, requestData, responseData, responseStatus, responseTime, userId = null) => {
    try {
        await db.query(`
            INSERT INTO gemini_logs 
            (endpoint, request_type, symbol, request_data, response_data, response_status, response_time, user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            endpoint, 
            requestType, 
            symbol, 
            JSON.stringify(requestData), 
            JSON.stringify(responseData), 
            responseStatus, 
            responseTime, 
            userId
        ]);
    } catch (error) {
        console.error('Failed to log Gemini API call:', error);
    }
};

// =============================================================================
// CRYPTOCURRENCY PRICE DATA
// =============================================================================

// Get current price for a specific symbol
router.get('/price/:symbol', async (req, res) => {
    const startTime = Date.now();
    try {
        const { symbol } = req.params;
        const { db } = req.app.locals;
        const userId = req.query.user_id || null;
        
        // Validate symbol format (e.g., btcusd, ethusd)
        const validSymbol = symbol.toLowerCase();
        if (!/^[a-z]{3,6}usd$/.test(validSymbol)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid symbol format. Use format like btcusd, ethusd, etc.'
            });
        }
        
        const endpoint = `/pubticker/${validSymbol}`;
        const requestData = { symbol: validSymbol };
        
        try {
            const data = await callGeminiAPI(endpoint);
            const responseTime = Date.now() - startTime;
            
            // Format response data
            const formattedData = {
                symbol: validSymbol.toUpperCase(),
                price: parseFloat(data.last),
                bid: parseFloat(data.bid),
                ask: parseFloat(data.ask),
                volume: {
                    base: parseFloat(data.volume.base),
                    quote: parseFloat(data.volume.quote),
                    timestamp: parseInt(data.volume.timestamp)
                },
                change_24h: data.change ? parseFloat(data.change) : null,
                timestamp: new Date().toISOString()
            };
            
            // Log to database
            await logGeminiCall(db, endpoint, 'price', validSymbol, requestData, formattedData, 200, responseTime, userId);
            
            sendSuccess(res, formattedData, `Price data retrieved for ${validSymbol.toUpperCase()}`);
        } catch (apiError) {
            const responseTime = Date.now() - startTime;
            await logGeminiCall(db, endpoint, 'price', validSymbol, requestData, { error: apiError.message }, 500, responseTime, userId);
            throw apiError;
        }
    } catch (error) {
        handleError(res, error, 'Get cryptocurrency price');
    }
});

// Get multiple cryptocurrency prices
router.get('/prices', async (req, res) => {
    const startTime = Date.now();
    try {
        const { symbols, user_id } = req.query;
        const { db } = req.app.locals;
        
        if (!symbols) {
            return res.status(400).json({
                success: false,
                error: 'Symbols parameter is required (comma-separated list)'
            });
        }
        
        const symbolList = symbols.split(',').map(s => s.trim().toLowerCase());
        const prices = {};
        const errors = {};
        
        // Fetch prices for each symbol
        for (const symbol of symbolList) {
            try {
                const endpoint = `/pubticker/${symbol}`;
                const data = await callGeminiAPI(endpoint);
                
                prices[symbol.toUpperCase()] = {
                    price: parseFloat(data.last),
                    bid: parseFloat(data.bid),
                    ask: parseFloat(data.ask),
                    volume: parseFloat(data.volume.base),
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                errors[symbol.toUpperCase()] = error.message;
            }
        }
        
        const responseTime = Date.now() - startTime;
        const requestData = { symbols: symbolList };
        const responseData = { prices, errors };
        
        // Log to database
        await logGeminiCall(db, '/prices', 'multiple_prices', 'MULTIPLE', requestData, responseData, 200, responseTime, user_id);
        
        sendSuccess(res, responseData, 'Multiple cryptocurrency prices retrieved');
    } catch (error) {
        handleError(res, error, 'Get multiple cryptocurrency prices');
    }
});

// =============================================================================
// MARKET DATA
// =============================================================================

// Get available trading symbols
router.get('/symbols', async (req, res) => {
    const startTime = Date.now();
    try {
        const { db } = req.app.locals;
        const userId = req.query.user_id || null;
        
        const endpoint = '/symbols';
        const requestData = {};
        
        try {
            const data = await callGeminiAPI(endpoint);
            const responseTime = Date.now() - startTime;
            
            // Format and categorize symbols
            const formattedData = {
                symbols: data,
                categories: {
                    btc_pairs: data.filter(s => s.includes('btc')),
                    eth_pairs: data.filter(s => s.includes('eth')),
                    usd_pairs: data.filter(s => s.endsWith('usd')),
                    total_count: data.length
                },
                timestamp: new Date().toISOString()
            };
            
            // Log to database
            await logGeminiCall(db, endpoint, 'symbols', 'ALL', requestData, formattedData, 200, responseTime, userId);
            
            sendSuccess(res, formattedData, 'Available trading symbols retrieved');
        } catch (apiError) {
            const responseTime = Date.now() - startTime;
            await logGeminiCall(db, endpoint, 'symbols', 'ALL', requestData, { error: apiError.message }, 500, responseTime, userId);
            throw apiError;
        }
    } catch (error) {
        handleError(res, error, 'Get trading symbols');
    }
});

// Get symbol details
router.get('/symbol-details/:symbol', async (req, res) => {
    const startTime = Date.now();
    try {
        const { symbol } = req.params;
        const { db } = req.app.locals;
        const userId = req.query.user_id || null;
        
        const validSymbol = symbol.toLowerCase();
        const endpoint = `/symbols/details/${validSymbol}`;
        const requestData = { symbol: validSymbol };
        
        try {
            const data = await callGeminiAPI(endpoint);
            const responseTime = Date.now() - startTime;
            
            // Log to database
            await logGeminiCall(db, endpoint, 'symbol_details', validSymbol, requestData, data, 200, responseTime, userId);
            
            sendSuccess(res, data, `Symbol details retrieved for ${validSymbol.toUpperCase()}`);
        } catch (apiError) {
            const responseTime = Date.now() - startTime;
            await logGeminiCall(db, endpoint, 'symbol_details', validSymbol, requestData, { error: apiError.message }, 500, responseTime, userId);
            throw apiError;
        }
    } catch (error) {
        handleError(res, error, 'Get symbol details');
    }
});

// =============================================================================
// ORDER BOOK DATA
// =============================================================================

// Get order book for a symbol
router.get('/book/:symbol', async (req, res) => {
    const startTime = Date.now();
    try {
        const { symbol } = req.params;
        const { db } = req.app.locals;
        const { limit_bids = 50, limit_asks = 50, user_id } = req.query;
        
        const validSymbol = symbol.toLowerCase();
        const endpoint = `/book/${validSymbol}`;
        const requestData = { symbol: validSymbol, limit_bids, limit_asks };
        
        try {
            let url = `${BASE_URL}${endpoint}?limit_bids=${limit_bids}&limit_asks=${limit_asks}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            // Format order book data
            const formattedData = {
                symbol: validSymbol.toUpperCase(),
                bids: data.bids.slice(0, parseInt(limit_bids)).map(bid => ({
                    price: parseFloat(bid.price),
                    amount: parseFloat(bid.amount),
                    timestamp: parseInt(bid.timestamp)
                })),
                asks: data.asks.slice(0, parseInt(limit_asks)).map(ask => ({
                    price: parseFloat(ask.price),
                    amount: parseFloat(ask.amount),
                    timestamp: parseInt(ask.timestamp)
                })),
                spread: {
                    absolute: data.asks[0] && data.bids[0] ? 
                        parseFloat(data.asks[0].price) - parseFloat(data.bids[0].price) : null,
                    percentage: data.asks[0] && data.bids[0] ? 
                        ((parseFloat(data.asks[0].price) - parseFloat(data.bids[0].price)) / parseFloat(data.bids[0].price) * 100) : null
                },
                timestamp: new Date().toISOString()
            };
            
            // Log to database
            await logGeminiCall(db, endpoint, 'order_book', validSymbol, requestData, formattedData, 200, responseTime, user_id);
            
            sendSuccess(res, formattedData, `Order book retrieved for ${validSymbol.toUpperCase()}`);
        } catch (apiError) {
            const responseTime = Date.now() - startTime;
            await logGeminiCall(db, endpoint, 'order_book', validSymbol, requestData, { error: apiError.message }, 500, responseTime, user_id);
            throw apiError;
        }
    } catch (error) {
        handleError(res, error, 'Get order book');
    }
});

// =============================================================================
// TRADE HISTORY
// =============================================================================

// Get recent trades for a symbol
router.get('/trades/:symbol', async (req, res) => {
    const startTime = Date.now();
    try {
        const { symbol } = req.params;
        const { db } = req.app.locals;
        const { limit_trades = 50, user_id } = req.query;
        
        const validSymbol = symbol.toLowerCase();
        const endpoint = `/trades/${validSymbol}`;
        const requestData = { symbol: validSymbol, limit_trades };
        
        try {
            let url = `${BASE_URL}${endpoint}?limit_trades=${limit_trades}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            const responseTime = Date.now() - startTime;
            
            // Format trade data
            const formattedData = {
                symbol: validSymbol.toUpperCase(),
                trades: data.slice(0, parseInt(limit_trades)).map(trade => ({
                    price: parseFloat(trade.price),
                    amount: parseFloat(trade.amount),
                    timestamp: parseInt(trade.timestamp),
                    timestampms: parseInt(trade.timestampms),
                    type: trade.type,
                    aggressor: trade.aggressor,
                    fee_currency: trade.fee_currency,
                    fee_amount: parseFloat(trade.fee_amount),
                    tid: parseInt(trade.tid),
                    order_id: trade.order_id,
                    exchange: trade.exchange
                })),
                statistics: {
                    total_trades: data.length,
                    volume: data.reduce((sum, trade) => sum + parseFloat(trade.amount), 0),
                    avg_price: data.length > 0 ? 
                        data.reduce((sum, trade) => sum + parseFloat(trade.price), 0) / data.length : 0,
                    price_range: {
                        high: Math.max(...data.map(trade => parseFloat(trade.price))),
                        low: Math.min(...data.map(trade => parseFloat(trade.price)))
                    }
                },
                timestamp: new Date().toISOString()
            };
            
            // Log to database
            await logGeminiCall(db, endpoint, 'trades', validSymbol, requestData, formattedData, 200, responseTime, user_id);
            
            sendSuccess(res, formattedData, `Recent trades retrieved for ${validSymbol.toUpperCase()}`);
        } catch (apiError) {
            const responseTime = Date.now() - startTime;
            await logGeminiCall(db, endpoint, 'trades', validSymbol, requestData, { error: apiError.message }, 500, responseTime, user_id);
            throw apiError;
        }
    } catch (error) {
        handleError(res, error, 'Get recent trades');
    }
});

// =============================================================================
// ANALYTICS AND LOGS
// =============================================================================

// Get Gemini API usage statistics
router.get('/stats', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { date_from, date_to, user_id } = req.query;
        
        let query = `
            SELECT 
                request_type,
                symbol,
                COUNT(*) as request_count,
                AVG(response_time) as avg_response_time,
                COUNT(CASE WHEN response_status = 200 THEN 1 END) as successful_requests,
                COUNT(CASE WHEN response_status != 200 THEN 1 END) as failed_requests
            FROM gemini_logs 
            WHERE 1=1
        `;
        const queryParams = [];
        
        if (date_from && date_to) {
            queryParams.push(date_from, date_to);
            query += ` AND created_at BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        }
        
        if (user_id) {
            queryParams.push(user_id);
            query += ` AND user_id = $${queryParams.length}`;
        }
        
        query += ` GROUP BY request_type, symbol ORDER BY request_count DESC`;
        
        const result = await db.query(query, queryParams);
        
        // Get total statistics
        const totalQuery = `
            SELECT 
                COUNT(*) as total_requests,
                AVG(response_time) as avg_response_time,
                COUNT(CASE WHEN response_status = 200 THEN 1 END) as total_successful,
                COUNT(CASE WHEN response_status != 200 THEN 1 END) as total_failed
            FROM gemini_logs 
            WHERE 1=1 ${date_from && date_to ? ` AND created_at BETWEEN $1 AND $2` : ''}
        `;
        
        const totalResult = await db.query(totalQuery, date_from && date_to ? [date_from, date_to] : []);
        
        sendSuccess(res, {
            detailed_stats: result.rows,
            overall_stats: totalResult.rows[0],
            period: date_from && date_to ? { from: date_from, to: date_to } : 'all_time'
        }, 'Gemini API statistics retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get Gemini API statistics');
    }
});

// Get recent Gemini API logs
router.get('/logs', async (req, res) => {
    try {
        const { db } = req.app.locals;
        const { limit = 50, user_id, status } = req.query;
        
        let query = `
            SELECT 
                id, endpoint, request_type, symbol, 
                response_status, response_time, created_at, user_id
            FROM gemini_logs 
            WHERE 1=1
        `;
        const queryParams = [];
        
        if (user_id) {
            queryParams.push(user_id);
            query += ` AND user_id = $${queryParams.length}`;
        }
        
        if (status) {
            queryParams.push(parseInt(status));
            query += ` AND response_status = $${queryParams.length}`;
        }
        
        query += ` ORDER BY created_at DESC`;
        
        queryParams.push(parseInt(limit));
        query += ` LIMIT $${queryParams.length}`;
        
        const result = await db.query(query, queryParams);
        sendSuccess(res, result.rows, 'Gemini API logs retrieved successfully');
    } catch (error) {
        handleError(res, error, 'Get Gemini API logs');
    }
});

// =============================================================================
// HEALTH CHECK
// =============================================================================

// Health check for Gemini API connectivity
router.get('/health', async (req, res) => {
    const startTime = Date.now();
    try {
        const { db } = req.app.locals;
        
        // Test Gemini API connectivity
        const testSymbol = 'btcusd';
        const endpoint = `/pubticker/${testSymbol}`;
        
        try {
            await callGeminiAPI(endpoint);
            const responseTime = Date.now() - startTime;
            
            res.json({
                status: 'success',
                gemini_api: 'connected',
                base_url: BASE_URL,
                response_time_ms: responseTime,
                test_endpoint: endpoint,
                timestamp: new Date().toISOString()
            });
        } catch (apiError) {
            const responseTime = Date.now() - startTime;
            res.status(500).json({
                status: 'error',
                gemini_api: 'disconnected',
                base_url: BASE_URL,
                response_time_ms: responseTime,
                error: apiError.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Health check failed',
            error: error.message
        });
    }
});

export default router;
