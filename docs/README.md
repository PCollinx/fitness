# FitTrack Documentation

This directory contains documentation and publicly accessible files hosted on GitHub Pages.

## GitHub Pages Setup

This repository uses GitHub Pages to host static content from the `docs/` folder.

### Accessing the Privacy Policy

Once GitHub Pages is enabled, the privacy policy will be available at:
```
https://pcollinx.github.io/fitness/privacy-policy.html
```

## How to Enable GitHub Pages

Follow these steps to enable GitHub Pages for this repository:

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click on "Settings" tab

2. **Configure GitHub Pages**
   - In the left sidebar, click on "Pages" under "Code and automation"
   - Under "Build and deployment":
     - **Source**: Select "GitHub Actions"
   - Click "Save"

3. **Trigger Deployment**
   - The GitHub Actions workflow will automatically deploy when:
     - Changes are pushed to the `main` branch in the `docs/` folder
     - You manually trigger it from the Actions tab
   - Or manually trigger it:
     - Go to "Actions" tab
     - Select "Deploy to GitHub Pages" workflow
     - Click "Run workflow"

4. **Verify Deployment**
   - After the workflow completes (usually takes 1-2 minutes)
   - Visit: `https://pcollinx.github.io/fitness/privacy-policy.html`
   - Your privacy policy should be live!

## Using the Privacy Policy URL for Chrome Extension

When publishing your Chrome extension, you can use the following URL for the privacy policy:
```
https://pcollinx.github.io/fitness/privacy-policy.html
```

This URL is:
- ✅ Publicly accessible
- ✅ Always available (hosted on GitHub)
- ✅ Version controlled
- ✅ Easy to update (just edit the HTML file and commit)

## Updating the Privacy Policy

To update the privacy policy:

1. Edit `docs/privacy-policy.html`
2. Commit and push your changes to the `main` branch
3. The GitHub Actions workflow will automatically deploy the updates
4. Changes will be live in 1-2 minutes

## Files in this Directory

- `privacy-policy.html` - Privacy Policy for the FitTrack application
- `README.md` - This file with instructions

## Troubleshooting

### GitHub Pages not working?

1. **Check Repository Settings**
   - Ensure GitHub Pages is set to deploy from "GitHub Actions"
   - Repository must be public (or you need GitHub Pro for private repos)

2. **Check Actions Tab**
   - Look for "Deploy to GitHub Pages" workflow runs
   - Check if any deployments failed
   - Review error messages if present

3. **Check Permissions**
   - The workflow needs proper permissions (already configured in the workflow file)
   - Ensure Actions are enabled for the repository

4. **Wait for DNS**
   - Initial setup might take up to 10 minutes for DNS to propagate
   - Subsequent updates are usually instant

### Need Help?

If you encounter issues:
- Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
- Review workflow runs in the Actions tab
- Ensure the repository is public or you have GitHub Pro
