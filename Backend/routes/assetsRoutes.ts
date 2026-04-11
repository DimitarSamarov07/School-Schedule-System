import express from 'express';
import path from 'path';

const router = express.Router();

router.get("/bell", (req, res) => {
    const filePath = path.join(process.cwd(), 'assets', 'bell.mp3');

    // Aggressive caching
    // 2592000 seconds = 1 month.
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Failed to send MP3:", err);
            res.status(404).json({error: "Audio file not found."});
        }
    });
});

export default router;