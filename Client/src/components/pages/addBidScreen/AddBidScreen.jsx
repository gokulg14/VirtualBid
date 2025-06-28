import React, { useState, useEffect } from 'react';
import {  
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign,  
  Calendar,
  Plus,
  Image,
  Save,
  Camera
} from 'lucide-react';
import './AddBidScreen.css';

const AddBidScreen = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        startingBid: '',
        imageUrl: '',
        status: 'upcoming'
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    imageUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    // Validate required fields
    if (!formData.title.trim()) {
      throw new Error('Property title is required');
    }
    if (!formData.description.trim()) {
      throw new Error('Description is required');
    }
    if (!formData.startTime) {
      throw new Error('Start date and time is required');
    }
    if (!formData.endTime) {
      throw new Error('End date and time is required');
    }
    if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
      throw new Error('Starting bid amount must be greater than 0');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login first');
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('startTime', formData.startTime);
    form.append('endTime', formData.endTime);
    form.append('startingBid', formData.startingBid);
    
    // Only append image if a file is selected
    const imageFile = document.getElementById('imageInput').files[0];
    if (imageFile) {
      form.append('image', imageFile);
    }

    const res = await fetch('http://localhost:3000/bid/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const data = await res.json();
    alert('Bid item added successfully!');
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      startingBid: '',
      imageUrl: '',
      status: 'upcoming'
    });
    setImagePreview(null);
  } catch (err) {
    console.error('Error submitting bid:', err);
    alert(err.message);
  } finally {
    setIsSubmitting(false);
  }
};



    return (
        <main className="mainContent">
            {/* Welcome Header */}
            <div className="welcomeHeader">
                <h2 className="welcomeTitle">Add New Auction Item</h2>
                <p className="welcomeDate">Today is {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </div>

            <div className="contentGrid">
                {/* Form Section */}
                <div className="formSection">
                    <h3 className="sectionTitle">
                        <Plus size={24} />
                        Auction Item Details
                    </h3>

                    <div className="form">
                        <div className="formGroup">
                            <label className="label">Property Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter property title"
                                className="input"
                                required
                            />
                        </div>

                        <div className="formGroup">
                            <label className="label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the property in detail..."
                                className="textarea"
                                required
                            />
                        </div>

                        <div className="formRow">
                            <div className="formGroup">
                                <label className="label">Start Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>
                            <div className="formGroup">
                                <label className="label">End Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="formRow">
                            <div className="formGroup">
                                <label className="label">Starting Bid Amount *</label>
                                <input
                                    type="number"
                                    name="startingBid"
                                    value={formData.startingBid}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="input"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="formGroup">
                                <label className="label">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="select"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="ended">Ended</option>
                                </select>
                            </div>
                        </div>

                        <div className="formGroup">
                            <label className="label">Property Image</label>
                            <div
                                className="imageUpload"
                                onClick={() => document.getElementById('imageInput').click()}
                            >
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <Camera size={48} color="#9ca3af" className="cameraIcon" />
                                <p className="uploadText">
                                    Click to upload property image
                                </p>
                                <p className="uploadSubtext">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="imagePreview" />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="submitButton"
                        >
                            {isSubmitting ? (
                                <>
                                    <Clock size={20} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Create Auction Item
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="sidePanel">
                    <div className="helpCard">
                        <h4 className="helpTitle">💡 Tips for Success</h4>
                        <ul className="helpList">
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Use high-quality, well-lit property photos</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Write detailed, accurate descriptions</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Set realistic starting bid amounts</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Allow sufficient time for bidding</span>
                            </li>
                            <li className="helpItem">
                                <CheckCircle className="helpIcon" />
                                <span>Double-check all information before submitting</span>
                            </li>
                        </ul>
                    </div>

                    <div className="helpCard">
                        <h4 className="helpTitle">📋 Required Information</h4>
                        <ul className="helpList">
                            <li className="helpItem">
                                <FileText className="helpIcon" />
                                <span>Property title and description</span>
                            </li>
                            <li className="helpItem">
                                <Calendar className="helpIcon" />
                                <span>Auction start and end times</span>
                            </li>
                            <li className="helpItem">
                                <DollarSign className="helpIcon" />
                                <span>Starting bid amount</span>
                            </li>
                            <li className="helpItem">
                                <Image className="helpIcon" />
                                <span>Property photos (optional)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AddBidScreen;