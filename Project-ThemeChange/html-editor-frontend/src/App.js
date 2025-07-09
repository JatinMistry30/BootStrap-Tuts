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
      const editor = grapesjs.init({
        container: "#gjs",
        fromElement: true,
        storageManager: false,
        height: "90vh",
        width: "auto",
        plugins: ["gjs-blocks-basic"],
        pluginsOpts: {
          "gjs-blocks-basic": {},
        },

        styleManager: {
          sectors: [],
        },
  traitManager: {
    appendTo: ".traits-container", 
  },
        panels: {
          defaults: [
            {
              id: "basic-actions",
              el: ".panel__basic-actions",
              buttons: [
                {
                  id: "visibility",
                  active: true,
                  className: "btn-toggle-borders",
                  label: '<i class="fa fa-clone"></i>',
                  command: "sw-visibility",
                },
              ],
            },
            {
              id: "views",
              buttons: [
                {
                  id: "open-tm",
                  active: true,
                  label: "Traits",
                  command: "open-traits",
                  togglable: false,
                },
              ],
            },
          ],
        },

        canvas: {
          styles: [],
          scripts: [],
        },

        blockManager: {
          appendTo: "",
          blocks: [],
        },
        dragMode: "absolute",

        contextMenu: false,
      });
      editor.on("load", () => {
        editor.setComponents(templateContent);

        const panels = editor.Panels;

        try {
          panels.removeButton("views", "open-sm");
        } catch (e) {
          console.warn("Style manager button not found:", e);
        }

        try {
          panels.removeButton("options", "export-template");
        } catch (e) {
          console.warn("Export template button not found:", e);
        }

        try {
          panels.removeButton("views", "open-layers");
          panels.removeButton("views", "open-blocks");
        } catch (e) {
          console.warn("Additional buttons not found:", e);
        }

        setIsEditorReady(true);
      });

      editor.on("component:remove", () => {
        return false;
      });

      editor.on("component:clone", () => {
        return false;
      });

      editor.on("component:add", (component) => {
        if (!isEditorReady) {
          const type = component.get('type');
          if(type !== 'text' && type !== 'link') {
            component.set('draggable',false)
            component.set('editable',false)
          }

          component.set("copyable", false);
          component.set("removable", false);

          const toolbar = component.get("toolbar") || [];
          const filteredToolbar = toolbar.filter(
            (item) =>
              item.command !== "tlb-delete" &&
              item.command !== "tlb-clone" &&
              item.command !== "tlb-move"
          );
          component.set("toolbar", filteredToolbar);

          if(type === 'link'){
            component.set('traits', [
              {
                type: 'text',
                label: 'Link URL',
                name: 'href',
                placeholder: 'https://example.com',
              },
            ])
          }
        } else {
          component.remove();
          return false;
        }
      });

      editor.on("run:open-sm", () => {
        return false;
      });

      editor.on("component:drag:start", (component) => {
        return false;
      });

      editor.on("component:selected", (component) => {
        const toolbar = component.get("toolbar");
        const filteredToolbar = toolbar.filter(
          (item) =>
            item.command !== "tlb-delete" &&
            item.command !== "tlb-clone" &&
            item.command !== "tlb-move"
        );
        component.set("toolbar", filteredToolbar);
      });

      grapesRef.current = editor;
    }
  }, [templateContent]);

  useEffect(() => {
    return () => {
      if (grapesRef.current) {
        grapesRef.current.destroy();
        grapesRef.current = null;
      }
    };
  }, []);

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

        setIsEditorReady(false);
        setTemplateContent(data.content);
        setMessage("File uploaded successfully!");
      } else {
        setMessage("Error uploading file");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file");
    }
  };

  const saveTemplate = async () => {
    if (!grapesRef.current) return;

    try {
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

      const response = await axios.post(`${BASE_URL}/api/save`, {
        html: fullHtml,
      });

      const data = response.data;
      if (data.success) {
        setSiteUrl(data.siteUrl);
        setMessage("Template saved successfully!");
      } else {
        setMessage("Error saving template");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error saving template");
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

        setIsEditorReady(false);
        setTemplateContent(data.content);
        setMessage("Template loaded successfully!");
      } else {
        setMessage("No existing template found");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error loading template");
    }
  };

  return (
    <div className="App">
      <div className="editor-header">
        <h1>HTML Template Editor </h1>
        <div className="controls">
          <input
            type="file"
            accept=".html"
            onChange={handleFileChange}
            style={{ marginRight: "10px" }}
          />
          <button
            onClick={loadExistingTemplate}
            style={{ marginRight: "10px" }}
          >
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

      <div className="editor-wrapper">
        <div id="gjs"></div>
        <div className="panel__right">
          <div className="traits-container"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
