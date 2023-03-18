import express from 'express';
import asyncWrapper from '../../middleware/asyncWrapper';
import { requireUser } from '../../middleware/requireRole';
import validateRequest from '../../middleware/validateRequest';
import userController from './user.controller';
import { createUserSchema } from './user.schema';

const router = express.Router();

// GET /users
router.get('/', validateRequest(), requireUser, asyncWrapper(userController.getAllUsersHandler));

// POST /users
router.post('/', validateRequest(createUserSchema), asyncWrapper(userController.createUserHandler));

export default router;
