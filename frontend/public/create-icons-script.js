// Icon creation script for J&K Career Navigator
const fs = require('fs');
const path = require('path');

// Simple PNG header for a minimal icon
function createSimplePNG(size, color = '#1E40AF') {
    // This creates a minimal PNG with solid color
    // In a real scenario, you'd use a proper image library like sharp or canvas
    
    // For now, let's create a simple SVG and convert it
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#059669;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#FF8C42;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="${size}" height="${size}" fill="white"/>
        
        <!-- Main circle -->
        <circle cx="${size/2}" cy="${size/2}" r="${size * 0.4}" fill="none" stroke="url(#grad)" stroke-width="${size * 0.02}"/>
        
        <!-- Inner circle -->
        <circle cx="${size/2}" cy="${size/2}" r="${size * 0.35}" fill="url(#grad)" opacity="0.1"/>
        
        <!-- J&K Text -->
        <text x="${size/2}" y="${size * 0.35}" text-anchor="middle" font-family="Arial, sans-serif" 
              font-size="${size * 0.15}" font-weight="bold" fill="url(#grad)">J&amp;K</text>
        
        <!-- Career text -->
        <text x="${size/2}" y="${size * 0.5}" text-anchor="middle" font-family="Arial, sans-serif" 
              font-size="${size * 0.08}" fill="#4B5563">CAREER</text>
              
        <!-- Navigator text -->
        <text x="${size/2}" y="${size * 0.62}" text-anchor="middle" font-family="Arial, sans-serif" 
              font-size="${size * 0.08}" fill="#4B5563">NAVIGATOR</text>
              
        <!-- Compass emoji -->
        <text x="${size/2}" y="${size * 0.75}" text-anchor="middle" font-family="Arial, sans-serif" 
              font-size="${size * 0.1}">🧭</text>
    </svg>`;
    
    return svgContent;
}

// Create SVG icons
const icon192 = createSimplePNG(192);
const icon512 = createSimplePNG(512);

// Save as SVG first (browsers can use SVG in manifest)
fs.writeFileSync(path.join(__dirname, 'icon-192.svg'), icon192);
fs.writeFileSync(path.join(__dirname, 'icon-512.svg'), icon512);

console.log('SVG icons created successfully!');
console.log('You can use online converters to convert SVG to PNG if needed.');
