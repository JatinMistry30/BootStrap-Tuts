import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/templates', express.static(path.join(__dirname, 'public/templates'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.set('Content-Type', 'text/html');
        }
    }
}));

app.use('/editedSites', express.static(path.join(__dirname, 'public/editedSites'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.set('Content-Type', 'text/html');
        }
    }
}));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.get('/api/templates', (req, res) => {
    const templatesDir = path.join(__dirname, 'public', 'templates');
    if (!fs.existsSync(templatesDir)) {
        return res.json([]);
    }

    const templates = fs.readdirSync(templatesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const folderName = dirent.name;
            const templatePath = path.join(templatesDir, folderName);
            const pages = [];
            
            if (fs.existsSync(path.join(templatePath, 'index.html'))) {
                pages.push({
                    name: 'index',
                    url: `http://localhost:5000/templates/${folderName}/index.html`
                });
            }
            
            const files = fs.readdirSync(templatePath);
            files.forEach(file => {
                if (file.endsWith('.html') && file !== 'index.html') {
                    const pageName = file.replace('.html', '');
                    pages.push({
                        name: pageName,
                        url: `http://localhost:5000/templates/${folderName}/${file}`
                    });
                }
            });

            return {
                name: folderName,
                url: `http://localhost:5000/templates/${folderName}/index.html`,
                assetsUrl: `http://localhost:5000/templates/${folderName}/assets/`,
                pages: pages
            };
        });

    res.json(templates);
});

app.get('/api/template/:templateName/assets', (req, res) => {
    const { templateName } = req.params;
    const assetsDir = path.join(__dirname, 'public/templates', templateName, 'assets');
    
    if (!fs.existsSync(assetsDir)) {
        return res.json([]);
    }

    const assets = fs.readdirSync(assetsDir)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        })
        .map(file => ({
            src: `http://localhost:5000/templates/${templateName}/assets/${file}`,
            type: 'image',
            name: file
        }));

    res.json(assets);
});

app.get('/api/edited-site/:siteName/assets', (req, res) => {
    const { siteName } = req.params;
    const assetsDir = path.join(__dirname, 'public/editedSites', siteName, 'assets');
    
    if (!fs.existsSync(assetsDir)) {
        return res.json([]);
    }

    const assets = fs.readdirSync(assetsDir)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        })
        .map(file => ({
            src: `http://localhost:5000/editedSites/${siteName}/assets/${file}`,
            type: 'image',
            name: file
        }));

    res.json(assets);
});

app.post('/api/upload-asset', upload.single('file'), (req, res) => {
    console.log('Upload request received:', req.body, req.file);
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const templateName = req.body.templateName || `temp_${Date.now()}`;
    
    const publicDir = path.join(__dirname, 'public');
    const editedSitesDir = path.join(publicDir, 'editedSites');
    const templateFolder = path.join(editedSitesDir, templateName);
    const assetsDir = path.join(templateFolder, 'assets');

    [publicDir, editedSitesDir, templateFolder, assetsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    const fileExtension = path.extname(req.file.originalname) || '.jpg';
    const baseName = path.basename(req.file.originalname, fileExtension) || `image_${Date.now()}`;
    const safeFileName = `${baseName}${fileExtension}`.replace(/[^a-zA-Z0-9._-]/g, '_');
    const newPath = path.join(assetsDir, safeFileName);

    try {
        fs.renameSync(req.file.path, newPath);
        const assetUrl = `http://localhost:5000/editedSites/${templateName}/assets/${safeFileName}`;
        
        console.log('File uploaded successfully:', assetUrl);
        
        res.json({
            success: true,
            url: assetUrl,
            filename: safeFileName
        });
    } catch (error) {
        console.error('Error moving file:', error);
        
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ 
            error: 'Failed to save uploaded file',
            details: error.message 
        });
    }
});

