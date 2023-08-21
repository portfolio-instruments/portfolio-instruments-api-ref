import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import { createBenchmarkRequestSchema } from './benchmark.request.schema';
import benchmarkController from './benchmark.controller';

const router = express.Router();

router.post('/', validateRequest(createBenchmarkRequestSchema), requireUser, asyncWrapper(benchmarkController.createBenchmarkHandler));

export default router;
