import os
import re

root_dir = '/Users/aliraza/Documents/Blog_Website/Stonebridge'
sections_file = os.path.join(root_dir, 'sections/index.html')
css_file = os.path.join(root_dir, 'css/styles.css')

# Read sections/index.html
with open(sections_file, 'r', encoding='utf-8') as f:
    sections_html = f.read()

# Extract CSS (approx lines 1371 to 1530)
lines = sections_html.split('\n')
css_lines = lines[1370:1530]
css_content = '\n' + '\n'.join(css_lines) + '\n'

# Append to styles.css
with open(css_file, 'r', encoding='utf-8') as f:
    existing_css = f.read()

if '.sector-testimonials' not in existing_css:
    with open(css_file, 'a', encoding='utf-8') as f:
        f.write(css_content)
    print("Appended CSS to styles.css")
else:
    print("CSS already exists in styles.css")

# Extract the new HTML section
# From line 3839 to 3978
new_html_lines = lines[3838:3978]
new_html = '\n'.join(new_html_lines)

# Regex to find the old section
# The old section always starts with <section class="sector-expertise ...
# and ends with </section>. We need to make sure we match the correct old section.
# It has "Financing businesses like yours" inside it.
old_section_pattern = re.compile(r'<section class="sector-expertise[^>]*>.*?</section>', re.DOTALL)

count = 0
for dirpath, _, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith('.html'):
            filepath = os.path.join(dirpath, filename)
            # Skip the source file
            if os.path.abspath(filepath) == os.path.abspath(sections_file):
                continue
                
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if 'Financing businesses like yours' in content and 'class="sector-expertise' in content:
                # Replace
                # Since new_html contains backslashes or groups, replace doesn't evaluate regex groups
                # if we just do string replacement, but doing regex sub requires escaping backslashes.
                # Actually, string replace is safer if there's only one occurrence per file!
                
                # Find the exact string to replace using the regex to avoid manual substring logic
                match = old_section_pattern.search(content)
                if match:
                    old_html = match.group(0)
                    new_content = content.replace(old_html, new_html)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count += 1
                    print(f"Updated {filepath}")

print(f"Total files updated: {count}")
