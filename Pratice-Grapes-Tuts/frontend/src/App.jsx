import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const BASE_URL = 'http://localhost:3000';

const App = () => {
  const [container, setContainer] = useState('upload');
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [zipStructure, setZipStructure] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/projects`);
      setProjects(response.data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    // Fetch projects when component mounts (website loads)
    fetchProjects();
  }, []);

  useEffect(() => {
    if (container === 'assets') {
      fetchProjects();
    }
  }, [container]);

  const analyzeZipStructure = async (file) => {
    if (!file) return;

    const JSZip = await import('jszip');
    const zip = new JSZip.default();
    
    try {
      const contents = await zip.loadAsync(file);
      const structure = {
        topLevelFolders: new Set(),
        rootFiles: [],
        assetFiles: [],
        allFiles: []
      };

      Object.keys(contents.files).forEach(path => {
        const file = contents.files[path];
        if (file.dir) return;

        const parts = path.split('/').filter(p => p);
        structure.allFiles.push(path);

        if (parts.length > 1) {
          structure.topLevelFolders.add(parts[0]);
        }

        const isRootFile = parts.length === 2 && /\.(html|css|js)$/i.test(parts[1]);
        if (isRootFile) {
          structure.rootFiles.push(path);
        }

        const isAssetFile = parts.length > 2 && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(parts[parts.length - 1]);
        if (isAssetFile) {
          structure.assetFiles.push(path);
        }
      });

      setZipStructure(structure);
    } catch (err) {
      console.error('Error analyzing ZIP:', err);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setZipFile(file);
    setError(null);
    setSuccess(null);
    setZipStructure(null);
    
    if (file) {
      analyzeZipStructure(file);
    }
  };

  const onSubmitFile = async () => {
    if (!zipFile) {
      setError('Please select a zip file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('zipFile', zipFile);

    try {
      const response = await axios.post(`${BASE_URL}/api/save-content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Upload successful!');
      setZipFile(null);
      setZipStructure(null);
      
      // Refresh the projects list after successful upload
      fetchProjects();
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const getValidationIssues = () => {
    if (!zipStructure) return [];
    
    const issues = [];
    
    if (zipStructure.topLevelFolders.size !== 1) {
      issues.push(`❌ Found ${zipStructure.topLevelFolders.size} top-level folders, need exactly 1`);
    } else {
      issues.push(`✅ Single top-level folder: ${[...zipStructure.topLevelFolders][0]}`);
    }
    
    if (zipStructure.rootFiles.length === 0) {
      issues.push('❌ No HTML/CSS/JS files found in root folder');
    } else {
      issues.push(`✅ Found ${zipStructure.rootFiles.length} root files`);
    }
    
    if (zipStructure.assetFiles.length === 0) {
      issues.push('❌ No image files found in subfolders');
    } else {
      issues.push(`✅ Found ${zipStructure.assetFiles.length} asset files`);
    }
    
    return issues;
  };

  // Helper function to get the proper project URL
  const getProjectUrl = (project) => {
    if (project.htmlFile) {
      return `${BASE_URL}/api/projects/${project.id}/${project.htmlFile}`;
    }
    return `${BASE_URL}/api/projects/${project.id}`;
  };

  return (
    <div className="main-container">
      <div className="left-row-menu">
        <button onClick={() => setContainer('upload')}>Upload</button>
        <button onClick={() => setContainer('assets')}>Asset Libraries</button>
      </div>

      {container === 'upload' && (
        <div className="upload-section">
          <h2>Upload ZIP File</h2>
          
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <strong>Success:</strong> {success}
            </div>
          )}
          
          <div className="file-input-section">
            <input
              type="file"
              accept=".zip"
              onChange={onFileChange}
              disabled={loading}
            />
          </div>

          {zipStructure && (
            <div className="structure-analysis">
              <h3>ZIP Structure Analysis</h3>
              <div className="validation-results">
                {getValidationIssues().map((issue, index) => (
                  <div key={index} className="validation-item">{issue}</div>
                ))}
              </div>
              
              <div className="structure-display">
                <div className="structure-column">
                  <h4>Your ZIP Structure:</h4>
                  <div className="file-tree">
                    {zipStructure.allFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="structure-column">
                  <h4>Expected Structure:</h4>
                  <div className="file-tree expected">
                    <div className="file-item">project-folder/</div>
                    <div className="file-item">├── index.html</div>
                    <div className="file-item">├── styles.css</div>
                    <div className="file-item">├── script.js</div>
                    <div className="file-item">└── images/</div>
                    <div className="file-item">&nbsp;&nbsp;&nbsp;&nbsp;├── logo.png</div>
                    <div className="file-item">&nbsp;&nbsp;&nbsp;&nbsp;└── background.jpg</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onSubmitFile}
            disabled={!zipFile || loading}
            className={!zipFile || loading ? 'button-disabled' : 'button-enabled'}
          >
            {loading ? 'Uploading...' : 'Submit File'}
          </button>

          {projects.length > 0 && (
            <div className="template-gallery">
              <h3>Your Website Templates</h3>
              <div className="template-grid">
                {projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="template-card">
                    <div className="template-preview">
                      <iframe
                        src={getProjectUrl(proj)}
                        title={proj.name}
                        className="template-iframe"
                        sandbox="allow-scripts allow-same-origin"
                      />
                      <div className="template-overlay">
                        <div className="overlay-content">
                          <button 
                            className="preview-btn"
                            onClick={() => window.open(getProjectUrl(proj), '_blank')}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            Preview
                          </button>
                          <button 
                            className="open-btn"
                            onClick={() => window.open(getProjectUrl(proj), '_blank')}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15,3 21,3 21,9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Open in New Tab
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="template-info">
                      <div className="template-header">
                        <h4 className="template-name">{proj.name}</h4>
                        {proj.hasAssets && (
                          <span className="asset-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                            </svg>
                            Assets
                          </span>
                        )}
                      </div>
                      <p className="template-date">
                        Created: {new Date(proj.createdAt).toLocaleDateString()}
                      </p>
                      <div className="template-stats">
                        <span className="stat-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="16,18 22,12 16,6"/>
                            <polyline points="8,6 2,12 8,18"/>
                          </svg>
                          {proj.htmlFile || 'Web Project'}
                        </span>
                        <span className="stat-item free-badge">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          Free
                        </span>
                      </div>
                      <p className="template-url">
                        URL: /api/projects/{proj.id}/{proj.htmlFile || 'index.html'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {container === 'assets' && (
        <div className="assets-section">
          <h2>Asset Libraries</h2>
          <p>Asset library management coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default App;