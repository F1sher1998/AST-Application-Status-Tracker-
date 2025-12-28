import Router from 'express';
import * as roundController from '../controllers/round-controller'
import { isAuthenticated } from '../middleware/auth-middleware'
const router = Router()


router.post("/:appId", isAuthenticated, roundController.createRound)
router.get("/:appId", isAuthenticated, roundController.findRounds)
router.patch("/:appId", isAuthenticated, roundController.addNotes)

export default router