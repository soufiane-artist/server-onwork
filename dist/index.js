"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
const sub_routes_1 = __importDefault(require("./routes/sub.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const invoice_routes_1 = __importDefault(require("./routes/invoice.routes"));
const article_routes_1 = __importDefault(require("./routes/article.routes"));
const quote_routes_1 = __importDefault(require("./routes/quote.routes"));
const delivery_routes_1 = __importDefault(require("./routes/delivery.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:3000', 'https://onwork-agence.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection
(0, db_1.connectDB)().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/subscribers', sub_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/contact', contact_routes_1.default);
app.use('/api/clients', client_routes_1.default);
app.use('/api/invoices', invoice_routes_1.default);
app.use('/api/quotes', quote_routes_1.default);
app.use('/api/articles', article_routes_1.default);
app.use('/api/deliveries', delivery_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
exports.default = app;
