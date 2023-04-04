#!/bin/bash

dir="docs"
if [ ! -d "$dir" ]; then
sudo mkdir $dir
echo "创建文件夹成功"
else
echo "文件夹已存在"
fi

echo "开始复制..."

sudo cp -arf dist/* docs

echo "复制结束..."
