import Router from 'express';
import * as roundController from '../controllers/round-controller'
import { isAuthenticated } from '../middleware/auth-middleware'
const router = Router()


router.post("", isAuthenticated, roundController.createRound)
router.patch("/:userId/:appId", isAuthenticated, roundController.addNotes)

export default router