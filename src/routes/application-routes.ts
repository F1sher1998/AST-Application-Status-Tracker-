import Router from 'express';
import * as applicationController from '../controllers/application-controller'
import { isAuthenticated } from '../middleware/auth-middleware';
const router = Router()


router.post("/create", isAuthenticated, applicationController.createApplication)
router.get("/filter/:filterType/:value", isAuthenticated, applicationController.FilterApplications)
router.get("all", isAuthenticated, applicationController.findAllApplications)
router.patch("/:appId", isAuthenticated, applicationController.updateApplicationStatus)

export default router