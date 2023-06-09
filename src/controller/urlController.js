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
    const shortUrl = await db.query(`SELECT * FROM "shorturls" WHERE id=$1;`, [id])
    const body = {
        id: id,
        shortUrl: shortUrl.rows[0].shorturl,
        url: shortUrl.rows[0].url
        
    }

    if (shortUrl.rowCount < 1) { return res.status(404).send("URL não existe")
        }

    try {

        

        res.status(200).send(body)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function openUrl(req,res){

    const { shortUrl } = req.params
    
    if(!shortUrl) return res.status(404).send("shortUrl Inválido");
    
    try{

        const verifyShortUrl = await db.query(`
        SELECT url 
        FROM "shorturls"
        WHERE "shorturl"=$1`,[shortUrl])
 
        if(verifyShortUrl.rowCount < 1) return res.sendStatus(404);

        const {rowCount}= await db.query(`
        UPDATE "shorturls"
        SET "visitcount"="visitcount"+1
        WHERE "shorturl"=$1`,[shortUrl]
    );
        res.redirect(`${verifyShortUrl.rows[0].url}`)
        
    }catch(err){
        console.log(err.message);
        res.sendStatus(500);
    }
}


export async function dropShortUrl (req,res) {

    const { id } = req.params
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if(!authorization) return res.sendStatus(401);

    try {

        const user = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token])
        const url = await db.query(`SELECT * FROM "shorturls" WHERE id=$1;`, [id])

        console.log(url.rows[0].userid)
        console.log(user.rows[0].id)

        if (url.rowCount < 1) { return res.sendStatus(404) }
        if (user.rows[0].userid !== url.rows[0].userid ) {return res.status(401).send("A Url não pertence ao usuário")}

        await db.query(`DELETE FROM "shorturls" WHERE id=$1`, [id])
        res.sendStatus(204) }

    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function userUrls(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    const user = await db.query(`SELECT userid FROM sessions WHERE token=$1;`, [token]);
    const userId = user.rows[0].userid;

    try {
        const userData = await db.query(`
            SELECT json_build_object(
                'id', u.id,
                'name', u.name,
                'visitcount', (SELECT COALESCE(SUM(s.visitcount), 0) FROM "shorturls" s WHERE s.userid::integer = u.id),
                'shortenedUrls', (
                    SELECT JSON_AGG(json_build_object(
                        'id', s.id,
                        'shortUrl', s.shorturl,
                        'url', s.url,
                        'visitCount', s.visitcount
                    ))
                    FROM "shorturls" s
                    WHERE s.userid::integer = u.id
                )
            ) AS result
            FROM users u
            WHERE u.id::integer = $1;
        `, [userId]);

        res.status(200).send(userData.rows[0]);

    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}
    
export async function ranking(req, res) {

try{


    const getRanking = await db.query(`
  SELECT
    users.id,
    users.name,
    COUNT(shorturls.shorturl) AS "linksCount",
    SUM(COALESCE(shorturls.visitcount, 0)) AS "visitCount"
  FROM users
    LEFT JOIN shorturls ON users.id = shorturls.userid::integer
  GROUP BY users.id, users.name
  ORDER BY "visitCount" DESC
  LIMIT $1;
`, [10]);

res.status(201).send(getRanking.rows)

}

catch(err){

res.status(500).send(err.message)

}

}
