# Portfolio Deployment Instructions

This folder contains all the files needed for your Portfolio Website.

## How to Deploy to Render

### Option 1: Drag & Drop (Easiest)
1.  Go to [Render.com](https://render.com) and sign in.
2.  In your dashboard, click **New +** -> **Static Site**.
3.  Connect your GitHub account (Option 2) OR look for a "Manual Upload" or "Drag and drop" option if enabled for your plan (Render primarily uses Git).

**Recommended: Use GitHub**
Render works best when connected to a GitHub repository.

1.  Initialize a Git repository in this folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Push this code to GitHub.
4.  Go to Render -> New Static Site.
5.  Select your GitHub repository.
6.  **Settings:**
    - **Build Command:** (Leave blank)
    - **Publish Directory:** `.` (or leave blank, it defaults to root)

## Files Included
- `index.html`: The main website.
- `style.css`: Styles and layout.
- `script.js`: Chatbot and clock logic.

## Environment Variables
The Chatbot uses a Groq API Key. currently, it is **hardcoded** in `script.js` for simplicity.
*Warning: In a professional production app, you should proxy API calls through a backend to hide your key.*
For this static portfolio, it will work as is.
