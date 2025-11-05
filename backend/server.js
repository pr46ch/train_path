import express from "express";
import cors from "cors";
import findRoute from "./test_api3.js";  // default export

const app = express();
app.use(cors());
app.use(express.json());


app.post("/path", async (req, res) => {
  try {
    const { source, destination } = req.body;

    // Validate input
    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination required" });
    }

    // Call the async findRoute function
    const routeData = await findRoute(source, destination);

    // Send the result as response
    res.status(200).json(routeData);
  } catch (error) {
    console.error("Error in /path:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
