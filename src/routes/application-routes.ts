import Router from 'express';
import * as applicationController from '../controllers/application-controller'
const router = Router()


router.post("", applicationController.createApplication)
router.get("/:filterType/:value", applicationController.FilterApplications)
router.get("", applicationController.findAllApplications)

export default router