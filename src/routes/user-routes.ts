import Router from 'express';
import * as userController from '../controllers/user-controller'
import { isAuthenticated } from '../middleware/auth-middleware'
const router = Router()



router.post("", userController.createUser)
router.get("", isAuthenticated, userController.findAllUsers)
router.get("/:id", isAuthenticated, userController.findUser)
router.post("/login", userController.logInUser)

export default router