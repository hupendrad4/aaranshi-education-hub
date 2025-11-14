const fs = require('fs');
const path = require('path');

// List of HTML files to update (excluding components and node_modules)
const htmlFiles = [
  'about.html',
  'contact.html',
  'courses.html',
  'events.html',
  'index.html',
  'register.html',
  'teachers.html',
  'testimonials.html'
];

// Template for the trusted by section HTML
const trustedBySection = `
  <!-- Trusted By Section -->
  <section id="trusted-by-section" class="py-5 bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 text-center">
          <h3 class="mb-4">Trusted by Top Scorers</h3>
          <div class="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-md-5">
            <div class="trusted-by-item">
              <div class="trusted-score">98%</div>
              <div class="trusted-text">Success Rate</div>
            </div>
            <div class="trusted-by-item">
              <div class="trusted-score">500+</div>
              <div class="trusted-text">Students Trained</div>
            </div>
            <div class="trusted-by-item">
              <div class="trusted-score">50+</div>
              <div class="trusted-text">Top Rankers</div>
            </div>
            <div class="trusted-by-item">
              <div class="trusted-score">10+</div>
              <div class="trusted-text">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

// Function to fix a single HTML file
function fixHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove any existing trusted-by section to avoid duplicates
    content = content.replace(/<!-- Trusted By Section -->[\s\S]*?<\/section>/g, '');
    
    // Add the trusted-by section after the first section in main
    if (content.includes('<main')) {
      // Insert after the first section in main
      content = content.replace(
        /(<main[^>]*>)([\s\S]*?)(<section[^>]*>.*?<\/section>)/s,
        `$1$2$3\n${trustedBySection}`
      );
      
      // If the above didn't match (no sections in main), add at the start of main
      if (!content.includes('Trusted by Top Scorers')) {
        content = content.replace(
          /(<main[^>]*>)/s,
          `$1\n${trustedBySection}\n`
        );
      }
    } else {
      // If no main tag, just add before the first section
      content = content.replace(
        /(<section[^>]*>)/,
        `${trustedBySection}\n$1`
      );
    }
    
    // Ensure the CSS is included in the head
    if (!content.includes('trusted-by.css')) {
      content = content.replace(
        '</head>',
        `  <link rel="stylesheet" href="css/trusted-by.css">\n</head>`
      );
    }
    
    // Ensure the JavaScript is included before the closing body tag
    if (!content.includes('trusted-by.js')) {
      content = content.replace(
        '</body>',
        `  <script src="js/trusted-by.js" defer></script>\n</body>`
      );
    }
    
    // Fix any duplicate HTML/HEAD/BODY tags
    content = content.replace(/<html[^>]*>.*?<html[^>]*>/is, '<html>');
    content = content.replace(/<head[^>]*>.*?<head[^>]*>/is, '<head>');
    content = content.replace(/<body[^>]*>.*?<body[^>]*>/is, '<body>');
    
    // Save the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all HTML files
console.log('Updating HTML files to include Trusted By section...\n');

let updatedCount = 0;
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    if (fixHtmlFile(filePath)) {
      updatedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log(`\n✅ Updated ${updatedCount} files. The Trusted By section should now be visible on all pages.`);
