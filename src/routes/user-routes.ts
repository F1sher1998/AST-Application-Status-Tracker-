import Router from 'express';
import * as userController from '../controllers/user-controller'
import { isAuthenticated } from '../middleware/auth-middleware'
const router = Router()



router.post("/create", userController.createUser)
router.post("/login", userController.logInUser)


router.get("me", isAuthenticated, userController.getCurrentUser)

router.get("all", isAuthenticated, userController.findAllUsers)
router.get("one", isAuthenticated, userController.findUser)

export default router