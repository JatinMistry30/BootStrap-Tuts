import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import grapesjsPresetWebpage from "grapesjs-preset-webpage";
import "./Editor.css";
import axios from "axios";

const BASE_URL = 'http://localhost:5000'

const Editor = ({ templateData, onBack }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [currentPage, setCurrentPage] = useState('index');
  const [pages, setPages] = useState({});
  const [availablePages, setAvailablePages] = useState([]);
  const [originalTemplateName, setOriginalTemplateName] = useState('');

  useEffect(() => {
    const nameFromUrl = templateData.name || 'template';
    const timestamp = Date.now();
    const editedName = `edited_${nameFromUrl}_${timestamp}`;
    setTemplateName(editedName);
    setOriginalTemplateName(nameFromUrl);
    setAvailablePages(templateData.pages || []);
    
    const initialPages = {};
    (templateData.pages || []).forEach(page => {
      initialPages[page.name] = {
        html: '',
        css: ''
      };
    });
    setPages(initialPages);
    
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [templateData]);

  const loadAssets = async () => {
    try {
      const templateAssetsResponse = await axios.get(`${BASE_URL}/api/template/${originalTemplateName}/assets`);
      const templateAssets = templateAssetsResponse.data;
      
      const globalAssetsResponse = await axios.get(`${BASE_URL}/api/assets`);
      const globalAssets = globalAssetsResponse.data;
      
      
      
      if (editorRef.current) {
        const assetManager = editorRef.current.AssetManager;
        
        assetManager.getAll().reset();
        
        if (templateAssets && templateAssets.length > 0) {
          templateAssets.forEach(asset => {

            assetManager.add({
              src: asset.src || asset.url,
              type: asset.type || 'image',
              name: asset.name || asset.filename,
              category: 'Template Assets'
            });
          });
        }
        
        if (globalAssets && globalAssets.length > 0) {
          globalAssets.forEach(asset => {

            const formattedAsset = {
              src: asset.url || asset.src,
              type: asset.type || 'image',
              name: asset.name || asset.filename || 'Asset',
              category: 'My Assets'
            };
            if (formattedAsset.src) {
              assetManager.add(formattedAsset);
            }
          });
        }
        
        console.log('Total assets loaded:', assetManager.getAll().length);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const handleEditClick = async () => {
    setIsEditing(true);
    await loadPageContent(currentPage);
  };

  const loadPageContent = async (pageName) => {
    try {
      const pageData = availablePages.find(p => p.name === pageName);
      if (!pageData) return;

      const response = await fetch(pageData.url);
      const html = await response.text();

      if (!editorRef.current) {
        editorRef.current = grapesjs.init({
          container: containerRef.current,
          fromElement: true,
          height: "100%",
          width: "auto",
          storageManager: false,
          assetManager: {
            uploadText: "Drop files here or click to upload",
            uploadName: "file",
            upload: `${BASE_URL}/api/upload-asset`,
            headers: {},
            params: {
              templateName: templateName
            },
            autoUpload: true,
            multiUpload: true,
            dropzone: 1,
            openAssetsOnDrop: 1,
            dropzoneContent: "Drop files here to upload",
            modalTitle: "Asset Manager",
            addBtnText: "Add Asset",
            searchPlaceholder: "Search assets...",
            showUrlInput: true,
            categories: [
              {
                id: 'template',
                label: 'Template Assets'
              },
              {
                id: 'myassets',
                label: 'My Assets'
              }
            ],
            customUpload: async (files, options) => {
              const formData = new FormData();
              for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
              }
              
              try {
                const response = await axios.post(`${BASE_URL}/api/assets/upload`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                
                await loadAssets();
                
                return response.data;
              } catch (error) {
                console.error('Upload error:', error);
                throw error;
              }
            },
          },
          plugins: [grapesjsPresetWebpage],
          pluginsOpts: {
            grapesjsPresetWebpage: {
              blocks: [
                "column1",
                "column2",
                "column3",
                "text",
                "link",
                "image",
                "video",
              ],
            },
          },
          canvas: {
            styles: [],
          },
        });

        await loadAssets();

        editorRef.current.on("asset:upload:response", async (response) => {
          const assetUrl = response.url;
          if (assetUrl) {

            editorRef.current.AssetManager.add({
              src: assetUrl,
              type: response.type || 'image',
              name: response.filename || response.name,
              category: 'Template Assets'
            });
            
            setTimeout(async () => {
              await loadAssets();
            }, 1000);
          }
        });

        editorRef.current.on("asset:upload:error", (error) => {
          console.error("Asset upload error:", error);
          alert("Failed to upload asset. Please try again.");
        });

        editorRef.current.on('asset:open', async () => {
          console.log('Asset manager opened, refreshing assets...');
          await loadAssets();
        });

        editorRef.current.on('load', () => {
          const assetManager = editorRef.current.AssetManager;
          
          setTimeout(() => {
            const assetContainer = document.querySelector('.gjs-am-assets-cont');
            const assetHeader = document.querySelector('.gjs-am-assets-header');
            
            if (assetHeader && !document.querySelector('.custom-asset-controls')) {
              const controlsDiv = document.createElement('div');
              controlsDiv.className = 'custom-asset-controls';
              controlsDiv.style.cssText = 'padding: 10px; border-bottom: 1px solid #ddd; display: flex; gap: 10px;';
              
              const refreshButton = document.createElement('button');
              refreshButton.innerHTML = '🔄 Refresh Assets';
              refreshButton.className = 'gjs-btn-prim refresh-assets-btn';
              refreshButton.onclick = async () => {
                console.log('Manual refresh triggered');
                await loadAssets();
              };
              
              const manageButton = document.createElement('button');
              manageButton.innerHTML = '📁 Manage Assets';
              manageButton.className = 'gjs-btn-prim manage-assets-btn';
              manageButton.onclick = () => {
                window.open('/asset-manager', '_blank');
              };
              
              controlsDiv.appendChild(refreshButton);
              controlsDiv.appendChild(manageButton);
              assetHeader.appendChild(controlsDiv);
            }
          }, 500);
        });

        editorRef.current.on('component:update', () => {
          saveCurrentPageData();
        });

        editorRef.current.on('style:update', () => {
          saveCurrentPageData();
        });

        // Add periodic refresh of assets to keep them in sync
        const assetRefreshInterval = setInterval(async () => {
          if (editorRef.current) {
            await loadAssets();
          }
        }, 30000); // Refresh every 30 seconds

        // Store interval reference for cleanup
        editorRef.current.assetRefreshInterval = assetRefreshInterval;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bodyContent = doc.body.innerHTML;
      
      editorRef.current.setComponents(bodyContent);
      
      const styleElements = doc.querySelectorAll('style');
      let combinedCss = '';
      styleElements.forEach(style => {
        combinedCss += style.innerHTML + '\n';
      });
      
      const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
      for (const link of linkElements) {
        if (link.href && !link.href.includes('style.css')) {
          try {
            const cssResponse = await fetch(link.href);
            const cssText = await cssResponse.text();
            combinedCss += cssText + '\n';
          } catch (error) {
            console.error('Error loading CSS:', error);
          }
        }
      }
      
      if (combinedCss) {
        editorRef.current.setStyle(combinedCss);
      }

      setPages(prev => ({
        ...prev,
        [pageName]: {
          html: bodyContent,
          css: combinedCss
        }
      }));

    } catch (error) {
      console.error("Error loading page content:", error);
      alert("Failed to load page content. Please try again.");
    }
  };

  const saveCurrentPageData = () => {
    if (!editorRef.current) return;
    
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    
    setPages(prev => ({
      ...prev,
      [currentPage]: {
        html,
        css
      }
    }));
  };

  const handlePageChange = async (pageName) => {
    if (editorRef.current) {
      saveCurrentPageData();
    }
    
    setCurrentPage(pageName);
    
    if (editorRef.current) {
      await loadPageContent(pageName);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;

    saveCurrentPageData();

    try {
      const formData = new FormData();
      formData.append('pages', JSON.stringify(pages));
      formData.append('templateName', templateName);
      formData.append('originalTemplateName', originalTemplateName);

      const response = await axios.post(`${BASE_URL}/api/save-template`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setPublishedUrl(response.data.url);
        alert('Template saved and published successfully!');
        
        setTimeout(() => {
          window.open(response.data.url, '_blank');
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  };

  const addNewPage = () => {
    const pageName = prompt('Enter page name:');
    if (pageName && !availablePages.find(p => p.name === pageName)) {
      const newPage = {
        name: pageName,
        url: `${templateData.url.replace('index.html', pageName + '.html')}`
      };
      
      setAvailablePages(prev => [...prev, newPage]);
      setPages(prev => ({
        ...prev,
        [pageName]: {
          html: '<div>New page content</div>',
          css: ''
        }
      }));
    }
  };

  const refreshAssets = async () => {
    if (editorRef.current) {
      await loadAssets();
    }
  };

  useEffect(() => {
    return () => {
      if (editorRef.current && editorRef.current.assetRefreshInterval) {
        clearInterval(editorRef.current.assetRefreshInterval);
      }
    };
  }, []);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        {!isEditing ? (
          <button className="edit-button" onClick={handleEditClick}>
            ✏️ Edit Website
          </button>
        ) : (
          <div className="editor-controls">
            <div className="page-selector">
              <select 
                value={currentPage} 
                onChange={(e) => handlePageChange(e.target.value)}
                className="page-select"
              >
                {availablePages.map(page => (
                  <option key={page.name} value={page.name}>
                    {page.name}
                  </option>
                ))}
              </select>
              <button className="add-page-button" onClick={addNewPage}>
                + Add Page
              </button>
            </div>
            <button className="refresh-assets-button" onClick={refreshAssets}>
              🔄 Refresh Assets
            </button>
            <button className="save-button" onClick={handleSave}>
              💾 Save & Publish
            </button>
            {publishedUrl && (
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-button"
              >
                🔗 View Published Site
              </a>
            )}
          </div>
        )}
      </div>

      <div className="editor-info">
        <p>Editing: {templateName}</p>
        {isEditing && <p>Current Page: {currentPage}</p>}
        {publishedUrl && (
          <p>Published at: <a href={publishedUrl} target="_blank" rel="noopener noreferrer">{publishedUrl}</a></p>
        )}
      </div>

      {!isEditing ? (
        <iframe
          src={templateData.url}
          title="Editor View"
          className="editor-iframe"
        />
      ) : (
        <div ref={containerRef} className="grapesjs-container"></div>
      )}
    </div>
  );
};

export default Editor;