# GitHub Pages Setup Guide for FitTrack

This guide will walk you through hosting your privacy policy HTML on GitHub Pages so you can use the URL for publishing your Chrome extension.

## 📋 What You're Setting Up

You'll be hosting static HTML files (like your privacy policy) on GitHub Pages, which will give you a public URL that looks like:
```
https://pcollinx.github.io/fitness/privacy-policy.html
```

This URL is perfect for Chrome Web Store submissions, as Google requires a publicly accessible privacy policy.

## ✅ What's Already Done

The following files have been created for you:

1. **`docs/privacy-policy.html`** - A professional privacy policy for your fitness tracking application
2. **`docs/index.html`** - A landing page for your documentation
3. **`docs/README.md`** - Instructions and troubleshooting guide
4. **`.github/workflows/deploy-pages.yml`** - GitHub Actions workflow for automatic deployment

## 🚀 How to Enable GitHub Pages (Step-by-Step)

### Step 1: Merge This Pull Request

First, merge this pull request to the `main` branch:
1. Review the changes in this PR
2. Click "Merge pull request"
3. Confirm the merge

### Step 2: Enable GitHub Pages in Repository Settings

1. **Navigate to Settings**
   - Go to your repository: https://github.com/PCollinx/fitness
   - Click on the "Settings" tab (⚙️ icon)

2. **Find Pages Settings**
   - In the left sidebar, scroll down to "Code and automation"
   - Click on "Pages"

3. **Configure Build and Deployment**
   - Under "Build and deployment"
   - **Source**: Select "**GitHub Actions**" from the dropdown
   - ✅ That's it! No need to click Save - it auto-saves

### Step 3: Trigger the Deployment

The deployment will happen automatically after you enable GitHub Pages. However, you can also trigger it manually:

1. Go to the "**Actions**" tab in your repository
2. On the left sidebar, click "**Deploy to GitHub Pages**"
3. Click the "**Run workflow**" button on the right
4. Select the `main` branch
5. Click "**Run workflow**" (green button)

### Step 4: Wait for Deployment (1-2 minutes)

1. Stay on the Actions tab
2. You'll see a new workflow run appear
3. Wait for it to complete (green checkmark ✅)
4. The deployment typically takes 30 seconds to 2 minutes

### Step 5: Verify Your Privacy Policy is Live

Once the workflow completes:

1. Open a new browser tab
2. Visit: **https://pcollinx.github.io/fitness/privacy-policy.html**
3. You should see your beautiful privacy policy! 🎉

You can also visit:
- **https://pcollinx.github.io/fitness/** - Documentation landing page
- **https://pcollinx.github.io/fitness/privacy-policy.html** - Privacy policy (use this for Chrome extension)

## 🔗 Using the URL in Chrome Web Store

When publishing your Chrome extension:

1. Go to the Chrome Web Store Developer Dashboard
2. Find the "Privacy Policy" field
3. Enter: `https://pcollinx.github.io/fitness/privacy-policy.html`
4. Submit your extension

Google will verify that this URL is:
- ✅ Publicly accessible
- ✅ Contains a valid privacy policy
- ✅ Is hosted on a secure (HTTPS) domain

## 🔄 Updating Your Privacy Policy

To make changes to your privacy policy in the future:

1. Edit `docs/privacy-policy.html` in your repository
2. Commit and push to the `main` branch
3. The GitHub Actions workflow will automatically deploy your changes
4. Your live privacy policy will be updated in 1-2 minutes

## 🛠️ Troubleshooting

### "404 - Page Not Found" Error

**Problem**: When you visit the URL, you get a 404 error.

**Solutions**:
1. Make sure you've enabled GitHub Pages (Step 2 above)
2. Ensure the workflow has completed successfully (check Actions tab)
3. Wait 5-10 minutes for DNS propagation (first time only)
4. Make sure your repository is **public** (GitHub Pages requires public repos unless you have GitHub Pro)

### "Actions workflow failed"

**Problem**: The deployment workflow shows a red ❌.

**Solutions**:
1. Click on the failed workflow to see error details
2. Make sure the `docs/` folder exists with the HTML files
3. Check that the workflow file `.github/workflows/deploy-pages.yml` exists
4. Verify that Actions are enabled for your repository (Settings → Actions → General)

### "Repository must be public"

**Problem**: You get an error about repository visibility.

**Solutions**:
1. Make your repository public: Settings → General → Danger Zone → Change visibility
2. Or upgrade to GitHub Pro to use GitHub Pages with private repos

### Changes not appearing

**Problem**: You updated the HTML but don't see changes on the live site.

**Solutions**:
1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check that the workflow ran successfully after your commit
3. Wait 1-2 minutes for changes to propagate

## 📝 Important Notes

### Repository Visibility
- Your repository must be **public** for GitHub Pages to work (unless you have GitHub Pro)
- The privacy policy will be publicly accessible (which is required for Chrome extensions anyway)

### Automatic Deployment
- Every time you push changes to `docs/` folder on `main` branch, the site updates automatically
- No manual deployment needed after initial setup

### Custom Domain (Optional)
- You can use a custom domain like `privacy.yoursite.com` instead of the GitHub Pages URL
- Configure this in Settings → Pages → Custom domain
- Requires DNS configuration

### SSL/HTTPS
- GitHub Pages automatically provides HTTPS (secure connection)
- No configuration needed - it just works!

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Chrome Extension Privacy Requirements](https://developer.chrome.com/docs/webstore/user_data/)

## ✨ Summary

After following these steps, you'll have:

1. ✅ A professional privacy policy hosted on GitHub Pages
2. ✅ A public URL for your Chrome extension submission
3. ✅ Automatic deployment when you make changes
4. ✅ No hosting costs or maintenance required

**Your Privacy Policy URL**: `https://pcollinx.github.io/fitness/privacy-policy.html`

Use this URL when submitting your Chrome extension to the Web Store!

## 🎉 You're Done!

Your privacy policy is now hosted on GitHub Pages. The setup is complete, and you can use the URL for your Chrome extension submission.

If you need any help, refer to the troubleshooting section above or check the documentation in `docs/README.md`.

Happy coding! 🚀
