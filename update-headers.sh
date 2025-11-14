#!/bin/bash

# List of all HTML files to update
FILES=(
  "index.html"
  "about.html"
  "courses.html"
  "teachers.html"
  "testimonials.html"
  "events.html"
  "contact.html"
  "register.html"
)

# Add header to each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    
    # Create a temporary file
    TMP_FILE=$(mktemp)
    
    # Copy everything before the closing head tag
    sed -n '1,/</head>/p' "$file" | head -n -1 > "$TMP_FILE"
    
    # Add jQuery if not already present
    if ! grep -q "jquery" "$TMP_FILE"; then
      echo '  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>' >> "$TMP_FILE"
    fi
    
    # Close the head tag
    echo '</head>' >> "$TMP_FILE"
    
    # Copy the body start
    sed -n '/<body[^>]*>/,/<\/body>/p' "$file" | head -n 1 >> "$TMP_FILE"
    
    # Add the header div
    echo '  <!-- Header -->
  <div id="header">
    <!-- Header will be loaded here by JavaScript -->
  </div>' >> "$TMP_FILE"
    
    # Copy the rest of the content until before the first script tag
    sed -n '/<body[^>]*>/,/<script/!{/<body[^>]*>/!{/<\/body>/!p}}' "$file" | \
      sed '1d' | sed '/<script/,$d' >> "$TMP_FILE"
    
    # Add the header loading script if not present
    if ! grep -q '"#header"' "$TMP_FILE"; then
      echo '  <!-- Load Header -->
  <script>
    $(function(){
      $("#header").load("components/header.html");
    });
  </script>' >> "$TMP_FILE"
    fi
    
    # Copy the rest of the file
    sed -n '/<script/,/<\/body>/p' "$file" >> "$TMP_FILE"
    
    # Replace the original file
    mv "$TMP_FILE" "$file"
    
    echo "Updated $file"
  else
    echo "Warning: $file not found, skipping..."
  fi
done

echo "Header update complete!"
