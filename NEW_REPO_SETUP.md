# 🔄 Upload to New GitHub Repository

## Step-by-Step Guide

### Step 1: Create New Repository on GitHub

1. Go to: **https://github.com/new**
2. Fill in:
   - **Repository name**: `ecommerce-fullstack` (or any name you prefer)
   - **Description**: "Full-stack e-commerce application with Spring Boot and React"
   - **Visibility**: Public
   - ⚠️ **DO NOT** check any boxes (no README, no .gitignore, no license)
3. Click **"Create repository"**
4. **Copy the repository URL** (it will look like: `https://github.com/harshitrajput2021/ecommerce-fullstack.git`)

---

### Step 2: Remove Old Remote and Add New One

Open terminal in your project folder and run:

```bash
# Remove old remote
git remote remove origin

# Add new remote (REPLACE with YOUR new repository URL!)
git remote add origin https://github.com/harshitrajput2021/ecommerce-fullstack.git

# Verify it's correct
git remote -v
```

---

### Step 3: Commit Recent Changes

```bash
# Stage all changes
git add .

# Commit
git commit -m "Clean up: Remove documentation files"

# Check status
git status
```

---

### Step 4: Push to New Repository

```bash
# Push to new repo
git push -u origin main
```

If it asks for authentication, use your GitHub credentials (username + personal access token).

---

### Step 5: Verify Upload

1. Go to your new repository URL in browser
2. Check that all files are there
3. Verify that lakshh-sirohi017 is NOT listed as a contributor
4. Check that BCRYPT_IMPLEMENTATION.md and DATABASE_SCHEMA.md are NOT there

---

## ✅ What Will Be Uploaded

✅ Backend code (Spring Boot)  
✅ Frontend code (React)  
✅ README.md (with ER diagram)  
✅ .gitignore files  
✅ pom.xml, package.json  
✅ All source code  

❌ BCRYPT_IMPLEMENTATION.md (removed)  
❌ DATABASE_SCHEMA.md (removed)  
❌ GITHUB_UPLOAD_GUIDE.md (removed)  

---

## 🔐 Important Notes

1. **New repo = Fresh start**: No commit history from old repo
2. **No collaborators**: Only you will be the owner
3. **Same code**: All your work is preserved
4. **Clean history**: Starts with clean commit history

---

## 🆘 Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin YOUR_NEW_REPO_URL
```

### If you get authentication error:
- Use Personal Access Token instead of password
- Generate at: https://github.com/settings/tokens

### If you want to keep old repo:
- Just create new repo with different name
- Old repo stays as is
- You can delete it later from GitHub settings

---

## 📋 Quick Commands Summary

```bash
# 1. Remove old remote
git remote remove origin

# 2. Add new remote (REPLACE URL!)
git remote add origin https://github.com/harshitrajput2021/NEW-REPO-NAME.git

# 3. Stage changes
git add .

# 4. Commit
git commit -m "Clean up: Remove documentation files"

# 5. Push
git push -u origin main
```

---

**Ready? Follow the steps above!** 🚀
