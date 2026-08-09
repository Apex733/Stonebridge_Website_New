import os
import glob

# Search for all HTML files
html_files = glob.glob('**/*.html', recursive=True)

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    if '.specialist-card {' not in content:
        continue

    # Update .specialist-card
    content = content.replace(
        "background: rgba(108,93,211,0.09);",
        "background: var(--c-purple);"
    )
    content = content.replace(
        "border: 1px solid rgba(108,93,211,0.12);",
        "border: 1px solid var(--c-purple);"
    )
    content = content.replace(
        "border-radius: 6px;",
        "border-radius: 6px 50% 6px 6px;"
    )
    content = content.replace(
        "color: var(--c-dark);",
        "color: var(--c-white);"
    )

    # Update nth-child(even)
    content = content.replace(
        "background: rgba(0,137,123,0.10);",
        "background: var(--c-green);"
    )
    content = content.replace(
        "border-color: rgba(0,137,123,0.14);",
        "border-color: var(--c-green);"
    )

    # Update icon
    content = content.replace(
        "background: var(--c-purple);\n      color: var(--c-white);",
        "background: rgba(255,255,255,0.2);\n      color: var(--c-white);"
    )
    content = content.replace(
        "background: var(--c-green);",
        "background: rgba(255,255,255,0.2);"
    )

    # Update p
    content = content.replace(
        ".specialist-card p {\n      color: var(--c-grey);",
        ".specialist-card p {\n      color: rgba(255, 255, 255, 0.85);"
    )

    # Update strong
    content = content.replace(
        ".specialist-card strong {\n      display: block;\n      color: var(--c-dark);",
        ".specialist-card strong {\n      display: block;\n      color: var(--c-white);"
    )

    with open(filepath, 'w') as f:
        f.write(content)
