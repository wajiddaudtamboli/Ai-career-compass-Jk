const fs = require('fs');

// Create a minimal valid PNG file (192x192, transparent)
function createPNG(width, height) {
    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    
    // IHDR chunk
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);     // Width
    ihdrData.writeUInt32BE(height, 4);    // Height
    ihdrData[8] = 8;                      // Bit depth
    ihdrData[9] = 6;                      // Color type (RGBA)
    ihdrData[10] = 0;                     // Compression method
    ihdrData[11] = 0;                     // Filter method
    ihdrData[12] = 0;                     // Interlace method
    
    const ihdrLength = Buffer.alloc(4);
    ihdrLength.writeUInt32BE(13, 0);
    const ihdrType = Buffer.from('IHDR');
    const ihdrCrc = calculateCRC(Buffer.concat([ihdrType, ihdrData]));
    
    // Create a simple blue square with J&K text effect
    const bytesPerPixel = 4; // RGBA
    const scanlineSize = 1 + (width * bytesPerPixel); // 1 byte filter + pixel data
    const imageDataSize = height * scanlineSize;
    const imageData = Buffer.alloc(imageDataSize);
    
    // Fill with blue gradient and add simple pattern
    for (let y = 0; y < height; y++) {
        const scanlineOffset = y * scanlineSize;
        imageData[scanlineOffset] = 0; // Filter byte (None)
        
        for (let x = 0; x < width; x++) {
            const pixelOffset = scanlineOffset + 1 + (x * bytesPerPixel);
            
            // Create a simple blue gradient with center highlight
            const centerX = width / 2;
            const centerY = height / 2;
            const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
            const intensity = 1 - (distanceFromCenter / maxDistance);
            
            // Blue gradient
            imageData[pixelOffset] = Math.floor(30 + intensity * 100);     // R
            imageData[pixelOffset + 1] = Math.floor(130 + intensity * 100); // G
            imageData[pixelOffset + 2] = Math.floor(200 + intensity * 55);  // B
            imageData[pixelOffset + 3] = 255;                               // A
        }
    }
    
    // Compress the image data (simplified)
    const compressed = require('zlib').deflateSync(imageData);
    
    const idatLength = Buffer.alloc(4);
    idatLength.writeUInt32BE(compressed.length, 0);
    const idatType = Buffer.from('IDAT');
    const idatCrc = calculateCRC(Buffer.concat([idatType, compressed]));
    
    // IEND chunk
    const iendLength = Buffer.alloc(4);
    iendLength.writeUInt32BE(0, 0);
    const iendType = Buffer.from('IEND');
    const iendCrc = calculateCRC(iendType);
    
    return Buffer.concat([
        signature,
        ihdrLength, ihdrType, ihdrData, ihdrCrc,
        idatLength, idatType, compressed, idatCrc,
        iendLength, iendType, iendCrc
    ]);
}

function calculateCRC(data) {
    const crcTable = [];
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        crcTable[i] = c;
    }
    
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    
    const result = Buffer.alloc(4);
    result.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0, 0);
    return result;
}

// Generate icons
try {
    const icon192 = createPNG(192, 192);
    const icon512 = createPNG(512, 512);
    
    fs.writeFileSync('icon-192.png', icon192);
    fs.writeFileSync('icon-512.png', icon512);
    
    console.log('✅ PNG icons created successfully!');
    console.log('📁 icon-192.png:', icon192.length, 'bytes');
    console.log('📁 icon-512.png:', icon512.length, 'bytes');
} catch (error) {
    console.error('❌ Error creating icons:', error.message);
}
