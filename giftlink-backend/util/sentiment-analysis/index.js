/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();

// Task 8: Import the natural npm package for natural language processing
const natural = require('natural');

// Set up the sentiment analyzer using the AFINN word list and PorterStemmer
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// POST /api/sentiment - analyze the sentiment of a piece of text (e.g. a comment)
router.post('/', (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).send('Text is required for sentiment analysis');
        }

        // Tokenize the text into words
        const tokenizer = new natural.WordTokenizer();
        const tokens = tokenizer.tokenize(text);

        // Get a sentiment score for the tokens
        const score = analyzer.getSentiment(tokens);

        // Categorize the score as positive, negative, or neutral
        let sentiment = 'neutral';
        if (score > 0) {
            sentiment = 'positive';
        } else if (score < 0) {
            sentiment = 'negative';
        }

        res.json({ score, sentiment });
    } catch (e) {
        console.error('Error analyzing sentiment:', e);
        res.status(500).send('Error analyzing sentiment');
    }
});

module.exports = router;