const express = require('express');
const router = express.Router();

// In-memory storage for ratings (You may want to connect to a database instead)
let ratings = [];

// GET all ratings
router.get('/', (req, res) => {
    res.json(ratings);
});

// POST a new rating
router.post('/', (req, res) => {
    const { lawyerId, ratingValue } = req.body;
    if (!lawyerId || ratingValue === undefined) {
        return res.status(400).json({ error: 'lawyerId and ratingValue are required' });
    }
    
    const newRating = { lawyerId, ratingValue };
    ratings.push(newRating);
    
    // Calculate new average
    const averageRating = calculateAverageRating(lawyerId);
    
    res.status(201).json({ newRating, averageRating });
});

// PUT (update) a rating (Assuming ratings can be updated with lawyerId and new value)
router.put('/:lawyerId', (req, res) => {
    const { lawyerId } = req.params;
    const { ratingValue } = req.body;

    let rating = ratings.find(r => r.lawyerId === lawyerId);
    
    if (!rating) {
        return res.status(404).json({ error: 'Rating not found' });
    }
    
    rating.ratingValue = ratingValue; // update ratingValue
    const averageRating = calculateAverageRating(lawyerId);
    
    res.json({ rating, averageRating });
});

// DELETE a rating
router.delete('/:lawyerId', (req, res) => {
    const { lawyerId } = req.params;
    ratings = ratings.filter(r => r.lawyerId !== lawyerId);
    
    const averageRating = calculateAverageRating(lawyerId);
    
    res.json({ message: 'Rating deleted', averageRating });
});

// Helper function to calculate average rating
function calculateAverageRating(lawyerId) {
    const lawyerRatings = ratings.filter(r => r.lawyerId === lawyerId);
    const sum = lawyerRatings.reduce((acc, r) => acc + r.ratingValue, 0);
    return lawyerRatings.length > 0 ? (sum / lawyerRatings.length).toFixed(2) : 0;
}

module.exports = router;