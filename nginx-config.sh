#!/bin/bash

# DEEPNEED Nginx 配置和 SSL 证书申请脚本

set -e

# 配置变量
DOMAIN="deepneed.com.cn"
SITE_DIR="/var/www/${DOMAIN}"
EMAIL="vip@deepneed.com.cn"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# 检查是否为 root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        exit 1
    fi
}

# 创建网站目录
create_site_directory() {
    log_step "创建网站目录..."
    mkdir -p $SITE_DIR
    mkdir -p $SITE_DIR/assets
    chown -R nginx:nginx $SITE_DIR
    chmod -R 755 $SITE_DIR
    log_info "网站目录创建完成: $SITE_DIR"
}

# 配置 Nginx
configure_nginx() {
    log_step "配置 Nginx..."
    
    # 备份默认配置
    if [[ -f /etc/nginx/conf.d/default.conf ]]; then
        mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true
    fi
    
    # 创建站点配置
    cat > /etc/nginx/conf.d/${DOMAIN}.conf << 'EOF'
server {
    listen 80;
    server_name deepneed.com.cn www.deepneed.com.cn;
    root /var/www/deepneed.com.cn;
    index index.html index.htm;

    # 日志配置
    access_log /var/log/nginx/deepneed.com.cn.access.log;
    error_log /var/log/nginx/deepneed.com.cn.error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }

    # 主页面
    location / {
        try_files $uri $uri/ /index.html;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }

    # 隐藏 Nginx 版本
    server_tokens off;

    # 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
EOF
    
    # 测试配置
    if nginx -t > /dev/null 2>&1; then
        systemctl reload nginx
        log_info "Nginx 配置完成并已重载"
    else
        log_error "Nginx 配置文件有误"
        nginx -t
        exit 1
    fi
}

# 配置防火墙
configure_firewall() {
    log_step "配置防火墙..."
    
    if systemctl is-active --quiet firewalld; then
        firewall-cmd --permanent --add-service=http > /dev/null 2>&1 || true
        firewall-cmd --permanent --add-service=https > /dev/null 2>&1 || true
        firewall-cmd --reload > /dev/null 2>&1 || true
        log_info "防火墙配置完成"
    else
        log_warn "防火墙未启用，跳过配置"
    fi
}

