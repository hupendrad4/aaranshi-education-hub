#!/usr/bin/env python3
import os
import re
from bs4 import BeautifulSoup

# List of pages to update
PAGES = [
    'index.html',
    'about.html',
    'courses.html',
    'teachers.html',
    'events.html',
    'testimonials.html',
    'contact.html',
    'register.html'
]

def get_page_title(html_content):
    """Extract the page title from HTML content."""
    soup = BeautifulSoup(html_content, 'html.parser')
    title_tag = soup.find('title')
    return title_tag.string if title_tag else 'Aaranshi Education Hub'

def get_main_content(html_content):
    """Extract the main content from the page."""
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Try to find the main content in a main tag or content div
    main_content = soup.find('main') or soup.find('div', class_=re.compile(r'content|main|container'))
    
    if not main_content:
        # If no main content found, get everything between header and footer
        header = soup.find('header') or soup.find('div', class_=re.compile(r'header|banner'))
        footer = soup.find('footer') or soup.find('div', class_=re.compile(r'footer'))
        
        if header and footer:
            content = []
            current = header.find_next_sibling()
            while current and current != footer:
                content.append(str(current))
                current = current.find_next_sibling()
            return '\n'.join(content)
        else:
            # If still no content, return the body
            body = soup.find('body')
            return str(body) if body else str(soup)
    
    return str(main_content)

def update_page(page_path):
    """Update a single page with the new template."""
    # Skip if it's the base template
    if 'base-template' in page_path:
        return False
    
    print(f"Processing: {page_path}")
    
    try:
        # Read the original file
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Get the page title and content
        page_title = get_page_title(content)
        main_content = get_main_content(content)
        
        # Read the base template
        with open('base-template.html', 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Update the title
        template = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', template, flags=re.DOTALL)
        
        # Insert the content
        template = template.replace('<!-- Content will be loaded here -->', f'<!-- Content will be loaded here -->\n{main_content}')
        
        # Create a backup
        backup_path = f"{page_path}.bak"
        if not os.path.exists(backup_path):
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        # Write the updated content
        with open(page_path, 'w', encoding='utf-8') as f:
            f.write(template)
        
        return True
    
    except Exception as e:
        print(f"Error processing {page_path}: {str(e)}")
        return False

def main():
    updated = 0
    
    for page in PAGES:
        if os.path.exists(page):
            if update_page(page):
                updated += 1
    
    print(f"\nSuccessfully updated {updated} pages.")
    print("Original files have been backed up with .bak extension")

if __name__ == "__main__":
    main()
