import React, { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "./App.css";
import axios from "axios";

const App = () => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [uploadedHtml, setUploadedHtml] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [pages, setPages] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [pageContents, setPageContents] = useState({});
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [availableLinks, setAvailableLinks] = useState([]);

  const generateProjectId = () => {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const htmlFiles = files.filter((f) => f.name.endsWith(".html"));
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));

    if (htmlFiles.length === 0) return alert("Please upload HTML files.");

    const newProjectId = generateProjectId();
    setProjectId(newProjectId);

    const newPageContents = {};
    const detectedPages = [];

    for (let htmlFile of htmlFiles) {
      const pageName = htmlFile.name.replace('.html', '');
      detectedPages.push(pageName);

      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = async (event) => {
          const rawHtml = event.target.result;
          const temp = document.createElement("div");
          temp.innerHTML = rawHtml;
          const imgs = temp.querySelectorAll("img");

          for (let img of imgs) {
            const name = img.getAttribute("src")?.split("/").pop();
            if (name) {
              img.setAttribute("src", `http://localhost:5000/sites/projects/${newProjectId}/assets/${name}`);
            }
          }

          newPageContents[pageName] = temp.innerHTML;
          resolve();
        };
        reader.readAsText(htmlFile);
      });
    }

    setPages(detectedPages);
    setPageContents(newPageContents);
    setCurrentPage(detectedPages[0] || "");

    const formData = new FormData();
    formData.append("pageContents", JSON.stringify(newPageContents));
    imageFiles.forEach((file) => formData.append("files", file));

    try {
      await axios.post("http://localhost:5000/api/save-project", formData, {
        headers: {
          "X-Project-Id": newProjectId,
        },
      });
      setUploadedHtml(newPageContents[detectedPages[0]] || "");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSave = async () => {
    if (!editorRef.current || !projectId) return;

    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();

    const updatedPageContents = { ...pageContents };
    updatedPageContents[currentPage] = html;

    const temp = document.createElement("div");
    temp.innerHTML = html;
    const imgs = temp.querySelectorAll("img");

    const formData = new FormData();
    formData.append("pageContents", JSON.stringify(updatedPageContents));
    formData.append("css", css);

    for (let img of imgs) {
      let src = img.getAttribute("src");
      if (!src) continue;

      try {
        let response;
        let name;

        if (src.startsWith("http") && !src.includes(`/projects/${projectId}/assets/`)) {
          response = await fetch(src);
          const blob = await response.blob();
          const extension = blob.type.split("/").pop() || "png";
          name = `ext-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
          const file = new File([blob], name, { type: blob.type });
          formData.append("files", file);
          img.setAttribute("src", `http://localhost:5000/sites/projects/${projectId}/assets/${name}`);
        } else if (src.startsWith("blob:") || src.startsWith("data:")) {
          response = await fetch(src);
          const blob = await response.blob();
          const extension = blob.type.split("/").pop() || "png";
          name = `blob-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;
          const file = new File([blob], name, { type: blob.type });
          formData.append("files", file);
          img.setAttribute("src", `http://localhost:5000/sites/projects/${projectId}/assets/${name}`);
        }
      } catch (err) {
        console.warn(`Failed to fetch image: ${src}`, err);
      }
    }

    updatedPageContents[currentPage] = temp.innerHTML;
    formData.set("pageContents", JSON.stringify(updatedPageContents));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/save-project",
        formData,
        {
          headers: {
            "X-Project-Id": projectId,
          },
        }
      );
      if (res.data.success) {
        setLiveUrl(res.data.url);
        setPageContents(updatedPageContents);
      }
    } catch (error) {
      alert("Failed to save project");
      console.error(error);
    }
  };

  const handlePageChange = (pageName) => {
    if (!editorRef.current) return;

    const currentHtml = editorRef.current.getHtml();
    const updatedPageContents = { ...pageContents };
    updatedPageContents[currentPage] = currentHtml;
    setPageContents(updatedPageContents);

    setCurrentPage(pageName);
    const pageContent = updatedPageContents[pageName] || "";
    editorRef.current.setComponents(pageContent);
  };

  const getBasicPageContent = (pageName) => {
    return `
      <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1>${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page</h1>
        <p>Welcome to the ${pageName} page. This is a basic template to get you started.</p>
        <div style="margin-top: 20px;">
          <h2>Section Title</h2>
          <p>Add your content here...</p>
        </div>
        <div style="margin-top: 20px;">
          <button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Call to Action
          </button>
        </div>
      </div>
    `;
  };

  const addNewPage = () => {
    const pageName = prompt("Enter page name:");
    if (pageName && !pages.includes(pageName)) {
      const newPages = [...pages, pageName];
      const basicContent = getBasicPageContent(pageName);
      const newPageContents = { ...pageContents, [pageName]: basicContent };
      
      setPages(newPages);
      setPageContents(newPageContents);
      
       setAvailableLinks(findLinksInCurrentPage());
      setShowLinkEditor(true);
    }
  };

  const findLinksInCurrentPage = () => {
    if (!editorRef.current) return [];
    
    const currentHtml = editorRef.current.getHtml();
    const temp = document.createElement("div");
    temp.innerHTML = currentHtml;
    const links = temp.querySelectorAll("a");
    
    return Array.from(links).map((link, index) => ({
      index,
      text: link.textContent,
      href: link.getAttribute("href") || "",
      element: link.outerHTML
    }));
  };

  const updateLinkInCurrentPage = (linkIndex, newHref, newText) => {
    if (!editorRef.current) return;
    
    const currentHtml = editorRef.current.getHtml();
    const temp = document.createElement("div");
    temp.innerHTML = currentHtml;
    const links = temp.querySelectorAll("a");
    
    if (links[linkIndex]) {
      links[linkIndex].setAttribute("href", newHref);
      if (newText) links[linkIndex].textContent = newText;
    }
    
    editorRef.current.setComponents(temp.innerHTML);
  };

  const LinkEditor = () => {
    const [editingLinks, setEditingLinks] = useState(
      availableLinks.map(link => ({ ...link, newHref: link.href, newText: link.text }))
    );

    const handleLinkUpdate = (index, field, value) => {
      setEditingLinks(prev => 
        prev.map((link, i) => 
          i === index ? { ...link, [field]: value } : link
        )
      );
    };

    const applyChanges = () => {
      editingLinks.forEach((link, index) => {
        if (link.newHref !== link.href || link.newText !== link.text) {
          updateLinkInCurrentPage(index, link.newHref, link.newText);
        }
      });
      setShowLinkEditor(false);
    };

    return (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3>Edit Links in Current Page</h3>
        <p>Update links to point to your new pages:</p>
        
        {editingLinks.map((link, index) => (
          <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee' }}>
            <div style={{ marginBottom: '5px' }}>
              <strong>Link Text:</strong>
              <input
                type="text"
                value={link.newText}
                onChange={(e) => handleLinkUpdate(index, 'newText', e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              />
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>Link URL:</strong>
              <select
                value={link.newHref}
                onChange={(e) => handleLinkUpdate(index, 'newHref', e.target.value)}
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              >
                <option value="">Select a page...</option>
                {pages.map(page => (
                  <option key={page} value={`${page}.html`}>{page}.html</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={applyChanges} style={{ marginRight: '10px', padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Apply Changes
          </button>
          <button onClick={() => setShowLinkEditor(false)} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadAssetsAndInitEditor = async () => {
      if (!uploadedHtml || !containerRef.current || !projectId) return;

      if (editorRef.current) editorRef.current.destroy();

      let assetList = [];
      try {
        const res = await axios.get(`http://localhost:5000/api/list-assets/${projectId}`);
        assetList = res.data.data;
      } catch (err) {
        console.error("Failed to load assets", err);
      }

      editorRef.current = grapesjs.init({
        container: containerRef.current,
        fromElement: false,
        height: "100vh",
        width: "100%",
        components: pageContents[currentPage] || "",
        storageManager: false,
        blockManager: false,
        styleManager: false,
        layerManager: false,
        selectorManager: false,
        deviceManager: false,

        assetManager: {
          upload: `http://localhost:5000/api/upload-asset/${projectId}`,
          uploadName: "files",
          headers: {
    "X-Project-Id": projectId,
  },
          autoAdd: true,
          assets: assetList,
        },

        panels: {
          defaults: [
            {
              id: "options",
              buttons: [
                {
                  id: "open-assets",
                  className: "fa fa-image",
                  command: "open-assets",
                  attributes: { title: "Open Asset Manager" },
                },
                {
                  id: "edit-links",
                  className: "fa fa-link",
                  command: () => {
                    setAvailableLinks(findLinksInCurrentPage());
                    setShowLinkEditor(true);
                  },
                  attributes: { title: "Edit Links" },
                },
              ],
            },
          ],
        },
      });
    };

    loadAssetsAndInitEditor();
  }, [uploadedHtml, projectId, currentPage]);

  return (
    <div>
      <div className="top-panel" style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <input
          type="file"
          accept=".html,image/*"
          multiple
          onChange={handleFileChange}
        />
        <button onClick={handleSave} style={{ marginLeft: "10px" }}>
          Save Project
        </button>
        <button onClick={addNewPage} style={{ marginLeft: "10px" }}>
          Add New Page
        </button>
        <button 
          onClick={() => {
            setAvailableLinks(findLinksInCurrentPage());
            setShowLinkEditor(true);
          }} 
          style={{ marginLeft: "10px" }}
        >
          Edit Links
        </button>
        {liveUrl && (
          <div style={{ marginTop: "10px" }}>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue" }}
            >
              Visit your live site
            </a>
          </div>
        )}
      </div>
      
      {pages.length > 0 && (
        <div className="page-tabs" style={{ padding: "10px", backgroundColor: "#f5f5f5" }}>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                marginRight: "10px",
                padding: "5px 15px",
                backgroundColor: currentPage === page ? "#007bff" : "#fff",
                color: currentPage === page ? "#fff" : "#000",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      
      <div id="editor" ref={containerRef}></div>
      
      {showLinkEditor && <LinkEditor />}
    </div>
  );
};

export default App;