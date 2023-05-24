import { Router } from "express";
import { validateSchema } from "../middlewares/authValidation.js";
import {urlSchema} from "../schemas/urlSchemas.js"
import { tokenValidation } from "../middlewares/authorization.js";
import { urlshorten, shortUrl, openUrl, dropShortUrl } from "../controller/urlController.js";



const urlRouter = Router();

urlRouter.post("/urls/shorten", [tokenValidation, validateSchema(urlSchema)], urlshorten)
urlRouter.get("/urls/:id", shortUrl)
urlRouter.get("/urls/open/:shortUrl", openUrl)
urlRouter.delete("/urls/:id", tokenValidation, dropShortUrl)



export default urlRouter; 