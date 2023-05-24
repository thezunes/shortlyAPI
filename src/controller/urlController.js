 import {db} from "../database/db.connection.js"
import { nanoid } from "nanoid";

export async function urlshorten(req,res){
    const {url}=req.body;

    const { authorization } = req.headers;
    const tokenVerify = authorization?.replace("Bearer ", "");
    const user = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [tokenVerify])
    const shortUrl = nanoid(15)
    console.log(shortUrl)
    const id = user.rows[0].userid

    try{
        const rowCount= await db.query(`
        INSERT INTO "shorturls"
        ("userid","shorturl","url")
        VALUES
        ($1,$2,$3)`
        ,[id, shortUrl, url]
    );
    
        res.sendStatus(200)

}
   
    catch(err){
        console.log(err.message);
        res.sendStatus(404);
    }
}