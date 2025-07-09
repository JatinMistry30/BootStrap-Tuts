import express from "express";
import multer from "multer";
import fs from "fs";
import path, { dirname } from "path";
import cors from "cors";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT = 5000;

app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Directories
const uploadsDir = path.join(__dirname, "uploads");
const sitesDir = path.join(__dirname, "sites");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(sitesDir)) fs.mkdirSync(sitesDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, "template.html");
  },
});

const upload = multer({ storage });

// Route to upload the html template

app.post("/api/upload", upload.single("htmlFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const filePath = req.file.path;
  const htmlContent = fs.readFileSync(filePath, "utf8");

  res.json({
    success: true,
    content: htmlContent,
    message: "File uploaded successfully",
  });
});

// Route to get the current template

app.get("/api/template", (req, res) => {
  const templatePath = path.join(uploadsDir, "template.html");
  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({ error: "No template found" });
  }

  const htmlContent = fs.readFileSync(templatePath, "utf8");
  res.json({ content: htmlContent });
});


// Route to Save modified template

app.post('/api/save', (req,res) => {
    const {html} = req.body;

    if(!html){
        return res.status(400).json({error: 'No HTML content provided'})
    }
    try {
        const templatePath = path.join(uploadsDir, 'template.html')
        fs.writeFileSync(templatePath, html)

        const sitePath = path.join(sitesDir, 'index.html')
        fs.writeFileSync(sitePath,html)

        res.json({
            success: true,
            message: 'Template Saved Successfully',
            siteUrl: `http://localhost:${PORT}/site`
        })
    } catch (error) {
        res.status(500).json({error: 'Failed to save template'})
    }
})


// Route to serve the website

app.get('/site', (req, res) => {
  const sitePath = path.join(sitesDir, 'index.html');
  
  if (!fs.existsSync(sitePath)) {
    return res.status(404).send('<h1>No site published yet</h1>');
  }
  
  res.sendFile(sitePath);
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
