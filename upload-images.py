#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
图片上传脚本 - 将本地图片上传到免费图床
"""

import os
import requests
import base64
import json
from pathlib import Path

def upload_to_imgbb(image_path, api_key="7c9e5b8a1d2f3e4a5b6c7d8e9f0a1b2c"):
    """
    上传图片到ImgBB免费图床
    """
    try:
        with open(image_path, "rb") as file:
            # 将图片转换为base64
            image_data = base64.b64encode(file.read()).decode('utf-8')
            
        # ImgBB API endpoint
        url = "https://api.imgbb.com/1/upload"
        
        payload = {
            "key": api_key,
            "image": image_data,
            "name": Path(image_path).stem
        }
        
        response = requests.post(url, data=payload)
        
        if response.status_code == 200:
            result = response.json()
            if result.get('success'):
                return result['data']['url']
            else:
                print(f"上传失败: {result.get('error', {}).get('message', '未知错误')}")
                return None
        else:
            print(f"HTTP错误: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"上传图片 {image_path} 时出错: {str(e)}")
        return None

def upload_to_postimage(image_path):
    """
    上传图片到PostImage免费图床（备用方案）
    """
    try:
        url = "https://postimages.org/json/rr"
        
        with open(image_path, 'rb') as file:
            files = {'upload': file}
            data = {
                'token': '',
                'upload_session': '',
                'numfiles': '1',
                'gallery': '',
                'ui': 'json'
            }
            
            response = requests.post(url, files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                if 'url' in result:
                    return result['url']
                else:
                    print(f"PostImage上传失败: {result}")
                    return None
            else:
                print(f"PostImage HTTP错误: {response.status_code}")
                return None
                
    except Exception as e:
        print(f"PostImage上传图片 {image_path} 时出错: {str(e)}")
        return None

def main():
    # 图片文件夹路径
    image_folder = Path("图片")
    
    if not image_folder.exists():
        print("图片文件夹不存在！")
        return
    
    # 获取所有图片文件
    image_files = list(image_folder.glob("*.jpg")) + list(image_folder.glob("*.jpeg")) + list(image_folder.glob("*.png"))
    
    if not image_files:
        print("图片文件夹中没有找到图片文件！")
        return
    
    print(f"找到 {len(image_files)} 张图片，开始上传...")
    
    # 存储上传结果
    upload_results = {}
    
    for i, image_file in enumerate(image_files, 1):
        print(f"\n正在上传第 {i}/{len(image_files)} 张图片: {image_file.name}")
        
        # 尝试上传到ImgBB
        url = upload_to_imgbb(str(image_file))
        
        # 如果ImgBB失败，尝试PostImage
        if not url:
            print("ImgBB上传失败，尝试PostImage...")
            url = upload_to_postimage(str(image_file))
        
        if url:
            upload_results[image_file.name] = url
            print(f"✅ 上传成功: {url}")
        else:
            print(f"❌ 上传失败: {image_file.name}")
    
    # 保存上传结果到JSON文件
    with open("uploaded_images.json", "w", encoding="utf-8") as f:
        json.dump(upload_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n上传完成！成功上传 {len(upload_results)} 张图片")
    print("上传结果已保存到 uploaded_images.json")
    
    # 显示结果
    print("\n上传结果:")
    for filename, url in upload_results.items():
        print(f"{filename}: {url}")

if __name__ == "__main__":
    main()