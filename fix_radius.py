import glob

html_files = glob.glob('**/*.html', recursive=True)

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    if 'border-radius: 6px 50% 6px 6px;' in content:
        content = content.replace(
            "border-radius: 6px 50% 6px 6px;",
            "border-radius: 6px 60px 6px 6px;"
        )
        with open(filepath, 'w') as f:
            f.write(content)

