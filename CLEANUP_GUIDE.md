# 🧹 Cleanup Script - Remove Unnecessary Files

## ❌ **Files/Folders to Remove**

Since you're using **Supabase** (not custom backend) and **Netlify** (not Docker), these folders are unnecessary:

### **1. Backend Folder** ❌

- **Path:** `c:\Softwares\Metrix\backend`
- **Why:** Using Supabase instead of custom Node.js backend
- **Contains:** Node.js server code, not needed

### **2. Docker Folder** ❌

- **Path:** `c:\Softwares\Metrix\docker`
- **Why:** Deploying to Netlify, not using Docker
- **Contains:** Docker configurations for Postgres and Redis

### **3. Docker Compose File** ❌

- **Path:** `c:\Softwares\Metrix\docker-compose.yml`
- **Why:** Not using Docker deployment

### **4. Supabase Folder** ❌

- **Path:** `c:\Softwares\Metrix\supabase`
- **Why:** Using Supabase cloud, not self-hosted
- **Contains:** Local Supabase config

### **5. Scripts Folder** ⚠️

- **Path:** `c:\Softwares\Metrix\scripts`
- **Check first:** May contain useful scripts
- **Decision:** Review before deleting

### **6. Docs Folder** ⚠️

- **Path:** `c:\Softwares\Metrix\docs`
- **Check first:** May contain important documentation
- **Decision:** Review before deleting

### **7. Root node_modules** ❌

- **Path:** `c:\Softwares\Metrix\node_modules`
- **Why:** Only need frontend/node_modules
- **Contains:** Root package dependencies

### **8. Root package files** ❌

- **Path:** `c:\Softwares\Metrix\package.json`
- **Path:** `c:\Softwares\Metrix\package-lock.json`
- **Why:** Only need frontend packages

---

## ✅ **Files/Folders to KEEP**

### **Keep These:**

- ✅ `frontend/` - Your Next.js application
- ✅ `.git/` - Git repository
- ✅ `.gitignore` - Git ignore rules
- ✅ `README.md` - Project documentation
- ✅ `.env.example` - Environment template
- ✅ `Assets/` - Project assets

---

## 🗑️ **Cleanup Commands**

### **Option 1: Manual Cleanup (Recommended)**

Review each folder first, then delete:

```powershell
# Navigate to Metrix folder
cd c:\Softwares\Metrix

# Remove backend
Remove-Item -Recurse -Force backend

# Remove docker
Remove-Item -Recurse -Force docker
Remove-Item -Force docker-compose.yml

# Remove supabase local config
Remove-Item -Recurse -Force supabase

# Remove root node_modules
Remove-Item -Recurse -Force node_modules

# Remove root package files
Remove-Item -Force package.json
Remove-Item -Force package-lock.json

# Optional: Remove scripts (check first)
# Remove-Item -Recurse -Force scripts

# Optional: Remove docs (check first)
# Remove-Item -Recurse -Force docs
```

### **Option 2: Keep Only Frontend**

Move frontend to a clean location:

```powershell
# Create new clean directory
New-Item -ItemType Directory -Path "c:\Softwares\MetrixClean"

# Copy only frontend
Copy-Item -Recurse "c:\Softwares\Metrix\frontend" "c:\Softwares\MetrixClean\frontend"

# Copy git folder
Copy-Item -Recurse "c:\Softwares\Metrix\.git" "c:\Softwares\MetrixClean\.git"

# Copy important files
Copy-Item "c:\Softwares\Metrix\README.md" "c:\Softwares\MetrixClean\"
Copy-Item "c:\Softwares\Metrix\.gitignore" "c:\Softwares\MetrixClean\"

# Then delete old folder and rename
Remove-Item -Recurse -Force "c:\Softwares\Metrix"
Rename-Item "c:\Softwares\MetrixClean" "Metrix"
```

---

## 📊 **Before & After**

### **Before Cleanup:**

```
Metrix/
├── backend/          ❌ Remove (using Supabase)
├── docker/           ❌ Remove (using Netlify)
├── supabase/         ❌ Remove (using cloud)
├── scripts/          ⚠️ Review first
├── docs/             ⚠️ Review first
├── node_modules/     ❌ Remove (root level)
├── frontend/         ✅ KEEP
├── .git/             ✅ KEEP
├── package.json      ❌ Remove (root level)
└── README.md         ✅ KEEP
```

### **After Cleanup:**

