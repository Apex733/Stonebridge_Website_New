# Resolving Horizontal Page Shift (Left-Shift Bug)

This document serves as a future reference for diagnosing and resolving the "page shifting to the left" bug (horizontal overflow) on the Stonebridge website. 

When the page appears shifted to the left, it means an element is forcing the webpage to be wider than the device screen, creating an invisible horizontal scroll. Here are the 4 main causes we discovered and their exact fixes:

## 1. Grid `1fr` Blowout (The Hidden Minimum)
In CSS Grid, setting a column to `1fr` actually defaults to `minmax(auto, 1fr)`. If the text or padding inside a grid column is wider than what the `1fr` fraction calculates to, the column **refuses to shrink** below its content width and forces the grid outward, blowing out the page.

**The Fix:**
- Change `repeat(3, 1fr)` or `grid-template-columns: 1fr` to explicitly use `minmax(0, 1fr)`.
- Ensure grid children are allowed to shrink by adding `min-width: 0;` to them.
```css
.example-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); /* Use minmax(0, 1fr) */
}
.example-grid > * {
  min-width: 0; /* Critical for grid children */
}
```

## 2. Rigid `minmax` Pixel Values
Using rigid pixel minimums inside grid layouts (e.g., `minmax(260px, 0.9fr)`) forces the grid to remain at least that wide. On a smaller tablet or phone, 3 columns at 260px each + gaps will easily exceed the screen width and push the page off-center.

**The Fix:**
- Replace rigid pixel minimums with `0` so the columns can shrink gracefully on small screens.
```css
/* Bad */
grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1fr) minmax(0, 1fr);

/* Good */
grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr) minmax(0, 1fr);
```

## 3. The `white-space: nowrap` Trap
If a long heading or paragraph has `white-space: nowrap;`, the browser is forbidden from breaking the text into multiple lines. The text stays in one long line and forces its container (and the entire page) to stretch to accommodate it.

**The Fix:**
- Inspect headings (`h2`, `h3`) and spans. Remove `white-space: nowrap;` or replace it with `white-space: normal;` so text can wrap dynamically.

## 4. Global Safety Nets (The Ultimate Failsafe)
To strictly prevent horizontal scrolling and page-shifting on all modern browsers (including mobile Safari), global container constraints must be strictly enforced.

**The Fix:**
- Add absolute bounds to the global `html` and `body` tags in `styles.css`.
- Add `overflow: hidden;` to individual `<section>` wrappers so internal elements are clipped before they can affect the global page width.
```css
/* In styles.css */
html, body {
  width: 100%;
  overflow-x: hidden;
}

/* In specific section CSS */
.my-section-wrapper {
  overflow: hidden; 
}
```
