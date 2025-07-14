import { Router } from "express";
import multer from "multer";
import express from 'express';
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  }
});

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function isValidPath(filePath) {
  const normalizedPath = path.normalize(filePath);
  return !normalizedPath.includes('..') && !path.isAbsolute(normalizedPath);
}

function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
}

router.get("/projects", (req, res) => {
  try {
    const uploadsDir = "uploads";
    
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ projects: [] });
    }

    const items = fs.readdirSync(uploadsDir, { withFileTypes: true });
    const projects = items
      .filter(item => item.isDirectory() && item.name.startsWith('project-'))
      .map(item => {
        const projectPath = path.join(uploadsDir, item.name);
        const files = fs.readdirSync(projectPath);
        
        const htmlFile = files.find(file => file.endsWith('.html'));
        const stats = fs.statSync(projectPath);
        
        return {
          id: item.name,
          name: item.name.replace(/^project-/, '').replace(/-\d+$/, ''),
          path: projectPath,
          htmlFile: htmlFile || null,
          createdAt: stats.ctime,
          hasAssets: fs.existsSync(path.join(projectPath, 'assets'))
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ projects });
    
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// New route: Serve specific HTML file from project
router.get("/projects/:projectId/:htmlFile", (req, res) => {
  try {
    const { projectId, htmlFile } = req.params;
    
    // Sanitize the projectId to prevent path traversal
    if (!projectId || projectId.includes('..') || projectId.includes('/') || projectId.includes('\\')) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    // Validate HTML file name
    if (!htmlFile || !htmlFile.endsWith('.html') || htmlFile.includes('..') || htmlFile.includes('/') || htmlFile.includes('\\')) {
      return res.status(400).json({ error: "Invalid HTML file name" });
    }
    
    const projectPath = path.resolve("uploads", projectId);
    const uploadsDir = path.resolve("uploads");
    
    // Security check: ensure the resolved path is within uploads directory
    if (!projectPath.startsWith(uploadsDir + path.sep) && projectPath !== uploadsDir) {
      return res.status(400).json({ error: "Invalid project path" });
    }
    
    if (!fs.existsSync(projectPath)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const htmlPath = path.join(projectPath, htmlFile);
    
    if (!fs.existsSync(htmlPath)) {
      return res.status(404).json({ error: "HTML file not found" });
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Update asset paths to use the correct API endpoint
    htmlContent = htmlContent.replace(
      /src=["'](?:\.\/)?assets\//g,
      `src="/api/projects/${projectId}/assets/`
    );
    
    htmlContent = htmlContent.replace(
      /href=["'](?:\.\/)?assets\//g,
      `href="/api/projects/${projectId}/assets/`
    );
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
    
  } catch (err) {
    console.error("Error serving project HTML:", err);
    res.status(500).json({ error: "Failed to serve project HTML" });
  }
});

// Modified route: Serve project with default HTML file (for backward compatibility)
router.get("/projects/:projectId", (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Sanitize the projectId to prevent path traversal
    if (!projectId || projectId.includes('..') || projectId.includes('/') || projectId.includes('\\')) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const projectPath = path.resolve("uploads", projectId);
    const uploadsDir = path.resolve("uploads");
    
    // Security check: ensure the resolved path is within uploads directory
    if (!projectPath.startsWith(uploadsDir + path.sep) && projectPath !== uploadsDir) {
      return res.status(400).json({ error: "Invalid project path" });
    }
    
    if (!fs.existsSync(projectPath)) {
      return res.status(404).json({ error: "Project not found" });
    }

    const files = fs.readdirSync(projectPath);
    
    // Look for common HTML files in order of preference
    const htmlFiles = ['index.html', 'home.html', 'main.html'];
    let htmlFile = null;
    
    for (const preferredFile of htmlFiles) {
      if (files.includes(preferredFile)) {
        htmlFile = preferredFile;
        break;
      }
    }
    
    // If no preferred file found, use any HTML file
    if (!htmlFile) {
      htmlFile = files.find(file => file.endsWith('.html'));
    }
    
    if (!htmlFile) {
      return res.status(404).json({ error: "No HTML file found in project" });
    }

    // Redirect to the specific HTML file URL
    res.redirect(`/api/projects/${projectId}/${htmlFile}`);
    
  } catch (err) {
    console.error("Error serving project:", err);
    res.status(500).json({ error: "Failed to serve project" });
  }
});

router.use("/projects/:projectId/assets", (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Sanitize the projectId to prevent path traversal
    if (!projectId || projectId.includes('..') || projectId.includes('/') || projectId.includes('\\')) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const projectPath = path.resolve("uploads", projectId);
    const uploadsDir = path.resolve("uploads");
    
    // Security check: ensure the resolved path is within uploads directory
    if (!projectPath.startsWith(uploadsDir + path.sep) && projectPath !== uploadsDir) {
      return res.status(400).json({ error: "Invalid project path" });
    }
    
    const assetsPath = path.join(projectPath, "assets");
    
    if (!fs.existsSync(assetsPath)) {
      return res.status(404).json({ error: "Assets folder not found" });
    }

    // Remove the project-specific part from the URL for static serving
    req.url = req.url.replace(`/projects/${projectId}/assets`, '');
    if (req.url === '') req.url = '/';
    
    // Use express.static to serve the assets (now correctly inside the function)
    express.static(assetsPath)(req, res, next);
    
  } catch (err) {
    console.error("Error serving assets:", err);
    res.status(500).json({ error: "Failed to serve assets" });
  }
});

router.post("/save-content", upload.single("zipFile"), async (req, res) => {
  let zipPath;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No zip file uploaded." });
    }

    zipPath = req.file.path;
    
    if (req.file.size > 50 * 1024 * 1024) {
      cleanupFile(zipPath);
      return res.status(400).json({ error: "File too large. Maximum size is 50MB." });
    }

    const zip = new AdmZip(zipPath);
    const entries = zip.getEntries();
    
    if (entries.length === 0) {
      cleanupFile(zipPath);
      return res.status(400).json({ error: "ZIP file is empty." });
    }

    const topLevelFolders = new Set();
    const assetFiles = [];
    const rootFiles = [];

    for (const entry of entries) {
      if (!entry.entryName || entry.entryName.trim() === '') {
        continue;
      }

      if (!isValidPath(entry.entryName)) {
        cleanupFile(zipPath);
        return res.status(400).json({ error: "Invalid file path detected in ZIP." });
      }

      const parts = entry.entryName.split("/").filter(part => part.length > 0);
      
      if (parts.length > 1) {
        topLevelFolders.add(parts[0]);
      }

      const isRootFile = parts.length === 2 && !entry.isDirectory;
      if (isRootFile && /\.(html|css|js)$/i.test(parts[1])) {
        rootFiles.push({ name: entry.entryName, entry });
      }

      if (parts.length > 2 && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(parts[parts.length - 1])) {
        assetFiles.push({ name: entry.entryName, entry });
      }
    }

    if (topLevelFolders.size !== 1) {
      cleanupFile(zipPath);
      return res.status(400).json({ 
        error: "ZIP must contain exactly one top-level folder.",
        found: topLevelFolders.size 
      });
    }

    if (rootFiles.length === 0) {
      cleanupFile(zipPath);
      return res.status(400).json({ 
        error: "No HTML/CSS/JS files found in the root folder." 
      });
    }

    if (assetFiles.length === 0) {
      cleanupFile(zipPath);
      return res.status(400).json({ 
        error: "No image files found in subfolders." 
      });
    }

    const topLevelFolder = [...topLevelFolders][0];
    const sanitizedFolderName = sanitizeFileName(topLevelFolder);
    const targetBaseDir = path.join("uploads", `project-${sanitizedFolderName}-${Date.now()}`);
    const assetsDir = path.join(targetBaseDir, "assets");

    fs.mkdirSync(targetBaseDir, { recursive: true });
    fs.mkdirSync(assetsDir, { recursive: true });

    for (const file of rootFiles) {
      const filename = sanitizeFileName(path.basename(file.name));
      const targetPath = path.join(targetBaseDir, filename);
      
      if (!targetPath.startsWith(targetBaseDir)) {
        throw new Error('Path traversal attempt detected');
      }
      
      fs.writeFileSync(targetPath, file.entry.getData());
    }

    for (const file of assetFiles) {
      const filename = sanitizeFileName(path.basename(file.name));
      const targetPath = path.join(assetsDir, filename);
      
      if (!targetPath.startsWith(assetsDir)) {
        throw new Error('Path traversal attempt detected');
      }
      
      fs.writeFileSync(targetPath, file.entry.getData());
    }

    cleanupFile(zipPath);

    res.status(200).json({
      message: "ZIP validated and content saved successfully.",
      projectId: path.basename(targetBaseDir),
      stats: {
        rootFiles: rootFiles.length,
        assetFiles: assetFiles.length,
        totalProcessed: rootFiles.length + assetFiles.length
      }
    });

  } catch (err) {
    console.error("Error processing ZIP file:", err);
    
    if (zipPath) {
      cleanupFile(zipPath);
    }

    if (err instanceof Error) {
      if (err.message.includes('Path traversal')) {
        return res.status(400).json({ error: "Security violation detected." });
      }
      if (err.message.includes('Only ZIP files')) {
        return res.status(400).json({ error: "Only ZIP files are allowed." });
      }
    }

    return res.status(500).json({ 
      error: "Internal server error while processing ZIP file." 
    });
  }
});

export default router;