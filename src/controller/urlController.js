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

    const body = {
        id: id,
        shortUrl: shortUrl
    }

    try{
        const rowCount= await db.query(`
        INSERT INTO "shorturls"
        ("userid","shorturl","url")
        VALUES
        ($1,$2,$3)`
        ,[id, shortUrl, url]
    );
    
        res.status(201).send(body)

}
   
    catch(err){
        console.log(err.message);
        res.sendStatus(404);
    }
}

export async function shortUrl(req, res) {
    const { id } = req.params
    const shortUrl = await db.query(`SELECT * FROM "shorturls" WHERE userid=$1;`, [id])
    const body = {
        id: id,
        shortUrl: shortUrl.rows[0].shorturl,
        url: shortUrl.rows[0].url
    }

    try {

        if (shortUrl.rowCount < 1) { return res.status(404).send("URL não existe")
        }

        res.status(200).send(body)

    } catch (err) {
        res.status(500).send(err.message)
    }
}