#!/bin/bash

echo "🔍 测试前端访问..."

# 测试直接访问Docker容器
echo "=== 测试直接访问Docker容器 ==="
echo "测试: curl -I http://localhost:3000/"
curl -I http://localhost:3000/

echo ""
echo "测试: curl -I http://localhost:3000/assets/index-e6012469.js"
curl -I http://localhost:3000/assets/index-e6012469.js

echo ""
echo "=== 测试通过域名访问 ==="
echo "测试: curl -I https://deepneed.com.cn/"
curl -I https://deepneed.com.cn/

echo ""
echo "测试: curl -I https://deepneed.com.cn/assets/index-e6012469.js"
curl -I https://deepneed.com.cn/assets/index-e6012469.js

echo ""
echo "=== 检查外部Nginx配置 ==="
echo "当前deepneed.com.cn配置:"
cat /etc/nginx/conf.d/deepneed.com.cn.conf

echo ""
echo "=== 检查外部Nginx错误日志 ==="
echo "Nginx错误日志:"
tail -10 /var/log/nginx/deepneed.com.cn.error.log

echo ""
echo "=== 检查外部Nginx访问日志 ==="
echo "Nginx访问日志:"
tail -10 /var/log/nginx/deepneed.com.cn.access.log