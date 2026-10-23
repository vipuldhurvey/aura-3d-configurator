# Aura One · 3D Product Studio

A responsive, interactive headphone configurator concept made with HTML, CSS, vanilla JavaScript, and Three.js. The procedural headphone model is built in the browser; it does not require a downloaded 3D asset, framework, or build step.

## Demo features

- Three.js model you can drag or rotate with the on-screen arrow buttons or keyboard arrow keys.
- Three material and color finishes that update the 3D model and the CSS fallback preview.
- Prompt-led styling panel that maps mood words to a finish preset.
- Responsive product studio, finish selector, sample shopping bag, and polished product-story sections.
- Accessible labels and focus states, reduced-motion support, and a fallback illustration when 3D cannot load.

## Important: what “AI style concept” means here

This portfolio sample does **not** call an AI model. The prompt panel uses simple local keyword rules to choose a preset. A real AI product-customization feature would need a secure backend to call an AI service; a private API key must not be added to browser JavaScript.

The model is a procedural headphone concept made from Three.js geometry, not a photorealistic product scan or a Blender/GLB asset. Product, price, shipping, and checkout content are fictional demo data.

## Publish with GitHub Pages

1. Create a GitHub repository for the project.
2. Upload the files in this folder to the repository root: `index.html`, `styles.css`, `script.js`, `scene.js`, and this README.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. When GitHub Pages finishes publishing, share the link shown in the Pages settings. A project repository URL typically looks like `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

This is a static site: there is no compilation or `npm install` step. The 3D renderer and OrbitControls load from the version-pinned Three.js CDN in `index.html`, so the published site needs an internet connection. Three.js modules need an HTTP(S) origin; double-clicking `index.html` may show the CSS fallback rather than enable 3D. The official [Three.js installation guide](https://threejs.org/manual/pages/installation.html) explains the CDN import-map setup and local-server requirement.

## Upwork portfolio copy

Use `UPWORK-PORTFOLIO-COPY.md` for a portfolio title, role, skill tags, and truthful demo description. This is a self-authored sample, not paid client work.

## Resume connection

This project extends Bipul's HTML, CSS, JavaScript, responsive frontend, and web-design foundations into interactive browser 3D. Review and understand the Three.js code before listing Three.js or WebGL among your skills.
