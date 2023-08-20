import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import { createBenchmarkRequestSchema } from './benchmark.request.schema';

const router = express.Router();

router.post('/', validateRequest(createBenchmarkRequestSchema), requireUser, asyncWrapper());

export default router;
