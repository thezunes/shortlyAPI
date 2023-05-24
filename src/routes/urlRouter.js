import { Router } from "express";
import { validateSchema } from "../middlewares/authValidation.js";
import {urlSchema} from "../schemas/urlSchemas.js"
import { tokenValidation } from "../middlewares/authorization.js";
import { urlshorten, shortUrl } from "../controller/urlController.js";



const urlRouter = Router();

urlRouter.post("/urls/shorten", [tokenValidation, validateSchema(urlSchema)], urlshorten)
urlRouter.get("/urls/:id", shortUrl)
// ursRouter.get("/urls/open/:shortUrl", openShortUrl)
// urlRouter.delete("/urls/:id", authorizationValidation, deleteShortUrl)
// urlRouter.get("/users/me", authorizationValidation, usersMe)
// urlRouter.get("/ranking", ranking)


export default urlRouter; 