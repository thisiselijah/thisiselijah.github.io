#!/bin/bash

echo "🚀 Adding changes..."
git add .

echo "📝 Enter commit message (press enter for default 'Update website content'):"
read msg
if [ -z "$msg" ]; then
  msg="Update website content"
fi

git commit -m "$msg"

echo "☁️ Pushing to remote repository..."
git push origin HEAD

echo ""
echo "✅ Done! Your changes have been pushed."
echo "🔄 The GitHub Action will now automatically build and deploy your site."
echo "👀 You can monitor the progress on your GitHub repository's Actions tab."
