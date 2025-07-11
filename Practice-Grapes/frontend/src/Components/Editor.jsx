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
      const response = await axios.get(`${BASE_URL}/api/template/${originalTemplateName}/assets`);
      const assets = response.data;
      
      if (editorRef.current && assets.length > 0) {
        const assetManager = editorRef.current.AssetManager;
        assets.forEach(asset => {
          assetManager.add(asset);
        });
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
            headers: {},
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

        editorRef.current.on("asset:upload:response", (response) => {
          const assetUrl = response.url;
          if (assetUrl) {
            editorRef.current.AssetManager.add({
              src: assetUrl,
              type: 'image',
              name: response.filename
            });
          }
        });

        editorRef.current.on("asset:upload:error", (error) => {
          console.error("Asset upload error:", error);
          alert("Failed to upload asset. Please try again.");
        });

        editorRef.current.on('component:update', () => {
          saveCurrentPageData();
        });

        editorRef.current.on('style:update', () => {
          saveCurrentPageData();
        });
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