// Update all pages to match testimonials.html design
const fs = require('fs');
const path = require('path');

// List of pages to update
const pages = [
  'index.html',
  'about.html',
  'courses.html',
  'teachers.html',
  'events.html',
  'contact.html',
  'register.html'
];

// Read the testimonials.html as the template
const template = fs.readFileSync('testimonials.html', 'utf8');

// Extract the main content from each page and update it
pages.forEach(page => {
  try {
    const filePath = path.join(process.cwd(), page);
    
    // Skip if file doesn't exist
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${page} - file not found`);
      return;
    }
    
    // Read the page content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup
    fs.writeFileSync(`${filePath}.bak`, content, 'utf8');
    
    // Extract the main content (between <main> tags)
    const mainContentMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    
    if (mainContentMatch && mainContentMatch[1]) {
      const mainContent = mainContentMatch[1];
      
      // Create the new content with the template
      let newContent = template;
      
      // Replace the content in the template with the page's main content
      newContent = newContent.replace(
        /<div id="content">[\s\S]*?<\/div>/, 
        `<div id="content">\n${mainContent}\n    </div>`
      );
      
      // Update the title if it exists
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        newContent = newContent.replace(
          /<title>.*?<\/title>/i, 
          `<title>${titleMatch[1]}</title>`
        );
      }
      
      // Save the updated file
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${page}`);
    } else {
      console.log(`No main content found in ${page}`);
    }
  } catch (error) {
    console.error(`Error updating ${page}:`, error.message);
  }
});

console.log('Update complete! Backups were created with .bak extension.');
