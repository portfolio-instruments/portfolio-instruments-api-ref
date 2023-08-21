import { Benchmark, Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import { CreateBenchmarkRequest } from './benchmark.request.schema';

export type CreateBenchmarkContext = CreateBenchmarkRequest['body'] & { userId: number };

export async function createBenchmark(context: CreateBenchmarkContext): Promise<Benchmark> {
  return await prisma.benchmark.create({ data: context });
}

export async function getBenchmarkByTitle(userId: number, title: string): Promise<Benchmark | null> {
  return await prisma.benchmark.findFirst<Prisma.BenchmarkFindFirstArgsBase>({
    where: {
      userId,
      title,
    },
  });
}