const copyDirectory = (src, dest) => {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

app.post('/api/save-template', upload.array('assets'), async (req, res) => {
    try {
        const { pages, templateName, originalTemplateName } = req.body;
        const files = req.files || [];

        if (!templateName || !pages) {
            return res.status(400).json({ error: 'Template name and pages are required' });
        }

        const parsedPages = JSON.parse(pages);
        
        const publicDir = path.join(__dirname, 'public');
        const editedSitesDir = path.join(publicDir, 'editedSites');
        const templateFolder = path.join(editedSitesDir, templateName);
        const assetsDir = path.join(templateFolder, 'assets');

        [publicDir, editedSitesDir, templateFolder, assetsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        if (originalTemplateName) {
            const originalAssetsDir = path.join(__dirname, 'public/templates', originalTemplateName, 'assets');
            if (fs.existsSync(originalAssetsDir)) {
                copyDirectory(originalAssetsDir, assetsDir);
            }
        }

        files.forEach(file => {
            const fileName = file.originalname || `file_${Date.now()}`;
            const newPath = path.join(assetsDir, fileName);
            fs.renameSync(file.path, newPath);
        });

        const processHtml = (html) => {
            let processedHtml = html;
            
            processedHtml = processedHtml.replace(
                /http:\/\/localhost:5000\/templates\/[^\/]+\/assets\//g, 
                './assets/'
            );
            
            processedHtml = processedHtml.replace(
                /http:\/\/localhost:5000\/editedSites\/[^\/]+\/assets\//g, 
                './assets/'
            );

            return processedHtml;
        };

        const processCss = (css) => {
            let processedCss = css;
            
            processedCss = processedCss.replace(
                /http:\/\/localhost:5000\/templates\/[^\/]+\/assets\//g, 
                './assets/'
            );
            
            processedCss = processedCss.replace(
                /http:\/\/localhost:5000\/editedSites\/[^\/]+\/assets\//g, 
                './assets/'
            );

            return processedCss;
        };

        Object.keys(parsedPages).forEach(pageName => {
            const pageData = parsedPages[pageName];
            const { html, css } = pageData;
            
            const processedHtml = processHtml(html);
            const processedCss = processCss(css);
            
            const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateName} - ${pageName}</title>
    <link rel="stylesheet" href="./assets/style.css" />
    <style>${processedCss}</style>
</head>
<body>
    ${processedHtml}
</body>
</html>`;

            const fileName = pageName === 'index' ? 'index.html' : `${pageName}.html`;
            const outputPath = path.join(templateFolder, fileName);
            fs.writeFileSync(outputPath, fullHtml, 'utf8');
        });

        const liveUrl = `http://localhost:5000/editedSites/${templateName}/index.html`;
        
        res.json({
            success: true,
            url: liveUrl,
            message: 'Template saved successfully!'
        });

    } catch (error) {
        console.error('Error saving template:', error);
        res.status(500).json({ 
            error: 'Failed to save template',
            details: error.message 
        });
    }
});

app.get('/api/edited-sites', (req, res) => {
    const editedSitesDir = path.join(__dirname, 'public', 'editedSites');
    if (!fs.existsSync(editedSitesDir)) {
        return res.json([]);
    }

    const sites = fs.readdirSync(editedSitesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => {
            const folderName = dirent.name;
            const sitePath = path.join(editedSitesDir, folderName);
            const pages = [];
            
            if (fs.existsSync(path.join(sitePath, 'index.html'))) {
                pages.push({
                    name: 'index',
                    url: `http://localhost:5000/editedSites/${folderName}/index.html`
                });
            }
            
            const files = fs.readdirSync(sitePath);
            files.forEach(file => {
                if (file.endsWith('.html') && file !== 'index.html') {
                    const pageName = file.replace('.html', '');
                    pages.push({
                        name: pageName,
                        url: `http://localhost:5000/editedSites/${folderName}/${file}`
                    });
                }
            });

            return {
                name: folderName,
                url: `http://localhost:5000/editedSites/${folderName}/index.html`,
                assetsUrl: `http://localhost:5000/editedSites/${folderName}/assets/`,
                pages: pages
            };
        });

    res.json(sites);
});


app.get('/api/assets', (req, res) => {
    const assetsDir = path.join(__dirname, 'public', 'assets');
    
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
        return res.json([]);
    }

    try {
        const assets = fs.readdirSync(assetsDir)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.css', '.js', '.txt', '.json'].includes(ext);
            })
            .map(file => {
                const filePath = path.join(assetsDir, file);
                const stats = fs.statSync(filePath);
                const ext = path.extname(file).toLowerCase();
                
                let type = 'file';
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
                    type = 'image';
                } else if (ext === '.css') {
                    type = 'css';
                } else if (ext === '.js') {
                    type = 'javascript';
                }

                return {
                    name: file,
                    url: `http://localhost:5000/assets/${file}`,
                    type: type,
                    size: stats.size,
                    uploadDate: stats.birthtime
                };
            })
            .sort((a, b) => b.uploadDate - a.uploadDate); // Sort by upload date, newest first

        res.json(assets);
    } catch (error) {
        console.error('Error reading assets directory:', error);
        res.status(500).json({ error: 'Failed to read assets directory' });
    }
});


// Add these routes to your existing Express server

// GET /api/assets - Get all uploaded assets
app.get('/api/assets', (req, res) => {
    const assetsDir = path.join(__dirname, 'public', 'assets');
    
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
        return res.json([]);
    }

    try {
        const assets = fs.readdirSync(assetsDir)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.css', '.js', '.txt', '.json'].includes(ext);
            })
            .map(file => {
                const filePath = path.join(assetsDir, file);
                const stats = fs.statSync(filePath);
                const ext = path.extname(file).toLowerCase();
                
                let type = 'file';
                if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
                    type = 'image';
                } else if (ext === '.css') {
                    type = 'css';
                } else if (ext === '.js') {
                    type = 'javascript';
                }

                return {
                    name: file,
                    url: `http://localhost:5000/assets/${file}`,
                    type: type,
                    size: stats.size,
                    uploadDate: stats.birthtime
                };
            })
            .sort((a, b) => b.uploadDate - a.uploadDate); // Sort by upload date, newest first

        res.json(assets);
    } catch (error) {
        console.error('Error reading assets directory:', error);
        res.status(500).json({ error: 'Failed to read assets directory' });
    }
});

