# 🚀 GitHub Pages Setup for Noesis Vision

## 📋 Prerequisites

1. Repository `noesis-docs` must be in the `noesisvision` organization on GitHub
2. You must have admin permissions in the organization

## ⚙️ GitHub Pages Configuration

### Step 1: Enable GitHub Pages

1. Go to the `noesis-docs` repository on GitHub
2. Click **Settings**
3. In the left menu, click **Pages**
4. In the **Source** section, select **GitHub Actions**

### Step 2: Check Actions Permissions

1. In **Settings** → **Actions** → **General**
2. Make sure **Actions permissions** is set to **Allow all actions and reusable workflows**

**✅ That's it!** The workflow I created works with default permissions (just like your `noesis-landing-page` project).

### Step 3: Push Code

1. Push all changes to the `main` branch:
```bash
git add .
git commit -m "Initial setup for Noesis Vision documentation"
git push origin main
```

2. Check workflow status in the **Actions** tab

### Step 4: Check Deployment

1. After successful deployment, the website will be available at:
   **https://noesisvision.github.io/noesis-docs**

2. First deployment may take 5-10 minutes

## 🔄 Automatic Deployment

From now on, every push to the `main` branch will automatically:
- Build the project
- Deploy to GitHub Pages
- Update the website

## 🐛 Troubleshooting

### Workflow Not Starting
- Check if the `.github/workflows/deploy.yml` file is in the repository
- Make sure GitHub Actions are enabled

### Build Error
- Check logs in the **Actions** tab
- Run `npm run build` locally to diagnose the problem

### Website Not Accessible
- Wait a few minutes after deployment
- Check if GitHub Pages are enabled
- Verify the URL is correct: `https://noesisvision.github.io/noesis-docs`

## 📞 Support

In case of problems:
1. Check GitHub Actions logs
2. Check repository settings
3. Run build locally: `npm run build`

## 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