# 创建临时测试页面
create_test_page() {
    log_step "创建测试页面..."
    
    cat > $SITE_DIR/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEEPNEED · AI 时代研发专家</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0; padding: 0; 
            background: linear-gradient(135deg, #0a0e1a, #1f2937);
            color: white; text-align: center; 
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh;
        }
        .container { max-width: 600px; padding: 40px; }
        h1 { 
            font-size: 3rem; margin-bottom: 20px;
            background: linear-gradient(135deg, #00ff94, #ffd93d);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        p { font-size: 1.2rem; color: #9ca3af; line-height: 1.6; }
        .status { 
            background: rgba(0,255,148,0.1); 
            border: 1px solid rgba(0,255,148,0.3);
            padding: 20px; border-radius: 12px; margin-top: 30px;
        }
        .next-steps {
            background: rgba(255,217,61,0.1);
            border: 1px solid rgba(255,217,61,0.3);
            padding: 20px; border-radius: 12px; margin-top: 20px;
            text-align: left;
        }
        .next-steps h3 {
            color: #ffd93d; margin-top: 0;
        }
        .next-steps ol {
            color: #e5e7eb; padding-left: 20px;
        }
        .next-steps li {
            margin: 10px 0;
        }
        .cmd {
            background: rgba(0,0,0,0.3);
            padding: 8px 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #00ff94;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>DEEPNEED</h1>
        <p>AI 驱动的企业级产品研发专家</p>
        <div class="status">
            <p>🚀 Nginx 配置成功！</p>
            <p>网站目录: /var/www/deepneed.com.cn</p>
        </div>
        <div class="next-steps">
            <h3>📋 下一步操作</h3>
            <ol>
                <li>上传网站文件到服务器</li>
                <li>确保域名 DNS 解析已指向此服务器</li>
                <li>申请 SSL 证书</li>
            </ol>
            <p><strong>上传命令示例：</strong></p>
            <div class="cmd">scp -r deepneed_site/* root@server-ip:/var/www/deepneed.com.cn/</div>
        </div>
    </div>
</body>
</html>
EOF
    
    chown nginx:nginx $SITE_DIR/index.html
    chmod 644 $SITE_DIR/index.html
    log_info "测试页面创建完成"
}

# 安装 SSL 证书
install_ssl() {
    log_step "安装 SSL 证书..."
    
    # 检查是否已安装 certbot
    if ! command -v certbot > /dev/null 2>&1; then
        log_info "安装 Certbot..."
        yum install -y certbot python3-certbot-nginx > /dev/null 2>&1
    fi
    
    # 检查域名解析
    log_info "检查域名解析..."
    if ! nslookup $DOMAIN > /dev/null 2>&1; then
        log_warn "域名解析检查失败，请确保域名已正确解析到此服务器"
        log_info "您可以稍后手动执行: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        return
    fi
    
    # 申请证书
    log_info "正在申请 SSL 证书..."
    if certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --non-interactive; then
        log_info "SSL 证书安装成功"
        
        # 设置自动续期
        echo "0 2 * * * /usr/bin/certbot renew --quiet" | crontab -
        log_info "已设置 SSL 证书自动续期"
    else
        log_warn "SSL 证书申请失败，可能原因："
        log_warn "1. 域名解析未生效"
        log_warn "2. 防火墙阻止了 80 端口"
        log_warn "3. 服务器无法访问外网"
        log_info "您可以稍后手动执行: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
}

# 显示结果
show_result() {
    echo
    echo "=========================================="
    echo -e "${GREEN}🎉 Nginx 配置完成！${NC}"
    echo "=========================================="
    echo
    echo "📋 配置信息:"
    echo "   域名: $DOMAIN"
    echo "   网站目录: $SITE_DIR"
    echo "   Nginx 配置: /etc/nginx/conf.d/${DOMAIN}.conf"
    echo "   访问日志: /var/log/nginx/${DOMAIN}.access.log"
    echo "   错误日志: /var/log/nginx/${DOMAIN}.error.log"
    echo
    echo "🔧 管理命令:"
    echo "   重启 Nginx: systemctl restart nginx"
    echo "   重载配置: systemctl reload nginx"
    echo "   查看状态: systemctl status nginx"
    echo "   测试配置: nginx -t"
    echo "   查看日志: tail -f /var/log/nginx/${DOMAIN}.access.log"
    echo
    echo "📁 上传网站文件:"
    echo "   scp -r deepneed_site/* root@server-ip:$SITE_DIR/"
    echo
    echo "🔒 SSL 证书:"
    echo "   手动申请: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo "   续期测试: certbot renew --dry-run"
    echo "   查看证书: certbot certificates"
    echo
    echo "🌐 测试访问:"
    echo "   HTTP: curl -I http://$DOMAIN"
    echo "   HTTPS: curl -I https://$DOMAIN"
    echo
    echo -e "${YELLOW}⚠️  请确保域名 DNS 解析已指向此服务器 IP${NC}"
    echo -e "${BLUE}🌐 访问测试页面: http://$DOMAIN${NC}"
    echo
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "    DEEPNEED Nginx 配置脚本"
    echo "========================================"
    echo -e "${NC}"
    
    check_root
    create_site_directory
    configure_nginx
    configure_firewall
    create_test_page
    
    # 询问是否现在申请 SSL 证书
    read -p "是否现在申请 SSL 证书？请确保域名已解析到此服务器 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_ssl
    else
        log_info "跳过 SSL 证书申请，您可以稍后手动申请"
    fi
    
    show_result
}

# 执行主函数
main "$@" 