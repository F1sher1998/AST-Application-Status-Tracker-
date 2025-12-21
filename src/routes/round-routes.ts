import Router from 'express';
import * as roundController from '../controllers/round-controller'
const router = Router()


router.post("", roundController.createRound)


export default router