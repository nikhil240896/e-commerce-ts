import { config } from "./config/config";
import app from "./app";
import { connectDB } from "./db/db-connect";


const PORT = config.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });


// https://www.youtube.com/watch?v=1UP8niF0WSM
