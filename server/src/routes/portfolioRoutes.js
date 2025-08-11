// src/routes/portfolioRoutes.js
const express = require('express');
const {
    generatePortfolio,
    publishPortfolio,
    getPortfolios,
    getPortfolioById,
    deletePortfolio
} = require('../controllers/portfolioController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { validate, validatePortfolioInput } = require('../utils/validator'); // <-- ADD THIS

const router = express.Router();

router.use(authenticateUser); // All portfolio routes are protected

router.post('/generate', validatePortfolioInput, validate, generatePortfolio); // <-- ADD VALIDATION
router.post('/:id/publish', publishPortfolio); // No complex body validation needed here for MVP
router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);
router.delete('/:id', deletePortfolio);

module.exports = router;