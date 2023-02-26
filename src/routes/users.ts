import express from 'express';
import { asyncWrapper } from '../middleware/asyncWrapper';
import { validateQuery } from '../middleware/validateQuery';
import usersController from '../controllers/users';

const router = express.Router();

router.get('/', validateQuery, asyncWrapper(usersController.readAllUsers));

export = router;
