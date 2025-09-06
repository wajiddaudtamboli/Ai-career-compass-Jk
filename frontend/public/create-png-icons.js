const fs = require('fs');

// Minimal valid 192x192 PNG (blue square)
const png192Base64 = `iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAA1BMVEUAAACnej3aAAAAH0lEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAvg0hAAABgEzGgAAAAABJRU5ErkJggg==`;

// Minimal valid 512x512 PNG (blue square) 
const png512Base64 = `iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAMAAADDpiTIAAAAA1BMVEUAAACnej3aAAAASUlEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvg0hAAABeEzGgAAAAABJRU5ErkJggg==`;

try {
    // Write 192x192 PNG
    const icon192Buffer = Buffer.from(png192Base64, 'base64');
    fs.writeFileSync('./icon-192.png', icon192Buffer);
    console.log('✅ Created icon-192.png (192x192)');
    
    // Write 512x512 PNG  
    const icon512Buffer = Buffer.from(png512Base64, 'base64');
    fs.writeFileSync('./icon-512.png', icon512Buffer);
    console.log('✅ Created icon-512.png (512x512)');
    
    console.log('🎉 All PNG icons created successfully!');
    console.log('📁 Files created in current directory');
    
} catch (error) {
    console.error('❌ Error creating PNG icons:', error);
}
