#!/bin/bash

# 初始化Git仓库并上传到GitHub
# 使用方法: ./init-github.sh <GitHub用户名> <仓库名>

if [ $# -ne 2 ]; then
  echo "使用方法: ./init-github.sh <GitHub用户名> <仓库名>"
  exit 1
fi

USERNAME=$1
REPO_NAME=$2

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交初始化代码
git commit -m "初始化提交"

# 添加远程仓库
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# 推送到GitHub
git push -u origin main

echo "代码已成功上传到 https://github.com/$USERNAME/$REPO_NAME"
echo "请前往GitHub仓库设置中启用GitHub Pages以部署网站"