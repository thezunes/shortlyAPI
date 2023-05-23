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

export async function signin (req,res) {

const {email, password} = req.body;

const user = await db.query(` SELECT * FROM users WHERE email=$1;`, [email])
const token = uuid()


if(user.rowCount === 0) return res.sendStatus(404)

const correctPassword = bcrypt.compareSync(password, user.rows[0].password)

if(!correctPassword) return res.sendStatus(404);

try{

    await db.query(`INSERT INTO sessions (userId,Token) VALUES ($1,$2);`, [user.rows[0].id, token])

    res.status(200).send({ token: token })

}

catch(err) {

res.status(500).send(err.message)
}

}