import { Router } from "express";
import {signup} from "../controller/auth.controller.js"
import { validateSchema } from "../middlewares/authValidation.js";
import {signupSchema} from "../schemas/authSchema.js"


const authRouter = Router();

authRouter.post('/signup', validateSchema(signupSchema),signup);

export default authRouter;