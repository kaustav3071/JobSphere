import {
    createApplication,
    getAllApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication,
} from '../controllers/application.controller.js';
import { authenticateUser, authenticateRecruiter, authenticateAny } from '../middlewares/auth.js';
import { body } from 'express-validator';
import express from 'express';

const applicationRouter = express.Router();


const applicationValidationRules = [
  body('job').notEmpty().withMessage('Job ID is required').isMongoId().withMessage('Invalid Job ID'),
];

const statusValidationRules = [
  body('status').isIn(['applied', 'interviewed', 'hired', 'rejected']).withMessage('Invalid status'),
];



applicationRouter.post('/', authenticateUser, applicationValidationRules, createApplication);


applicationRouter.get('/', authenticateRecruiter, getAllApplications);


applicationRouter.get('/:applicationId',authenticateAny, getApplicationById);


applicationRouter.put('/:applicationId/status', authenticateRecruiter, statusValidationRules, updateApplicationStatus);


applicationRouter.delete('/:applicationId', authenticateAny, deleteApplication);


export default applicationRouter;