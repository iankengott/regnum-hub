# Regnum Hub

The landing page for the [Regnum](https://github.com/iankengott/vector-regnum)
Minecraft programming-magic suite.

This is a dependency-free static site designed for GitHub Pages. The source of
truth for the suite and its repository boundaries lives in the linked projects;
this repo is only the front door.

## Local preview

Any static file server works. For example:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Deployment

The included GitHub Actions workflow publishes the repository to GitHub Pages
on pushes to `main`. In the repository settings, set Pages → Build and
deployment → Source to **GitHub Actions** once.
