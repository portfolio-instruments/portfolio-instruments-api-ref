import express from 'express';
import userController from './user.controller';
import asyncWrapper from '../../middleware/asyncWrapper';
import validateRequest from '../../middleware/validateRequest';
import { createUserSchema } from './user.schema';

const router = express.Router();

// GET /users
router.get('/', validateRequest(), asyncWrapper(userController.getAllUsersHandler));

// POST /users
router.post('/', validateRequest(createUserSchema), asyncWrapper(userController.createUserHandler));

export = router;
