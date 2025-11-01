#!/bin/bash

# Function to update a single HTML file
update_html_file() {
  local file=$1
  local page_title=$(grep -o '<title>.*</title>' "$file" | sed 's/<[^>]*>//g' | sed 's/ *$//')
  
  # Skip base-template.html
  if [[ "$file" == *"base-template.html"* ]]; then
    return
  fi
  
  # Backup the original file
  cp "$file" "${file}.bak"
  
  # Get the content between the main-content div
  content=$(sed -n '/<main.*class=".*main-content.*">/,/<\/main>/p' "$file" | sed '1d;$d')
  
  # Create a new file with the base template
  cp base-template.html "$file"
  
  # Update the title
  sed -i "s|<title>.*</title>|<title>$page_title</title>|" "$file"
  
  # Insert the content into the new file
  echo "$content" > temp_content.html
  sed -i '/<!-- Content will be loaded here -->/r temp_content.html' "$file"
  
  # Clean up
  rm temp_content.html
  
  echo "Updated: $file"
}

# Find all HTML files in the current directory and update them
export -f update_html_file
find . -maxdepth 1 -name "*.html" -type f -exec bash -c 'update_html_file "$0"' {} \;

echo "All HTML files have been updated to use the new template."
