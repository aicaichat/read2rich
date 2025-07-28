#!/bin/bash

# 远程 PPT 部署脚本
# 从本地执行，自动部署到远程服务器

set -e

# 配置变量 - 请根据实际情况修改
SERVER_IP="your-server-ip"  # 请替换为您的服务器IP
SERVER_USER="root"          # 服务器用户名
DOMAIN="deepneed.com.cn"
REMOTE_SITE_DIR="/var/www/${DOMAIN}"
REMOTE_PPT_DIR="${REMOTE_SITE_DIR}/ppt"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 检查必要文件
check_local_files() {
    log_step "检查本地文件..."
    
    if [[ ! -d "_static" ]]; then
        echo "❌ 未找到 _static 目录"
        echo "请先生成 PPT 静态文件："
        echo "npx reveal-md slides.md --static _static --static-dirs=images"
        exit 1
    fi
    
    if [[ ! -f "_static/slides.html" ]]; then
        echo "❌ 未找到 slides.html 文件"
        exit 1
    fi
    
    log_info "✅ 本地文件检查完成"
}

# 上传文件到服务器
upload_files() {
    log_step "上传 PPT 文件到服务器..."
    
    # 上传 PPT 静态文件
    scp -r _static/* ${SERVER_USER}@${SERVER_IP}:${REMOTE_PPT_DIR}/
    
    # 上传修复脚本
    scp fix-ppt-deployment.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
    
    log_info "✅ 文件上传完成"
}

# 在远程服务器执行命令
execute_remote_commands() {
    log_step "在远程服务器执行部署命令..."
    
    ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
        set -e
        
        DOMAIN="deepneed.com.cn"
        SITE_DIR="/var/www/${DOMAIN}"
        PPT_DIR="${SITE_DIR}/ppt"
        
        echo "🔧 开始修复 PPT 部署..."
        
        # 1. 创建 PPT 目录（如果不存在）
        mkdir -p ${PPT_DIR}
        
        # 2. 修复文件结构
        cd ${PPT_DIR}
        if [[ -d "_static" ]]; then
            echo "发现 _static 子目录，移动文件..."
            mv _static/* ./
            rmdir _static
        fi
        
        # 3. 创建 PPT 导航页面
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
        
        # 4. 设置权限
        chown -R nginx:nginx ${PPT_DIR}
        find ${PPT_DIR} -type f -exec chmod 644 {} \;
        find ${PPT_DIR} -type d -exec chmod 755 {} \;
        
        # 5. 检查关键文件
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
        
        # 6. 重载 Nginx
        nginx -t && systemctl reload nginx
        
        echo ""
        echo "=========================================="
        echo "🎉 PPT 部署完成！"
        echo "=========================================="
        echo "📁 文件列表："
        ls -la ${PPT_DIR}/
        echo ""
        echo "🌐 访问地址："
        echo "   PPT 导航页: https://${DOMAIN}/ppt/"
        echo "   直接演示: https://${DOMAIN}/ppt/slides.html"
        echo ""
ENDSSH
    
    log_info "✅ 远程部署完成"
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "    DEEPNEED PPT 远程部署脚本"
    echo "========================================"
    echo -e "${NC}"
    
    # 检查服务器配置
    if [[ "$SERVER_IP" == "your-server-ip" ]]; then
        echo "❌ 请先配置服务器IP地址"
        echo "编辑脚本中的 SERVER_IP 变量"
        exit 1
    fi
    
    check_local_files
    upload_files
    execute_remote_commands
    
    echo ""
    echo -e "${GREEN}🎉 部署完成！请访问 https://${DOMAIN}/ppt/ 查看效果${NC}"
}

# 执行主函数
main "$@" 