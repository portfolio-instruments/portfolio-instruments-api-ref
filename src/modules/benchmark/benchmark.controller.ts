import { Response } from 'express';
import { BaseRequest } from '../../BaseRequest';
import { ValidUserRequest } from '../../middleware/deserializeUser';
import { CreateBenchmarkRequest } from './benchmark.request.schema';
import { nonNullValue } from '../../utils/nonNull';
import { Benchmark } from '@prisma/client';
import { CreateBenchmarkContext, createBenchmark, getBenchmarkByTitle } from './benchmark.service';
import ApiError from '../../errors/ApiError';

type CreateBenchmarkHandlerRequest = BaseRequest & ValidUserRequest & CreateBenchmarkRequest;

async function createBenchmarkHandler(req: CreateBenchmarkHandlerRequest, res: Response): Promise<void> {
  const userId: number = nonNullValue(req.user?.id);
  const createBenchmarkContext: CreateBenchmarkContext = { ...req.body, userId };

  const peekBenchmark: Benchmark | null = await getBenchmarkByTitle(userId, createBenchmarkContext.title);
  if (peekBenchmark) {
    throw ApiError.conflict('A benchmark with this title already exists.');
  }

  const benchmark: Benchmark = await createBenchmark(createBenchmarkContext);
  res.status(201).json(benchmark);
}

export default { createBenchmarkHandler };
