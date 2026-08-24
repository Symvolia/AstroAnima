import { Router } from 'express';
import { generateReading } from '../controllers/readingController.js';
import { natalChart, skyNow } from '../controllers/chartController.js';
import { eclipses } from '../controllers/skyController.js';

export const router = Router();

router.post('/readings/generate', generateReading);
router.post('/chart/natal', natalChart);
router.post('/sky/now', skyNow);
router.get('/sky/eclipses', eclipses);
