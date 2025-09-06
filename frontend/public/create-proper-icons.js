#!/usr/bin/env node

const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1E40AF');
    gradient.addColorStop(0.5, '#059669');
    gradient.addColorStop(1, '#FF8C42');
    
    // Draw main circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 20, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 40, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Add text "J&K"
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size/8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('J&K', size/2, size/2 - size/12);
    
    // Add "CAREER" text
    ctx.font = `${size/16}px Arial`;
    ctx.fillText('CAREER', size/2, size/2 + size/16);
    ctx.fillText('NAVIGATOR', size/2, size/2 + size/8);
    
    return canvas.toBuffer('image/png');
}

// Fallback simple PNG creation if canvas is not available
function createSimplePNG(size) {
    // This creates a simple colored square as fallback
    const data = Buffer.alloc(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 30;     // R
        data[i + 1] = 130; // G  
        data[i + 2] = 246; // B
        data[i + 3] = 255; // A
    }
    
    // This is a simplified approach - in reality you'd need to create proper PNG structure
    // For now, let's create a minimal valid PNG
    const pngHeader = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    ]);
    
    // Create minimal PNG (placeholder)
    const minimal = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BAAMCAQHtFN0eAAAAAElFTkSuQmCC', 'base64');
    return minimal;
}

try {
    console.log('Creating icons...');
    
    // Try to create proper icons with canvas, fallback to simple PNG
    let icon192, icon512;
    
    try {
        icon192 = createIcon(192);
        icon512 = createIcon(512);
        console.log('✅ Created icons with canvas');
    } catch (err) {
        console.log('📝 Canvas not available, creating simple PNGs...');
        icon192 = createSimplePNG(192);
        icon512 = createSimplePNG(512);
    }
    
    fs.writeFileSync('icon-192.png', icon192);
    fs.writeFileSync('icon-512.png', icon512);
    
    console.log('✅ Icons created successfully!');
    console.log(`📁 icon-192.png: ${icon192.length} bytes`);
    console.log(`📁 icon-512.png: ${icon512.length} bytes`);
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
