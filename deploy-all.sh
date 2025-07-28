#!/bin/bash

# DEEPNEED 完整部署脚本
# 包含企业网站 + Web PPT 的一键部署

set -e

# 配置变量
DOMAIN="deepneed.com.cn"
SITE_DIR="/var/www/${DOMAIN}"
PPT_DIR="${SITE_DIR}/ppt"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

log_success() {
    echo -e "${PURPLE}[SUCCESS]${NC} $1"
}

# 检查是否为 root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        exit 1
    fi
}

# 检查必要文件
check_files() {
    log_step "检查部署文件..."
    
    local missing_files=()
    
    if [[ ! -d "deepneed_site" ]]; then
        missing_files+=("deepneed_site/")
    fi
    
    if [[ ! -d "_static" ]]; then
        missing_files+=("_static/")
    fi
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        log_error "缺少必要文件："
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        exit 1
    fi
    
    log_info "部署文件检查完成"
}

# 部署企业网站
deploy_website() {
    log_step "部署企业网站..."
    
    # 创建网站目录
    mkdir -p $SITE_DIR
    
    # 复制网站文件
    cp -r deepneed_site/* $SITE_DIR/
    
    # 设置权限
    chown -R nginx:nginx $SITE_DIR
    find $SITE_DIR -type f -exec chmod 644 {} \;
    find $SITE_DIR -type d -exec chmod 755 {} \;
    
    log_info "企业网站部署完成"
}

# 部署 PPT
deploy_ppt() {
    log_step "部署 Web PPT..."
    
    # 创建 PPT 目录
    mkdir -p $PPT_DIR
    
    # 复制 PPT 文件
    cp -r _static/* $PPT_DIR/
    
    # 创建 PPT 导航页面
    cat > $PPT_DIR/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEEPNEED 演示文稿 | AI 时代研发专家</title>
    <meta name="description" content="DEEPNEED 企业演示文稿，展示 AI 驱动的企业级产品研发服务与技术能力">
    <style>
        :root {
            --primary: #00ff94;
            --accent: #ffd93d;
            --secondary: #ff6b6b;
            --text: #ffffff;
            --text-muted: #9ca3af;
            --bg: #0a0e1a;
            --glass-bg: rgba(17,24,39,0.8);
            --glass-border: rgba(255,255,255,0.1);
            --radius: 20px;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0; padding: 0;
            background: radial-gradient(ellipse at top, #1f2937 0%, var(--bg) 50%), var(--bg);
            color: var(--text); min-height: 100vh;
            display: flex; flex-direction: column;
        }
        
        .header {
            padding: 20px 40px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--glass-border);
        }
        
        .logo {
            font-size: 1.6rem; font-weight: 800;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-decoration: none;
        }
        
        .container {
            flex: 1; display: flex; align-items: center; justify-content: center;
            padding: 40px 20px;
        }
        
        .content {
            max-width: 900px; text-align: center;
        }
        
        h1 {
            font-size: clamp(2rem, 4vw, 3.5rem); margin-bottom: 20px;
            background: linear-gradient(135deg, var(--text) 0%, var(--primary) 50%, var(--accent) 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            font-size: 1.2rem; color: var(--text-muted); margin-bottom: 50px;
            line-height: 1.6;
        }
        
        .ppt-options {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px; margin: 50px 0;
        }
        
        .ppt-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius); padding: 40px 30px;
            transition: all 0.4s ease;
            text-decoration: none; color: inherit;
            position: relative; overflow: hidden;
        }
        
        .ppt-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent), var(--secondary));
            transform: scaleX(0); transition: transform 0.4s ease;
        }
        
        .ppt-card:hover::before { transform: scaleX(1); }
        
        .ppt-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 60px rgba(0,0,0,0.4);
            border-color: rgba(0,255,148,0.4);
        }
        
        .ppt-icon {
            font-size: 3.5rem; margin-bottom: 25px;
            color: var(--primary);
        }
        
        .ppt-title {
            font-size: 1.5rem; font-weight: 700; margin-bottom: 15px;
            color: var(--text);
        }
        
        .ppt-desc {
            color: var(--text-muted); line-height: 1.6;
            font-size: 1rem;
        }
        
        .features {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 25px; margin: 60px 0;
        }
        
        .feature {
            background: rgba(0,255,148,0.1);
            border: 1px solid rgba(0,255,148,0.2);
            border-radius: 15px; padding: 25px;
            text-align: center; transition: all 0.3s ease;
        }
        
        .feature:hover {
            background: rgba(0,255,148,0.15);
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: 2.2rem; color: var(--primary); margin-bottom: 15px;
        }
        
        .feature-text {
            font-size: 1rem; color: #e5e7eb; font-weight: 500;
        }
        
        .back-link {
            margin-top: 40px;
        }
        
        .back-link a {
            color: var(--text-muted); text-decoration: none;
            transition: all 0.3s ease; font-size: 1.1rem;
        }
        
        .back-link a:hover {
            color: var(--primary);
        }
        
        @media (max-width: 768px) {
            .header { padding: 15px 20px; }
            .container { padding: 30px 20px; }
            .ppt-options { grid-template-columns: 1fr; gap: 25px; }
            .content { max-width: 100%; }
        }
    </style>
</head>
<body>
    <div class="header">
        <a href="/" class="logo">DEEPNEED</a>
    </div>
    
    <div class="container">
        <div class="content">
            <h1>企业演示文稿</h1>
            <p class="subtitle">
                探索 DEEPNEED 的 AI 驱动企业级产品研发服务<br>
                了解我们的技术能力与成功案例
            </p>
            
            <div class="ppt-options">
                <a href="slides.html" class="ppt-card">
                    <div class="ppt-icon">🎯</div>
                    <div class="ppt-title">在线演示</div>
                    <div class="ppt-desc">
                        交互式在线演示文稿<br>
                        支持键盘导航和动画效果
                    </div>
                </a>
                
                <a href="slides.html?print-pdf" class="ppt-card" target="_blank">
                    <div class="ppt-icon">📄</div>
                    <div class="ppt-title">PDF 打印版</div>
                    <div class="ppt-desc">
                        适合打印的 PDF 格式<br>
                        可下载保存到本地
                    </div>
                </a>
                
                <a href="slides.html?embedded=true" class="ppt-card" target="_blank">
                    <div class="ppt-icon">📱</div>
                    <div class="ppt-title">嵌入版本</div>
                    <div class="ppt-desc">
                        简化界面版本<br>
                        适合嵌入到其他页面
                    </div>
                </a>
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <div class="feature-text">响应式设计</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎨</div>
                    <div class="feature-text">现代化界面</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div class="feature-text">数据可视化</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔗</div>
                    <div class="feature-text">分享友好</div>
                </div>
            </div>
            
            <div class="back-link">
                <a href="/">← 返回主页</a>
            </div>
        </div>
    </div>
</body>
</html>
EOF
    
    # 设置权限
    chown -R nginx:nginx $PPT_DIR
    find $PPT_DIR -type f -exec chmod 644 {} \;
    find $PPT_DIR -type d -exec chmod 755 {} \;
    
    log_info "Web PPT 部署完成"
}

# 配置 Nginx
configure_nginx() {
    log_step "配置 Nginx..."
    
    # 创建 Nginx 配置文件
    cat > /etc/nginx/conf.d/${DOMAIN}.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # PPT 演示文稿
    location /ppt/ {
        alias ${PPT_DIR}/;
        index index.html slides.html;
        try_files \$uri \$uri/ /ppt/index.html;
        
        # PPT 特殊缓存配置
        location ~* \\.(js|css|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public";
        }
        
        # 允许 iframe 嵌入
        add_header X-Frame-Options "SAMEORIGIN" always;
    }
    
    # 主页面
    location / {
        root ${SITE_DIR};
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # 静态资源缓存
        location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 安全配置
    location ~ /\\. {
        deny all;
    }
    
    # robots.txt
    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }
}
EOF
    
    # 测试配置
    if nginx -t > /dev/null 2>&1; then
        log_info "Nginx 配置文件创建成功"
    else
        log_error "Nginx 配置文件有误"
        nginx -t
        exit 1
    fi
}

# 创建 robots.txt
create_robots() {
    log_step "创建 robots.txt..."
    
    cat > $SITE_DIR/robots.txt << 'EOF'
User-agent: *
Allow: /
Allow: /ppt/

Sitemap: https://deepneed.com.cn/sitemap.xml
EOF
    
    chown nginx:nginx $SITE_DIR/robots.txt
    chmod 644 $SITE_DIR/robots.txt
    log_info "robots.txt 创建完成"
}

# 申请 SSL 证书
setup_ssl() {
    log_step "申请 SSL 证书..."
    
    # 检查 certbot 是否安装
    if ! command -v certbot &> /dev/null; then
        log_info "安装 certbot..."
        yum install -y certbot python3-certbot-nginx
    fi
    
    # 临时启动 Nginx（用于验证域名）
    systemctl start nginx
    
    # 申请证书
    if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN; then
        log_info "SSL 证书申请成功"
        
        # 设置自动续期
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
        log_info "SSL 证书自动续期已设置"
    else
        log_warn "SSL 证书申请失败，使用 HTTP 模式"
        # 创建 HTTP 版本的配置
        cat > /etc/nginx/conf.d/${DOMAIN}.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # PPT 演示文稿
    location /ppt/ {
        alias ${PPT_DIR}/;
        index index.html slides.html;
        try_files \$uri \$uri/ /ppt/index.html;
        
        location ~* \\.(js|css|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public";
        }
    }
    
    # 主页面
    location / {
        root ${SITE_DIR};
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        location ~* \\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    location ~ /\\. {
        deny all;
    }
}
EOF
    fi
}

# 启动服务
start_services() {
    log_step "启动服务..."
    
    # 重载 Nginx
    systemctl reload nginx
    systemctl enable nginx
    
    # 检查服务状态
    if systemctl is-active --quiet nginx; then
        log_info "Nginx 服务运行正常"
    else
        log_error "Nginx 服务启动失败"
        systemctl status nginx
        exit 1
    fi
}

# 显示结果
show_result() {
    echo
    echo "=========================================="
    echo -e "${GREEN}🎉 DEEPNEED 完整部署成功！${NC}"
    echo "=========================================="
    echo
    echo "📋 部署信息:"
    echo "   域名: $DOMAIN"
    echo "   网站目录: $SITE_DIR"
    echo "   PPT 目录: $PPT_DIR"
    echo
    echo "🌐 访问地址:"
    if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
        echo "   主页: https://$DOMAIN/"
        echo "   PPT: https://$DOMAIN/ppt/"
        echo "   演示: https://$DOMAIN/ppt/slides.html"
    else
        echo "   主页: http://$DOMAIN/"
        echo "   PPT: http://$DOMAIN/ppt/"
        echo "   演示: http://$DOMAIN/ppt/slides.html"
    fi
    echo
    echo "🎯 功能特性:"
    echo "   ✅ 响应式企业官网"
    echo "   ✅ 双语支持（中英文）"
    echo "   ✅ 在线演示 PPT"
    echo "   ✅ PDF 导出功能"
    echo "   ✅ SEO 优化"
    echo "   ✅ 安全加固"
    echo "   ✅ 性能优化"
    echo
    echo "🔧 PPT 控制:"
    echo "   - 方向键: 翻页导航"
    echo "   - F 键: 全屏模式"
    echo "   - S 键: 演讲者视图"
    echo "   - ? 键: 帮助菜单"
    echo
    echo "📱 分享链接:"
    local protocol="http"
    if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
        protocol="https"
    fi
    echo "   在线演示: ${protocol}://$DOMAIN/ppt/slides.html"
    echo "   PDF 版本: ${protocol}://$DOMAIN/ppt/slides.html?print-pdf"
    echo "   嵌入版本: ${protocol}://$DOMAIN/ppt/slides.html?embedded=true"
    echo
    echo -e "${BLUE}🚀 立即访问: ${protocol}://$DOMAIN${NC}"
    echo
    echo "📞 技术支持:"
    echo "   如有问题，请检查 Nginx 日志: tail -f /var/log/nginx/error.log"
    echo
}

# 主函数
main() {
    echo -e "${PURPLE}"
    echo "========================================"
    echo "    DEEPNEED 完整部署脚本 v2.0"
    echo "    企业网站 + Web PPT 一键部署"
    echo "========================================"
    echo -e "${NC}"
    
    check_root
    check_files
    deploy_website
    deploy_ppt
    configure_nginx
    create_robots
    setup_ssl
    start_services
    show_result
}

# 执行主函数
main "$@" 