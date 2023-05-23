import express from "express";
import router from "./routes/index.routes.js";
import cors from "cors";

const app = express();
app.use([express.json(),cors(),router]);
 
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is running at port ${port}`));