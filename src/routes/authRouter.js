import { Router } from "express";
import {signup, signin} from "../controller/auth.controller.js"
import { validateSchema } from "../middlewares/authValidation.js";
import {signupSchema, signinSchema} from "../schemas/authSchema.js"


const authRouter = Router();

authRouter.post('/signup', validateSchema(signupSchema),signup);
authRouter.post('/signin', validateSchema(signinSchema),signin);


export default authRouter;