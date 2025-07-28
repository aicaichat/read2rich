#!/bin/bash

# PPT 部署修复脚本
# 解决 403/500 错误

set -e

DOMAIN="deepneed.com.cn"
SITE_DIR="/var/www/${DOMAIN}"
PPT_DIR="${SITE_DIR}/ppt"

echo "🔧 修复 PPT 部署问题..."

# 1. 检查当前目录结构
echo "📁 当前目录结构："
ls -la ${SITE_DIR}/ || echo "网站目录不存在"
ls -la ${PPT_DIR}/ || echo "PPT 目录不存在"

# 2. 修复目录结构
echo "📁 修复目录结构..."

# 如果 PPT 文件在 _static 子目录中，移动到正确位置
if [[ -d "${PPT_DIR}/_static" ]]; then
    echo "发现 _static 子目录，正在移动文件..."
    
    # 移动所有文件到 PPT 根目录
    mv ${PPT_DIR}/_static/* ${PPT_DIR}/
    rmdir ${PPT_DIR}/_static
    
    echo "✅ 文件移动完成"
fi

# 3. 创建 PPT 导航页面（如果不存在）
if [[ ! -f "${PPT_DIR}/index.html" ]]; then
    echo "📄 创建 PPT 导航页面..."
    
    cat > ${PPT_DIR}/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEEPNEED 演示文稿</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0; padding: 40px 20px;
            background: radial-gradient(ellipse at top, #1f2937 0%, #0a0e1a 50%), #0a0e1a;
            color: white; min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
        }
        
        .container {
            max-width: 800px; text-align: center;
        }
        
        h1 {
            font-size: 2.5rem; margin-bottom: 30px;
            background: linear-gradient(135deg, #ffffff 0%, #00ff94 50%, #ffd93d 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .options {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px; margin: 40px 0;
        }
        
        .option {
            background: rgba(17,24,39,0.8);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px; padding: 30px;
            text-decoration: none; color: inherit;
            transition: all 0.3s ease;
        }
        
        .option:hover {
            transform: translateY(-5px);
            border-color: #00ff94;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .option h3 {
            color: #00ff94; margin-bottom: 15px; font-size: 1.3rem;
        }
        
        .option p {
            color: #9ca3af; line-height: 1.5;
        }
        
        .back {
            margin-top: 30px;
        }
        
        .back a {
            color: #9ca3af; text-decoration: none;
        }
        
        .back a:hover {
            color: #00ff94;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>DEEPNEED 企业演示</h1>
        
        <div class="options">
            <a href="slides.html" class="option">
                <h3>🎯 在线演示</h3>
                <p>交互式在线演示文稿<br>支持键盘导航和动画效果</p>
            </a>
            
            <a href="slides.html?print-pdf" class="option" target="_blank">
                <h3>📄 PDF 版本</h3>
                <p>适合打印的 PDF 格式<br>可下载保存到本地</p>
            </a>
            
            <a href="slides.html?embedded=true" class="option" target="_blank">
                <h3>📱 嵌入版本</h3>
                <p>简化界面版本<br>适合嵌入到其他页面</p>
            </a>
        </div>
        
        <div class="back">
            <a href="/">← 返回主页</a>
        </div>
    </div>
</body>
</html>
EOF
    
    echo "✅ PPT 导航页面创建完成"
fi

# 4. 检查关键文件
echo "📋 检查关键文件："
if [[ -f "${PPT_DIR}/slides.html" ]]; then
    echo "✅ slides.html 存在"
else
    echo "❌ slides.html 不存在"
fi

if [[ -f "${PPT_DIR}/index.html" ]]; then
    echo "✅ index.html 存在"
else
    echo "❌ index.html 不存在"
fi

# 5. 设置正确的权限
echo "🔐 设置文件权限..."
chown -R nginx:nginx ${PPT_DIR}
find ${PPT_DIR} -type f -exec chmod 644 {} \;
find ${PPT_DIR} -type d -exec chmod 755 {} \;

echo "✅ 权限设置完成"

# 6. 检查 Nginx 配置
echo "🌐 检查 Nginx 配置..."
if nginx -t > /dev/null 2>&1; then
    echo "✅ Nginx 配置正确"
    systemctl reload nginx
    echo "✅ Nginx 已重载"
else
    echo "❌ Nginx 配置有误"
    nginx -t
fi

# 7. 显示最终状态
echo ""
echo "=========================================="
echo "🎉 PPT 修复完成！"
echo "=========================================="
echo ""
echo "📁 文件结构："
ls -la ${PPT_DIR}/
echo ""
echo "🌐 访问地址："
echo "   PPT 导航页: https://${DOMAIN}/ppt/"
echo "   直接演示: https://${DOMAIN}/ppt/slides.html"
echo ""
echo "🔧 如果仍有问题，请检查："
echo "   1. 文件是否存在: ls -la ${PPT_DIR}/"
echo "   2. Nginx 错误日志: tail -f /var/log/nginx/error.log"
echo "   3. 权限设置: ls -la ${PPT_DIR}/"
echo ""
EOF 