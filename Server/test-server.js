const express = require('express');
const mongoose = require('mongoose');

// Test basic server functionality
console.log('Testing server configuration...');

// Check if environment variables are loaded
console.log('Environment check:');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('MONGO_URI:', process.env.MONGO_URI || 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Test MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ MongoDB connection successful');
      process.exit(0);
    })
    .catch(e => {
      console.error('❌ MongoDB connection failed:', e.message);
      process.exit(1);
    });
} else {
  console.log('❌ MONGO_URI not set');
  process.exit(1);
} 