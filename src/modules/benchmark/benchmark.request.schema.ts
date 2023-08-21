import type { TypeOf } from 'zod';
import { number, object, string } from 'zod';
import { AssetCode } from '@prisma/client';
import { RESERVED_BENCHMARKS } from './benchmarks.utils';

export const createBenchmarkRequestSchema = object({
  body: object({
    title: string({ required_error: 'A title is required.' })
      .max(150, 'The title can be at most 255 characters long.')
      .refine((title) => !RESERVED_BENCHMARKS.includes(title.toLowerCase()), 'Title used is a reserved benchmark name.'),
    shortDescription: string().max(255, 'The shortDescription can be at most 255 characters long.').optional(),
    longDescription: string().min(1, 'The longDescription must be one character or greater in length.').optional(),
    url: string().url('The value provided is not recognized as a valid url.').max(255, 'The url can be at most 255 characters long.').optional(),
    stdDevPercent: number()
      .refine(
        (p) => /^\d*(\.\d{1,2})?$/.test(p.toString()),
        'The standard deviation (stdDevPercent) must represent a real number with two decimal points of precision or less.'
      )
      .optional(),
    cagrPercent: number()
      .refine(
        (p) => /^\d*(\.\d{1,2})?$/.test(p.toString()),
        'The compound annual growth rate (cagrPercent) must represent a real number with two decimal points of precision or less.'
      )
      .optional(),
    worstDrawdownPercent: number()
      .refine(
        (p) => /^\d*(\.\d{1,2})?$/.test(p.toString()),
        'The worst drawdown (worstDrawdownPercent) must represent a real number with two decimal points of precision or less.'
      )
      .optional(),
    longestDrawdownYears: number()
      .refine(
        (p) => /^\d*(\.\d{1,2})?$/.test(p.toString()),
        'The longest drawdown (longestDrawdownYears) must represent a real number with two decimal points of precision or less.'
      )
      .optional(),
    assets: string({ required_error: 'Assets (assets) are required.' })
      .array()
      .refine((assets) => new Set(assets).size === assets.length && assets.length >= 2, 'Must supply at least two assets, and they must be unique.')
      .refine(
        (assets) => assets.every((asset) => Object.keys(AssetCode).includes(asset)),
        `Assets must be one of the following types: ${Object.keys(AssetCode).join(', ')}`
      ),
    assetPercents: number({ required_error: 'Asset percentages (assetPercents) are required.' })
      .array()
      .refine((percents) => {
        if (!percents.every((p) => /^\d*$/.test(p.toString()))) {
          return false;
        } else {
          return percents.reduce((prev, curr) => prev + curr, 0) === 100;
        }
      }, 'Each asset percentage must represent a whole number and the sum total of all values should equal to 100.'),
    assetViewHexColors: string({ required_error: 'Asset hex colors (assetViewHexColors) are required.' })
      .array()
      .refine((colors) => colors.every((c) => /^#([A-Fa-f0-9]){6}$/.test(c)), 'Invalid hex colors. Hex colors should be of the format: "#12ABDF"')
      .optional(),
  })
    .strict()
    .refine(
      (body) =>
        body.assets.length === body.assetPercents.length && (!body.assetViewHexColors || body.assetViewHexColors.length === body.assets.length),
      'All arrays should be the same size.'
    ),
});

export type CreateBenchmarkRequest = TypeOf<typeof createBenchmarkRequestSchema> & { body: { assets: AssetCode[] } };
