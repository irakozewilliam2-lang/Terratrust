import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for land applications and disputes
  const db = {
    applications: [
      { id: "APP-001", type: "Transfer", status: "Pending", date: "2024-03-01", applicant: "John Doe", parcelId: "P-102" },
      { id: "APP-002", type: "Subdivision", status: "Approved", date: "2024-02-15", applicant: "Jane Smith", parcelId: "P-205" },
    ],
    disputes: [
      { id: "DSP-001", parcelId: "P-102", status: "In Review", description: "Boundary overlap with neighbor", date: "2024-03-04" }
    ]
  };

  // API Routes
  app.get("/api/applications", (req, res) => {
    res.json(db.applications);
  });

  app.post("/api/applications", (req, res) => {
    const newApp = {
      id: `APP-00${db.applications.length + 1}`,
      ...req.body,
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };
    db.applications.push(newApp);
    res.status(201).json(newApp);
  });

  app.get("/api/disputes", (req, res) => {
    res.json(db.disputes);
  });

  app.post("/api/disputes", (req, res) => {
    const newDispute = {
      id: `DSP-00${db.disputes.length + 1}`,
      ...req.body,
      status: "Submitted",
      date: new Date().toISOString().split('T')[0]
    };
    db.disputes.push(newDispute);
    res.status(201).json(newDispute);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
