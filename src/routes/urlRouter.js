import { Router } from "express";
import { validateSchema } from "../middlewares/authValidation.js";
import {urlSchema} from "../schemas/urlSchemas.js"
import { tokenValidation } from "../middlewares/authorization.js";
import { urlshorten, shortUrl, openUrl } from "../controller/urlController.js";



const urlRouter = Router();

urlRouter.post("/urls/shorten", [tokenValidation, validateSchema(urlSchema)], urlshorten)
urlRouter.get("/urls/:id", shortUrl)
urlRouter.get("/urls/open/:shortUrl", openUrl)



export default urlRouter; 