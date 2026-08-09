import glob

html_files = glob.glob('**/*.html', recursive=True)

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    if '.specialist-card {' not in content:
        continue

    # Fix nth-child(even) background
    content = content.replace(
        ".specialist-card:nth-child(even) {\n      background: rgba(255,255,255,0.2);",
        ".specialist-card:nth-child(even) {\n      background: var(--c-green);"
    )

    # Fix specialist-card-icon border-radius
    content = content.replace(
        ".specialist-card-icon {\n      width: 38px;\n      height: 38px;\n      border-radius: 6px 50% 6px 6px;",
        ".specialist-card-icon {\n      width: 38px;\n      height: 38px;\n      border-radius: 6px;"
    )

    with open(filepath, 'w') as f:
        f.write(content)