```
Metrix/
├── frontend/         ✅ Your Next.js app
├── .git/             ✅ Git repository
├── .gitignore        ✅ Git ignore
├── README.md         ✅ Documentation
└── .env.example      ✅ Environment template
```

---

## 🎯 **Recommended Structure**

For Netlify deployment, you only need:

```
Metrix/
└── frontend/
    ├── src/
    ├── public/
    ├── migrations/
    ├── package.json
    ├── next.config.ts
    ├── netlify.toml
    ├── .gitignore
    ├── README.md
    └── [all documentation files]
```

---

## ⚠️ **Important Notes**

### **Before Deleting:**

1. **Check scripts folder:**

   ```powershell
   Get-ChildItem c:\Softwares\Metrix\scripts
   ```

2. **Check docs folder:**

   ```powershell
   Get-ChildItem c:\Softwares\Metrix\docs
   ```

3. **Backup if unsure:**
   ```powershell
   Copy-Item -Recurse c:\Softwares\Metrix c:\Softwares\Metrix_Backup
   ```

### **After Deleting:**

1. **Update git repository:**

   ```powershell
   cd c:\Softwares\Metrix
   git add .
   git commit -m "Remove unnecessary backend and Docker files"
   git push origin main
   ```

2. **Verify frontend still works:**
   ```powershell
   cd frontend
   npm run dev
   ```

---

## 🔍 **What Each Folder Was For**

### **backend/**

- Custom Node.js/Express server
- Not needed with Supabase
- Supabase handles all backend logic

### **docker/**

- Docker containers for local development
- Postgres and Redis configs
- Not needed for Netlify deployment

### **supabase/**

- Local Supabase instance config
- For self-hosting Supabase
- Using cloud Supabase instead

### **scripts/**

- Build/deployment scripts
- May have useful utilities
- Review before deleting

### **docs/**

- Additional documentation
- May have API specs
- Review before deleting

---

## ✅ **Safe Cleanup Steps**

1. **Backup first:**

   ```powershell
   Copy-Item -Recurse c:\Softwares\Metrix c:\Softwares\Metrix_Backup
   ```

2. **Remove confirmed unnecessary:**

   ```powershell
   cd c:\Softwares\Metrix
   Remove-Item -Recurse -Force backend
   Remove-Item -Recurse -Force docker
   Remove-Item -Force docker-compose.yml
   Remove-Item -Recurse -Force supabase
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package.json
   Remove-Item -Force package-lock.json
   ```

3. **Review optional folders:**

   ```powershell
   # Check scripts
   Get-ChildItem scripts

   # Check docs
   Get-ChildItem docs

   # Delete if not needed
   # Remove-Item -Recurse -Force scripts
   # Remove-Item -Recurse -Force docs
   ```

4. **Update git:**

   ```powershell
   git add .
   git commit -m "Clean up: Remove backend, Docker, and unused files"
   git push origin main
   ```

5. **Test frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

---

## 🎉 **Result**

After cleanup:

- ✅ Smaller repository
- ✅ Faster git operations
- ✅ Cleaner structure
- ✅ Only necessary files
- ✅ Ready for Netlify

**Estimated space saved:** 200-500 MB

---

## 📝 **Quick Command**

**One-line cleanup (use with caution):**

```powershell
cd c:\Softwares\Metrix; Remove-Item -Recurse -Force backend,docker,supabase,node_modules,scripts,docs; Remove-Item -Force docker-compose.yml,package.json,package-lock.json
```

**Safer version (with confirmation):**

```powershell
cd c:\Softwares\Metrix
Remove-Item -Recurse -Force -Confirm backend
Remove-Item -Recurse -Force -Confirm docker
Remove-Item -Force -Confirm docker-compose.yml
Remove-Item -Recurse -Force -Confirm supabase
Remove-Item -Recurse -Force -Confirm node_modules
Remove-Item -Force -Confirm package.json
Remove-Item -Force -Confirm package-lock.json
```

---

## ✨ **Summary**

**Remove:**

- ❌ backend/
- ❌ docker/
- ❌ docker-compose.yml
- ❌ supabase/
- ❌ node_modules/ (root)
- ❌ package.json (root)
- ❌ package-lock.json (root)

**Keep:**

- ✅ frontend/
- ✅ .git/
- ✅ README.md
- ✅ .gitignore

**Review First:**

- ⚠️ scripts/
- ⚠️ docs/

**Your Metrix platform will be cleaner and ready for Netlify!** 🚀
