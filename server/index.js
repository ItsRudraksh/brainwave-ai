import app from "./src/app.js";
import dotenv from "dotenv";
import { connectToDB } from "./src/config/db.js";
import job from "./src/job/job.js";
dotenv.config();

const port = process.env.PORT || 3000;
job.start();

app.listen(port, () => {
  connectToDB();
  console.log(`Server running on port: ${port}`);
});
