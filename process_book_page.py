import os
import sys
import argparse
import subprocess
import requests
from urllib.parse import urljoin, urlparse

# Function to install a package
def install_package(package):
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"Successfully installed {package}")
    except Exception as e:
        print(f"Failed to install {package}: {e}")
        sys.exit(1)

# Ensure dependencies are installed
try:
    import bs4
except ImportError:
    print("BeautifulSoup4 not found. Installing...")
    install_package("beautifulsoup4")

try:
    import markdownify
except ImportError:
    print("markdownify not found. Installing...")
    install_package("markdownify")

# Now import them
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def fetch_and_convert_page(url, output_markdown_path, base_url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        html_content = response.text

        soup = BeautifulSoup(html_content, 'html.parser')

        # Try to find the main content based on Docusaurus structure
        main_content_div = soup.find('div', class_='docItemContainer_Djhp')
        if not main_content_div:
            # Fallback for pages like intro that might have a different wrapper
            # Look for the main content within the Docusaurus doc page structure
            main_content_div = soup.find('main', class_='docMainContainer_TBSr')
            if main_content_div:
                # Find the article tag which usually holds the content
                article_content = main_content_div.find('article')
                if article_content:
                    # Further refine: the actual markdown content is usually within a div with class 'theme-doc-markdown markdown' inside the article
                    actual_markdown_div = article_content.find('div', class_='theme-doc-markdown markdown')
                    if actual_markdown_div:
                        extracted_html = str(actual_markdown_div)
                    else:
                        extracted_html = str(article_content) # Fallback to entire article
                else:
                    extracted_html = str(main_content_div) # Fallback to entire main div
            else:
                print(f"Could not find main content container for {url}")
                return
        else:
            # For typical chapter pages, this structure works
            actual_markdown_div = main_content_div.find('div', class_='theme-doc-markdown markdown')
            if actual_markdown_div:
                extracted_html = str(actual_markdown_div)
            else:
                extracted_html = str(main_content_div)


        # Custom pre-processing for Docusaurus HTML before markdownify
        temp_soup = BeautifulSoup(extracted_html, 'html.parser')
        
        # Remove navigation elements, sidebars, footers from the extracted HTML
        for tag in temp_soup.find_all(['nav', 'footer', 'header']): # Also remove header if present within content
            tag.decompose()
        
        # Remove Docusaurus breadcrumbs and TOC
        for breadcrumb in temp_soup.find_all('nav', class_='theme-doc-breadcrumbs'):
            breadcrumb.decompose()
        for toc in temp_soup.find_all('div', class_='tocCollapsible_ETCw'):
            toc.decompose()
        for toc_desktop in temp_soup.find_all('div', class_='tableOfContents_bqdL'):
            toc_desktop.decompose()
        
        # Remove Docusaurus header anchors (e.g., <a href="#id" class="hash-link">
        for anchor in temp_soup.find_all('a', class_='hash-link'):
            anchor.decompose()

        # Handle YouTube embeds
        for iframe_tag in temp_soup.find_all('iframe', src=True):
            if "youtube.com/embed/" in iframe_tag['src']:
                video_id = iframe_tag['src'].split("youtube.com/embed/")[1].split("?")[0]
                # Replace iframe with Markdown link
                new_tag = temp_soup.new_tag("p")
                new_tag.string = f"[YouTube Video: https://www.youtube.com/watch?v={video_id}]"
                iframe_tag.replace_with(new_tag)
        
        # Handle images: rewrite src to be relative and collect for later download (placeholder for now)
        # Assuming Docusaurus images are in /img/ at site root, and we will put them in book-site/static/img/
        for img_tag in temp_soup.find_all('img', src=True):
            img_src = img_tag['src']
            if img_src.startswith(base_url):
                # Absolute URL from the base site, make it relative to our static/img
                relative_path = os.path.relpath(img_src, base_url)
                if relative_path.startswith('img/'):
                    new_src = '/' + relative_path # /img/docusaurus-social-card.jpg
                else: # Fallback for other absolute image paths
                    new_src = img_src # Keep absolute for now
                img_tag['src'] = new_src
            elif img_src.startswith('/'): # Relative to site root, like /humanoid_robotics_book/img/logo.svg
                new_src = img_src.replace('/humanoid_robotics_book/img/', '/img/') # To be /img/logo.svg in our project
                img_tag['src'] = new_src
            elif img_src.startswith('data:image'): # Base64 images
                img_tag.decompose() # Remove base64 images

        # Re-convert modified soup back to string for markdownify
        extracted_html = str(temp_soup)

        # Convert HTML to Markdown
        markdown_output = md(
            extracted_html,
            heading_style="ATX",
            bullets="-",
            strong_em_symbol="__",
            default_empty_space=True,
            newline_style="SPACES",
            code_language=True # markdownify tries to extract language from <code class="language-x">
        )
        
        # Clean up common markdownify artifacts and HTML entities
        markdown_output = markdown_output.replace('\\#', '#') # Fix escaped hashes
        markdown_output = markdown_output.replace('\\-', '-') # Fix escaped hyphens
        markdown_output = markdown_output.replace('&amp;', '&')
        markdown_output = markdown_output.replace('&lt;', '<')
        markdown_output = markdown_output.replace('&gt;', '>')
        markdown_output = markdown_output.replace('&quot;', '"')
        markdown_output = markdown_output.replace('&apos;', "'")
        markdown_output = markdown_output.replace('`n', os.linesep) # Replace `n with proper newlines
        markdown_output = markdown_output.replace('`r', '') # Remove carriage returns
        
        # Consolidate multiple newlines (adjust as needed)
        markdown_output = os.linesep.join([s for s in markdown_output.splitlines() if s.strip()])


        # Ensure directory exists for markdown file
        os.makedirs(os.path.dirname(output_markdown_path), exist_ok=True)
        with open(output_markdown_path, 'w', encoding='utf-8') as f:
            f.write(markdown_output)
        print(f"Converted {url} to {output_markdown_path}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
    except Exception as e:
        print(f"Error processing {url}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch HTML content from a URL and convert to Markdown.")
    parser.add_argument("--url", required=True, help="URL of the page to fetch.")
    parser.add_argument("--output_path", required=True, help="Full path to save the output Markdown file (e.g., book-site/docs/intro.md).")
    parser.add_argument("--base_url", required=True, help="Base URL of the Docusaurus site (e.g., https://muhammad-suleman-talib.github.io/humanoid_robotics_book/).")
    
    args = parser.parse_args()

    fetch_and_convert_page(args.url, args.output_path, args.base_url)