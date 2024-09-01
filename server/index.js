import app from "./src/app.js";
import dotenv from "dotenv";
import { connectToDB } from "./src/config/db.js";
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectToDB();
  console.log(`Server running on port: ${port}`);
});

