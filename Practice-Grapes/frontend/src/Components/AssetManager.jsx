import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './AssetManager.css'

const BASE_URL = 'http://localhost:5000'

const AssetManager = () => {
  const [assets, setAssets] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState('upload')

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/assets`)
      setAssets(response.data)
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  const handleUpload = async () => {
    try {
      setUploading(true)

      if (uploadMode === 'upload' && selectedFile?.length > 0) {
        const formData = new FormData()
        for (let i = 0; i < selectedFile.length; i++) {
          formData.append('files', selectedFile[i])
        }

        await axios.post(`${BASE_URL}/api/assets/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      } else if (uploadMode === 'url' && imageUrl.trim() !== '') {
        await axios.post(`${BASE_URL}/api/assets/url`, { url: imageUrl })
      }

      await fetchAssets()
      setSelectedFile(null)
      setImageUrl('')
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${BASE_URL}/api/assets/${filename}`)
      await fetchAssets()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div>
      <h1>AssetManager</h1>
      <p>Manage and upload images, css, js, or other web assets.</p>

      <div className="main-container">
        <select value={uploadMode} onChange={(e) => setUploadMode(e.target.value)}>
          <option value="upload">Local Images Upload</option>
          <option value="url">Paste the Image Link</option>
        </select>

        {uploadMode === 'upload' && (
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            onChange={(e) => setSelectedFile(e.target.files)}
          />
        )}

        {uploadMode === 'url' && (
          <>
            <p>Or Put the Url of the image</p>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
            />
          </>
        )}

        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        <hr />

        <h3>Uploaded Assets</h3>
        {assets.length === 0 ? (
          <p>No assets uploaded.</p>
        ) : (
          <div className="assets-list">
            {assets.map((asset, index) => (
              <div key={index} className="asset-item">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} className="asset-image" />
                ) : (
                  <span>{asset.name}</span>
                )}
                <button 
                  onClick={() => handleDelete(asset.name)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssetManager