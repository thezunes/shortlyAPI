import { db } from "../database/db.connection.js";

export async function tokenValidation(req, res, next) {
    const { authorization } = req.headers;
    const tokenVerify = authorization?.replace("Bearer ", "");

    const isAuth = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [tokenVerify])
  
     if(!isAuth) return res.status(401).send("O usuário não está autorizado a efetuar a ação")
    
     try {
        next()

    } catch (err) {
        res.status(500).send(err.message)
    }
}