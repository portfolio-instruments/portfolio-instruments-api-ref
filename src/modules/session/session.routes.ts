import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import sessionController from './session.controller';
import { sessionSchema } from './session.schema';

const router = express.Router();

// POST /session
router.post('/', validateRequest(sessionSchema), asyncWrapper(sessionController.createUserSessionHandler));

export = router;
