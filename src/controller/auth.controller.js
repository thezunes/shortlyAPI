import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import {db} from "../database/db.connection.js"

export async function signup(req,res){
    
const {name, email, password, confirmPassword } = req.body

const hash = bcrypt.hashSync(password, 10);

const userExist = await db.query(`SELECT * FROM users WHERE email=$1;`, [email])

if(password !== confirmPassword) return res.sendStatus(422)

if(userExist.rowCount > 0) return res.sendStatus(409); 

try{ 
    const user = await db.query(`
        INSERT INTO users 
        (name, email, password)
        VALUES
        ($1,$2,$3)`,[name,email,hash]);
        res.sendStatus(201)
 }

catch (err) {
    res.status(500).send(err.message)
}

}
