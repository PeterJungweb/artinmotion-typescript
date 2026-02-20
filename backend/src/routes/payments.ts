import express from 'express';

import { createPaymentIntentController } from '../controllers/payments.js';

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntentController);

export default router;