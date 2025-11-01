#!/bin/bash

# Function to escape special characters for sed
escape_sed() {
  echo "$1" | sed -e 's/[&\/]/\\&/g; s/$/\\/'
}

# Function to update a single HTML file
update_html_file() {
  local file=$1
  
  # Skip base-template.html and backup files
  if [[ "$file" == *"base-template.html"* || "$file" == *.bak ]]; then
    return
  fi
  
  echo "Processing: $file"
  
  # Get the page title
  local page_title=$(grep -o '<title>.*</title>' "$file" | sed 's/<[^>]*>//g' | sed 's/ *$//')
  
  # Create a backup of the original file
  cp "$file" "${file}.bak"
  
  # Extract the main content
  local content=$(awk '/<main/,/\/main>/' "$file" | sed '1d;$d')
  
  # If no main content found, try to get the content between header and footer
  if [ -z "$content" ]; then
    content=$(awk '/<header/,/<\/header>/ {next} /<footer/,/<\/footer>/ {exit} {print}' "$file")
  fi
  
  # If still no content, use the whole file
  if [ -z "$content" ]; then
    content=$(cat "$file")
  fi
  
  # Create a temporary file with the content
  echo "$content" > "${file}.tmp"
  
  # Create the new file with the base template
  cp base-template.html "$file"
  
  # Update the title using a temporary file to handle special characters
  sed -i.bak "s|<title>.*</title>|<title>$(escape_sed "$page_title")</title>|" "$file"
  rm -f "${file}.bak"
  
  # Insert the content into the new file
  sed -i "/<!-- Content will be loaded here -->/r ${file}.tmp" "$file"
  
  # Clean up
  rm -f "${file}.tmp"
  
  echo "Updated: $file"
}

# Export the function to make it available to find
export -f update_html_file
export -f escape_sed

# Find all HTML files in the current directory and update them
find . -maxdepth 1 -name "*.html" -type f -exec bash -c 'update_html_file "$0"' {} \;

echo "\nAll HTML files have been updated to use the new template."
echo "Original files have been backed up with .bak extension"
