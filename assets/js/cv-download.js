/**
 * CV Download Handler
 * Fetches the latest CV PDF from Overleaf using the compile-overleaf module
 * 
 * To set up:
 * 1. Go to your Overleaf project
 * 2. Click "Share" in the top right
 * 3. Enable "Link Sharing" and copy the read token from the URL
 *    (e.g., if URL is https://overleaf.com/read/abc123xyz, the token is "abc123xyz")
 * 4. Replace 'YOUR_OVERLEAF_READ_TOKEN' below with your actual token
 */

(function() {
  console.log('CV Download: Script loaded');
  
  // Replace this with your Overleaf read token
  // Get it from your Overleaf project's shareable link
  const OVERLEAF_READ_TOKEN = 'wfxcvkkpztkk';

  // Check if token is configured
  if (OVERLEAF_READ_TOKEN === 'YOUR_OVERLEAF_READ_TOKEN') {
    console.warn('CV Download: Overleaf read token not configured. Please set OVERLEAF_READ_TOKEN in cv-download.js');
    return;
  }

  function findResumeLink() {
    // Try multiple selectors to find the Resume link
    const selectors = [
      'a[href="#resume"]',
      'a[href*="#resume"]',
      'a[href="/#resume"]',
      'a[href*="resume"]'
    ];
    
    for (const selector of selectors) {
      const link = document.querySelector(selector);
      if (link) {
        // Verify it's actually the Resume link by checking text content or icon
        const text = link.textContent.trim().toLowerCase();
        const hasResumeIcon = link.querySelector('i.fa-file-pdf');
        if (text.includes('resume') || hasResumeIcon) {
          console.log('CV Download: Found Resume link with selector:', selector);
          return link;
        }
      }
    }
    
    // Fallback: find by text content
    const allLinks = document.querySelectorAll('a');
    for (const link of allLinks) {
      const text = link.textContent.trim().toLowerCase();
      const href = link.getAttribute('href') || '';
      if ((text === 'resume' || text.includes('resume')) && href.includes('resume')) {
        console.log('CV Download: Found Resume link by text content');
        return link;
      }
    }
    
    return null;
  }

  function attachDownloadHandler() {
    const resumeLink = findResumeLink();
    
    if (!resumeLink) {
      console.warn('CV Download: Resume link not found. Retrying in 500ms...');
      // Retry after a short delay in case DOM isn't fully ready
      setTimeout(attachDownloadHandler, 500);
      return;
    }

    console.log('CV Download: Resume link found, attaching click handler');
    
    resumeLink.addEventListener('click', async (e) => {
      e.preventDefault(); // Prevent default navigation
      console.log('CV Download: Resume link clicked');
      
      const originalHTML = resumeLink.innerHTML;
      const originalTitle = resumeLink.title || '';
      
      // Show loading state
      resumeLink.style.opacity = '0.6';
      resumeLink.style.pointerEvents = 'none';
      resumeLink.title = 'Fetching CV...';
      
      // Try to find and update the icon if it exists
      const icon = resumeLink.querySelector('i');
      if (icon) {
        const originalIconClass = icon.className;
        icon.className = 'fas fa-spinner fa-spin';
      }

      try {
        console.log('CV Download: Fetching PDF from Overleaf...');
        // Import and use compile-overleaf module
        const { default: compileOverleaf } = await import('https://cdn.skypack.dev/compile-overleaf');
        
        // Compile and get PDF link
        const compiled = await compileOverleaf(OVERLEAF_READ_TOKEN);
        const pdfLink = compiled.link.pdf;
        console.log('CV Download: PDF link obtained:', pdfLink);

        // Trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfLink;
        downloadLink.download = 'Muhammad_Arham_CV.pdf';
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        console.log('CV Download: Download triggered');

        // Reset link state
        resumeLink.innerHTML = originalHTML;
        resumeLink.style.opacity = '1';
        resumeLink.style.pointerEvents = 'auto';
        resumeLink.title = originalTitle;
      } catch (error) {
        console.error('CV Download: Error downloading CV:', error);
        
        // Show error state
        if (icon) {
          icon.className = 'fas fa-exclamation-triangle';
        }
        resumeLink.title = 'Error downloading CV. Click to try again.';
        
        // Reset after 3 seconds
        setTimeout(() => {
          resumeLink.innerHTML = originalHTML;
          resumeLink.style.opacity = '1';
          resumeLink.style.pointerEvents = 'auto';
          resumeLink.title = originalTitle;
        }, 3000);

        // Show user-friendly error message
        alert('Failed to download CV. Please try again later or contact me directly.');
      }
    });
  }

  // Try to attach handler when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachDownloadHandler);
  } else {
    // DOM is already ready
    attachDownloadHandler();
  }
})();

