import React, { useState, useRef, useEffect } from "react";
import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";
import axios from "axios";
import "./App.css";

const BASE_URL = "http://localhost:5000";

const App = () => {
  const [templateContent, setTemplateContent] = useState("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");
  const [message, setMessage] = useState("");
  const editorRef = useRef(null);
  const grapesRef = useRef(null);

  useEffect(() => {
    if (templateContent && !grapesRef.current) {
      grapesRef.current = grapesjs.init({
        container: "#gjs",
        fromElement: false,
        components: templateContent,
        style: "",
        storageManager: false,
        height: "90vh",
        width: "auto",
      });

      setIsEditorReady(true);
    }
  }, [templateContent]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("htmlFile", file);

    try {
      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      if (data.success) {
        if (grapesRef.current) {
          grapesRef.current.destroy();
          grapesRef.current = null;
        }

        setTemplateContent(data.content);
        setMessage(" File uploaded successfully!");
      } else {
        setMessage(" Error uploading file");
      }
    } catch (error) {
      console.error(error);
      setMessage(" Error uploading file");
    }
  };

  const saveTemplate = async () => {
    if (!grapesRef.current) return;

    const html = grapesRef.current.getHtml();
    const css = grapesRef.current.getCss();

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Edited Template</title>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    try {
      const response = await axios.post(`${BASE_URL}/api/save`, {
        html: fullHtml,
      });

      const data = response.data;
      if (data.success) {
        setSiteUrl(data.siteUrl);
        setMessage(" Template saved successfully!");
      } else {
        setMessage(" Error saving template");
      }
    } catch (error) {
      console.error(error);
      setMessage(" Error saving template");
    }
  };

  const loadExistingTemplate = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/template`);
      const data = response.data;

      if (response.status === 200 && data.content) {
        if (grapesRef.current) {
          grapesRef.current.destroy();
          grapesRef.current = null;
        }

        setTemplateContent(data.content);
        setMessage(" Template loaded successfully!");
      } else {
        setMessage(" No existing template found");
      }
    } catch (error) {
      console.error(error);
      setMessage(" Error loading template");
    }
  };

  return (
    <div className="App">
      <div className="editor-header">
        <h1>HTML Template Editor</h1>
        <div className="controls">
          <input
            type="file"
            accept=".html"
            onChange={handleFileChange}
            style={{ marginRight: "10px" }}
          />
          <button onClick={loadExistingTemplate} style={{ marginRight: "10px" }}>
            Load Existing Template
          </button>
          <button onClick={saveTemplate} disabled={!isEditorReady}>
            Save Template
          </button>
        </div>
        {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        {siteUrl && (
          <p>
            View your site:{" "}
            <a href={siteUrl} target="_blank" rel="noopener noreferrer">
              {siteUrl}
            </a>
          </p>
        )}
      </div>

      <div id="gjs"></div>
    </div>
  );
};

export default App;
