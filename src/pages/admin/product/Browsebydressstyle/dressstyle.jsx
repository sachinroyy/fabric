import React, { useState, useEffect } from "react";
import api from "../../../../api/axios";
import { TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function BrowseStyleForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dressStyles, setDressStyles] = useState([]);
  const [loadingStyles, setLoadingStyles] = useState(true);
  const [error, setError] = useState("");

  // Fetch dress styles on component mount
  useEffect(() => {
    fetchDressStyles();
  }, []);

  const fetchDressStyles = async () => {
    try {
      const response = await api.get("https://fabricadmin.onrender.com/api/dressstyles");
      // Backend returns an array of dress styles
      setDressStyles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching dress styles:', err);
      toast.error('Failed to load dress styles');
    } finally {
      setLoadingStyles(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await api.post("/dressstyles", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Success: API returns created object with 201
      if (response.status === 201) {
        toast.success("Dress style added successfully!");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setImage(null);
        setPreview("");
        const input = document.getElementById('image-upload');
        if (input) input.value = '';
        // Refresh the list
        await fetchDressStyles();
      }
    } catch (err) {
      console.error('Error adding browse style:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to add dress style. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dress style?')) {
      try {
        await api.delete(`/dressstyles/${id}`);
        toast.success('Dress style deleted successfully');
        // Refresh the list
        await fetchDressStyles();
      } catch (err) {
        console.error('Error deleting dress style:', err);
        toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to delete dress style');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Dress Styles</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {preview && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
              <img 
                src={preview} 
                alt="Preview" 
                className="max-w-xs max-h-48 object-contain border border-gray-200 rounded" 
              />
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white font-medium ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Top Selling Product'}
          </button>
        </div>
      </form>

      {/* Dress Styles List */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Current Dress Styles</h2>
        {loadingStyles ? (
          <p>Loading dress styles...</p>
        ) : dressStyles.length === 0 ? (
          <p className="text-gray-500">No dress styles found. Add your first dress style above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dressStyles.map((style) => (
              <div key={style._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={style.image || 'https://via.placeholder.com/300'} 
                    alt={style.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleDelete(style._id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Delete dress style"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{style.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{style.description}</p>
                  <div className="mt-2 flex justify-end items-center">
                    <span className="text-sm text-gray-500">
                      Added: {style.createdAt ? new Date(style.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
