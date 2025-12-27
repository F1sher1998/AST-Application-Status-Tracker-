import Router from 'express';
import * as applicationController from '../controllers/application-controller'
import { isAuthenticated } from '../middleware/auth-middleware';
const router = Router()


router.post("/:userId", isAuthenticated, applicationController.createApplication)
router.get("/:filterType/:value", isAuthenticated, applicationController.FilterApplications)
router.get("", isAuthenticated, applicationController.findAllApplications)
router.patch("/:appId", isAuthenticated, applicationController.updateApplicationStatus)

export default router