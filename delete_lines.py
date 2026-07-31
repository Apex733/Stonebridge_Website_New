with open("/Users/aliraza/Documents/Blog_Website/Stonebridge/about/index.html", "r") as f:
    lines = f.readlines()
with open("/Users/aliraza/Documents/Blog_Website/Stonebridge/about/index.html", "w") as f:
    f.writelines(lines[:452] + lines[535:])
