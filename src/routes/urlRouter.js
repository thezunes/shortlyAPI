import { Router } from "express";
import { validateSchema } from "../middlewares/authValidation.js";
import {urlSchema} from "../schemas/urlSchemas.js"
import { tokenValidation } from "../middlewares/authorization.js";
import { urlshorten } from "../controller/urlController.js";



const urlRouter = Router();

urlRouter.post("/urls/shorten", [tokenValidation, validateSchema(urlSchema)], urlshorten)


export default urlRouter; 