// POST /api/assets/upload - Upload multiple files
app.post('/api/assets/upload', upload.array('files', 10), (req, res) => {
    console.log('Multiple files upload request received:', req.files);
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const assetsDir = path.join(__dirname, 'public', 'assets');
    
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    const uploadedFiles = [];
    const errors = [];

    try {
        req.files.forEach((file, index) => {
            const fileExtension = path.extname(file.originalname) || '.jpg';
            const baseName = path.basename(file.originalname, fileExtension) || `file_${Date.now()}_${index}`;
            const safeFileName = `${baseName}${fileExtension}`.replace(/[^a-zA-Z0-9._-]/g, '_');
            const newPath = path.join(assetsDir, safeFileName);

            try {
                fs.renameSync(file.path, newPath);
                const assetUrl = `http://localhost:5000/assets/${safeFileName}`;
                
                uploadedFiles.push({
                    success: true,
                    url: assetUrl,
                    filename: safeFileName,
                    originalName: file.originalname,
                    size: file.size
                });
            } catch (error) {
                console.error(`Error moving file ${file.originalname}:`, error);
                errors.push({
                    filename: file.originalname,
                    error: error.message
                });
                
                // Clean up temporary file if it still exists
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        });

        if (uploadedFiles.length === 0) {
            return res.status(500).json({ 
                error: 'Failed to upload any files',
                details: errors 
            });
        }

        res.json({
            success: true,
            uploadedFiles: uploadedFiles,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully uploaded ${uploadedFiles.length} file(s)${errors.length > 0 ? ` with ${errors.length} error(s)` : ''}`
        });

    } catch (error) {
        console.error('Error during file upload:', error);
        
        // Clean up any temporary files
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        
        res.status(500).json({ 
            error: 'Failed to upload files',
            details: error.message 
        });
    }
});

app.post('/api/assets/url', async (req, res) => {
    const { url } = req.body;
    
    if (!url || !url.trim()) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log('Downloading image from URL:', url);
        
        // Import axios dynamically if not already imported
        
        
        const response = await axios.get(url, {
            responseType: 'stream',
            timeout: 30000, // 30 second timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Get content type and determine file extension
        const contentType = response.headers['content-type'];
        let fileExtension = '.jpg'; // default
        
        if (contentType) {
            if (contentType.includes('png')) fileExtension = '.png';
            else if (contentType.includes('gif')) fileExtension = '.gif';
            else if (contentType.includes('webp')) fileExtension = '.webp';
            else if (contentType.includes('svg')) fileExtension = '.svg';
        }

        // Generate filename
        const urlParts = new URL(url);
        const originalName = path.basename(urlParts.pathname) || `image_${Date.now()}`;
        const baseName = path.basename(originalName, path.extname(originalName)) || `image_${Date.now()}`;
        const safeFileName = `${baseName}${fileExtension}`.replace(/[^a-zA-Z0-9._-]/g, '_');

        const assetsDir = path.join(__dirname, 'public', 'assets');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }

        const filePath = path.join(assetsDir, safeFileName);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
            const assetUrl = `http://localhost:5000/assets/${safeFileName}`;
            console.log('Image downloaded successfully:', assetUrl);
            
            res.json({
                success: true,
                url: assetUrl,
                filename: safeFileName,
                originalUrl: url,
                message: 'Image downloaded and saved successfully'
            });
        });

        writer.on('error', (error) => {
            console.error('Error writing file:', error);
            res.status(500).json({ 
                error: 'Failed to save downloaded image',
                details: error.message 
            });
        });

    } catch (error) {
        console.error('Error downloading image from URL:', error);
        
        let errorMessage = 'Failed to download image from URL';
        if (error.code === 'ENOTFOUND') {
            errorMessage = 'URL not found or network error';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Download timeout - URL took too long to respond';
        } else if (error.response && error.response.status) {
            errorMessage = `Server responded with status: ${error.response.status}`;
        }
        
        res.status(500).json({ 
            error: errorMessage,
            details: error.message 
        });
    }
});
app.delete('/api/assets/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'public', 'assets', filename);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    try {
        fs.unlinkSync(filePath);
        res.json({ 
            success: true, 
            message: 'File deleted successfully',
            filename: filename 
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ 
            error: 'Failed to delete file',
            details: error.message 
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
    console.log(`Templates available at: http://localhost:${PORT}/templates/`);
    console.log(`Edited sites available at: http://localhost:${PORT}/editedSites/`);
});