# GitHub Setup Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - Repository name: `barterlearn` (or your preferred name)
   - Description: "Collaborative Learning Marketplace - Exchange skills and knowledge"
   - Choose "Public" or "Private"
   - **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

## Step 2: Push Your Code to GitHub

Open your terminal in the `barterlearn` directory and run these commands:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: BarterLearn prototype"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/barterlearn.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify Your Repository

1. Go to your GitHub repository URL
2. You should see all your files
3. The README.md will be displayed on the repository homepage

## Common Git Commands for Future Updates

```bash
# Check status of your files
git status

# Add specific files
git add filename.js

# Add all changed files
git add .

# Commit your changes
git commit -m "Description of what you changed"

# Push to GitHub
git push

# Pull latest changes (if working with team)
git pull

# Create a new branch for a feature
git checkout -b feature-name

# Switch between branches
git checkout branch-name

# View commit history
git log
```

## Tips

- Commit often with descriptive messages
- Don't commit `node_modules/` (already in .gitignore)
- Use branches for new features
- Write clear commit messages like:
  - "Add user authentication"
  - "Fix matching algorithm bug"
  - "Update README with installation steps"

## Need Help?

- [GitHub Documentation](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
