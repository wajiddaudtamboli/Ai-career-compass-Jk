const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a 192x192 canvas
const canvas = createCanvas(192, 192);
const ctx = canvas.getContext('2d');

// Clear canvas with white background
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 192, 192);

// Create gradient
const gradient = ctx.createLinearGradient(0, 0, 192, 192);
gradient.addColorStop(0, '#1E40AF');
gradient.addColorStop(0.5, '#059669');
gradient.addColorStop(1, '#FF8C42');

// Draw background circle with gradient
ctx.fillStyle = gradient;
ctx.globalAlpha = 0.1;
ctx.beginPath();
ctx.arc(96, 96, 85, 0, 2 * Math.PI);
ctx.fill();

// Draw border circle
ctx.globalAlpha = 1;
ctx.strokeStyle = gradient;
ctx.lineWidth = 4;
ctx.beginPath();
ctx.arc(96, 96, 75, 0, 2 * Math.PI);
ctx.stroke();

// Draw text
ctx.fillStyle = gradient;
ctx.font = 'bold 32px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('J&K', 96, 70);

ctx.font = '16px Arial, sans-serif';
ctx.fillStyle = '#4B5563';
ctx.fillText('CAREER', 96, 100);
ctx.fillText('NAVIGATOR', 96, 120);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('icon-192.png', buffer);

console.log('Icon created successfully!');
