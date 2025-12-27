import Router from 'express';
import * as roundController from '../controllers/round-controller'
import { isAuthenticated } from '../middleware/auth-middleware'
const router = Router()


router.post("/:userId/:appId", isAuthenticated, roundController.createRound)
router.get("/:appId", isAuthenticated, roundController.findRounds)
router.patch("/:userId/:appId", isAuthenticated, roundController.addNotes)

export default router