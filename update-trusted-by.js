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

// Script and style to ensure are present
const requiredScripts = [
  'js/trusted-by.js'
];

const requiredStyles = [
  'css/trusted-by.css'
];

// Function to update a single HTML file
function updateHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Add trusted-by.js script if not present
    if (!content.includes('js/trusted-by.js')) {
      const scriptTag = '  <script src="js/trusted-by.js" defer></script>';
      
      // Try to insert before the closing head tag
      if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${scriptTag}\n</head>`);
        updated = true;
      } 
      // If no head tag, insert before the first script tag
      else if (content.includes('<script')) {
        content = content.replace('<script', `${scriptTag}\n<script`);
        updated = true;
      }
      // Last resort, add at the end of the body
      else if (content.includes('</body>')) {
        content = content.replace('</body>', `  ${scriptTag}\n</body>`);
        updated = true;
      }
    }

    // Add trusted-by.css if not present
    if (!content.includes('css/trusted-by.css')) {
      const styleTag = '  <link rel="stylesheet" href="css/trusted-by.css">';
      
      // Try to insert before the closing head tag
      if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${styleTag}\n</head>`);
        updated = true;
      } 
      // If no head tag, insert after the last stylesheet
      else if (content.includes('</style>')) {
        content = content.replace('</style>', '</style>\n' + styleTag);
        updated = true;
      }
    }

    // Save the file if it was updated
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all HTML files
console.log('Updating HTML files to ensure Trusted By section is included...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    updateHtmlFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log('\n✅ Update complete! The Trusted By section should now be visible on all pages.');
