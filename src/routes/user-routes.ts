import Router from 'express';
import * as userController from '../controllers/user-controller'
import { isAuthenticated } from '../middleware/auth-middleware'
const router = Router()



router.post("", userController.createUser)
router.post("/login", userController.logInUser)
router.get("", isAuthenticated, userController.findAllUsers)
router.get("/:id", isAuthenticated, userController.findUser)

export default router