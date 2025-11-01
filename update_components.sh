#!/bin/bash

# Array of HTML files to update
HTML_FILES=(
  "about.html"
  "contact.html"
  "courses.html"
  "events.html"
  "index.html"
  "register.html"
  "teachers.html"
  "testimonials.html"
)

# Create backup directory if it doesn't exist
mkdir -p backup

# Current date for backup files
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# First, update index.html with the new structure
# (We already did this manually, but this ensures it's consistent)

# Now update all other HTML files
for file in "${HTML_FILES[@]}"; do
  if [ -f "$file" ] && [ "$file" != "index.html" ]; then
    # Create backup
    cp "$file" "backup/${file%.*}_${TIMESTAMP}.html"
    
    # Get the page title
    TITLE=$(grep -o '<title>.*</title>' "$file" | sed -e 's/<title>\(.*\)<\/title>/\1/')
    
    # Create a temporary file for the new content
    TMP_FILE=$(mktemp)
    
    # Add the new header
    cat > "$TMP_FILE" << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$TITLE</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
    <!-- Animate CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
  <!-- Loading Screen -->
  <div class="loading" id="loading">
    <div class="spinner"></div>
  </div>
  
  <!-- Back to Top Button -->
  <a href="#" id="back-to-top" class="back-to-top">
    <i class="fas fa-arrow-up"></i>
  </a>

  <!-- Load Header -->
  <div id="header"></div>

  <!-- Main Content -->
  <main>
EOL

    # Get the content between the header and footer
    CONTENT=$(sed -n '/<main>/,/<\/main>/p' "$file" | sed '1d;$d')
    
    # If no <main> tag was found, try to get the content between <body> and the first footer
    if [ -z "$CONTENT" ]; then
      CONTENT=$(sed -n '/<body>/,/<footer/p' "$file" | sed '1d;$d' | head -n -1)
    fi
    
    # If still no content, just get everything between <body> and </body>
    if [ -z "$CONTENT" ]; then
      CONTENT=$(sed -n '/<body>/,/<\/body>/p' "$file" | sed '1d;$d')
    fi
    
    # Add the content
    echo "$CONTENT" >> "$TMP_FILE"
    
    # Add the footer and scripts
    cat >> "$TMP_FILE" << 'EOL'
  </main>

  <!-- Load Footer -->
  <div id="footer"></div>

  <!-- Scripts -->
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="js/wow.min.js"></script>
  <script src="js/script.js"></script>
  
  <!-- Load Common Components -->
  <script>
    $(function(){
      $("#header").load("components/header.html");
      $("#footer").load("components/footer.html");
    });
  </script>
</body>
</html>
EOL

    # Replace the original file
    mv "$TMP_FILE" "$file"
    echo "Updated: $file"
  fi
done

echo "All HTML files have been updated with the common header and footer."
echo "Original files have been backed up to the 'backup' directory."
