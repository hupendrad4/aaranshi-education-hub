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

function fixHtmlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check for duplicate HTML/HEAD tags
    if ((content.match(/<html[^>]*>/g) || []).length > 1 || 
        (content.match(/<head[^>]*>/g) || []).length > 1) {
      
      // Extract the proper head content
      const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      let headContent = '';
      if (headMatch) {
        headContent = headMatch[0];
        // Ensure trusted-by.css is in head
        if (!headContent.includes('trusted-by.css')) {
          headContent = headContent.replace('</head>', 
            '  <link rel="stylesheet" href="css/trusted-by.css">\n</head>');
        }
      }
      
      // Extract the body content
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let bodyContent = bodyMatch ? bodyMatch[0] : '';
      
      // Ensure trusted-by.js is included before closing body
      if (!content.includes('trusted-by.js')) {
        bodyContent = bodyContent.replace('</body>', 
          '  <script src="js/trusted-by.js" defer></script>\n</body>');
      }
      
      // Reconstruct the HTML
      content = `<!DOCTYPE html>
<html lang="en">
${headContent}
${bodyContent}
</html>`;
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed HTML structure: ${filePath}`);
      return true;
    }
    
    // If no duplicate tags, just ensure the scripts and styles are included
    let updated = false;
    
    // Add trusted-by.css if not present
    if (!content.includes('trusted-by.css')) {
      content = content.replace('</head>', 
        '  <link rel="stylesheet" href="css/trusted-by.css">\n</head>');
      updated = true;
    }
    
    // Add trusted-by.js if not present
    if (!content.includes('trusted-by.js')) {
      content = content.replace('</body>', 
        '  <script src="js/trusted-by.js" defer></script>\n</body>');
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated includes in: ${filePath}`);
      return true;
    }
    
    console.log(`ℹ️  No changes needed: ${filePath}`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all HTML files
console.log('Fixing HTML files to ensure proper structure and Trusted By section...\n');

let fixedCount = 0;
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    if (fixHtmlFile(filePath)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files. The Trusted By section should now be visible on all pages.`);
