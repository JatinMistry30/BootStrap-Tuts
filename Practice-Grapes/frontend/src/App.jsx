import React, { useState, useEffect } from "react";
import "./App.css";
import Editor from "./Components/Editor";
import axios from "axios";
import AssetManager from "./Components/AssetManager";

const BASE_URL = "http://localhost:5000";

const App = () => {
  const [currentSection, setCurrentSection] = useState("template");
  const [editData, setEditData] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [editedSites, setEditedSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesResponse, editedSitesResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/templates`),
          axios.get(`${BASE_URL}/api/edited-sites`),
        ]);

        setTemplates(templatesResponse.data);
        setEditedSites(editedSitesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshEditedSites = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/edited-sites`);
      setEditedSites(response.data);
    } catch (error) {
      console.error("Error refreshing edited sites:", error);
    }
  };

  if (editData) {
    return (
      <Editor
        templateData={editData}
        onBack={() => {
          setEditData(null);
          refreshEditedSites();
        }}
      />
    );
  }

  const TemplateCard = ({ template, isEdited = false }) => (
    <div className="template-card">
      <div className="iframe-wrapper">
        <iframe
          src={template.url}
          title={template.name}
          className="template-preview"
          style={{
            width: "1200px",
            height: "800px",
            transform: "scale(0.5)",
            transformOrigin: "0 0",
            border: "none",
          }}
        />
      </div>
      <div className="overlay">
        <h3>{template.name}</h3>
        <div className="pages-info">
          <p>Pages: {template.pages ? template.pages.length : 1}</p>
          <div className="pages-list">
            {template.pages &&
              template.pages.map((page) => (
                <span key={page.name} className="page-tag">
                  {page.name}
                </span>
              ))}
          </div>
        </div>
        <div className="card-actions">
          <button
            className="card-btn"
            onClick={() => window.open(template.url, "_blank")}
          >
            {isEdited ? "🔗 View Live Site" : "👁️ Preview"}
          </button>
          <button
            className="card-btn primary"
            onClick={() => setEditData(template)}
          >
            {isEdited ? "✏️ Edit Again" : "✏️ Edit This Template"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="left-row">
        <div
          className={`menu-item ${
            currentSection === "template" ? "active" : ""
          }`}
          onClick={() => setCurrentSection("template")}
        >
          Templates
        </div>
        <div
          className={`menu-item ${currentSection === "sites" ? "active" : ""}`}
          onClick={() => setCurrentSection("sites")}
        >
          Edited Sites
        </div>
        <div
          className={`menu-item ${currentSection === "asset" ? "active" : ""}`}
          onClick={() => setCurrentSection("asset")}
        >
          Asset Manager
        </div>
      </div>

      <div className="main-content">
        {currentSection === "template" ? (
          <>
            <h1>Templates</h1>
            <p>Select a template to edit and create your custom website</p>
            {loading ? (
              <p>Loading templates...</p>
            ) : (
              <div className="card-container">
                {templates.map((template, index) => (
                  <TemplateCard
                    key={index}
                    template={template}
                    isEdited={false}
                  />
                ))}
              </div>
            )}
          </>
        ) : currentSection === "sites" ? (
          <>
            <h1>Edited Sites</h1>
            <p>Your customized websites are available here</p>
            {loading ? (
              <p>Loading edited sites...</p>
            ) : editedSites.length === 0 ? (
              <div className="empty-state">
                <p>No edited sites yet. Start by editing a template!</p>
                <button
                  className="card-btn primary"
                  onClick={() => setCurrentSection("template")}
                >
                  Browse Templates
                </button>
              </div>
            ) : (
              <div className="card-container">
                {editedSites.map((site, index) => (
                  <TemplateCard key={index} template={site} isEdited={true} />
                ))}
              </div>
            )}
          </>
        ) : currentSection === "asset" ? (
          <AssetManager />
        ) : null}
      </div>
    </div>
  );
};

export default App;
