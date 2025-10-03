// This script checks if placeholder images are accessible
// and creates a flag for the application to use local images instead

function checkPlaceholderImageAvailability() {
  const testImage = new Image();
  testImage.src = "/api/placeholder/10/10?_=" + new Date().getTime(); // Add timestamp to avoid cache
  
  return new Promise((resolve) => {
    testImage.onload = () => {
      localStorage.setItem('usePlaceholderAPI', 'true');
      resolve(true);
    };
    
    testImage.onerror = () => {
      localStorage.setItem('usePlaceholderAPI', 'false');
      resolve(false);
    };
    
    // Timeout after 3 seconds
    setTimeout(() => {
      if (!testImage.complete) {
        localStorage.setItem('usePlaceholderAPI', 'false');
        resolve(false);
      }
    }, 3000);
  });
}

// Run the check when the app starts
checkPlaceholderImageAvailability().then(isAvailable => {
  console.log('Placeholder API available:', isAvailable);
});