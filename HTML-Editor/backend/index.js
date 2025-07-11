import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(path.resolve(), 'uploads');
const projectsDir = path.join(uploadsDir, 'projects');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(projectsDir)) fs.mkdirSync(projectsDir);

app.use('/sites', express.static(uploadsDir));

const createProjectDirs = (projectId) => {
  const projectDir = path.join(projectsDir, projectId);
  const assetsDir = path.join(projectDir, 'assets'); // Assets inside project folder only
  
  if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  
  return { projectDir, assetsDir };
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.headers['x-project-id'];
    if (!projectId) return cb(new Error('Project ID required'));
    
    const { assetsDir } = createProjectDirs(projectId);
    cb(null, assetsDir);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage }).any();

app.post('/api/save-project', upload, (req, res) => {
  const projectId = req.headers['x-project-id'];
  const pageContents = JSON.parse(req.body.pageContents || '{}');
  const css = req.body.css || '';

  if (!projectId) return res.status(400).json({ error: 'Project ID required' });
  if (Object.keys(pageContents).length === 0) return res.status(400).json({ error: 'No page contents provided' });

  const { projectDir } = createProjectDirs(projectId);

  const processedPages = {};
  for (const [pageName, content] of Object.entries(pageContents)) {
    // Update asset paths to be relative to project folder
    const updatedContent = content.replace(/src="[^"]*\/assets\/(.*?)"/g, (match, filename) => {
      return `src="./assets/${filename}"`;
    });
    processedPages[pageName] = updatedContent;
  }

  const savePromises = Object.entries(processedPages).map(([pageName, content]) => {
    const fullHtml = `
      <html>
        <head>
          <style>${css}</style>
          <nav style="padding: 10px; background: #f0f0f0; margin-bottom: 20px;">
            ${Object.keys(processedPages).map(page => 
              `<a href="${page}.html" style="margin-right: 15px; text-decoration: none; color: #007bff;">${page}</a>`
            ).join('')}
          </nav>
        </head>
        <body>${content}</body>
      </html>
    `;
    
    const filename = `${pageName}.html`;
    const filePath = path.join(projectDir, filename);
    
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, fullHtml, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(savePromises)
    .then(() => {
      const firstPage = Object.keys(processedPages)[0];
      const indexUrl = `http://localhost:${PORT}/sites/projects/${projectId}/${firstPage}.html`;
      res.json({ success: true, url: indexUrl });
    })
    .catch((err) => {
      console.error('Save failed:', err);
      res.status(500).json({ error: 'Failed to save project' });
    });
});

app.post("/api/upload-asset/:projectId", upload, (req, res) => {
  const projectId = req.params.projectId;
  
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const uploadedFiles = req.files.map(file => ({
    src: `http://localhost:${PORT}/sites/projects/${projectId}/assets/${file.filename}`,
    name: file.originalname,
    type: 'image',
  }));

  return res.json({ data: uploadedFiles });
});

app.get("/api/list-assets/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const assetsDir = path.join(projectsDir, projectId, 'assets'); // Assets inside project folder
  
  if (!fs.existsSync(assetsDir)) {
    return res.json({ data: [] });
  }

  fs.readdir(assetsDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to list assets" });

    const imageFiles = files
      .filter((f) => /\.(jpe?g|png|gif|webp|svg)$/i.test(f))
      .map((f) => ({
        src: `http://localhost:${PORT}/sites/projects/${projectId}/assets/${f}`,
        name: f,
        type: 'image',
      }));

    res.json({ data: imageFiles });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});