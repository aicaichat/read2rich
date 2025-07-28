#!/bin/bash

# DEEPNEED 网站一键部署脚本
# 适用于 CentOS 7/8 + Nginx

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
NC='\033[0m' # No Color

# 日志函数
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

# 检查是否为 root 用户
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        exit 1
    fi
}

# 检查系统版本
check_system() {
    if [[ -f /etc/redhat-release ]]; then
        OS="centos"
        VER=$(cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+' | head -1)
        log_info "检测到系统: CentOS $VER"
    else
        log_error "不支持的系统，仅支持 CentOS"
        exit 1
    fi
}

# 系统更新
update_system() {
    log_step "更新系统..."
    yum update -y > /dev/null 2>&1
    yum install -y wget curl vim tar > /dev/null 2>&1
    log_info "系统更新完成"
}

# 安装 Nginx
install_nginx() {
    log_step "安装 Nginx..."
    
    # 检查是否已安装
    if command -v nginx > /dev/null 2>&1; then
        log_warn "Nginx 已安装，跳过安装步骤"
        return
    fi
    
    yum install -y epel-release > /dev/null 2>&1
    yum install -y nginx > /dev/null 2>&1
    
    systemctl start nginx
    systemctl enable nginx
    
    log_info "Nginx 安装完成"
}

# 配置防火墙
configure_firewall() {
    log_step "配置防火墙..."
    
    if systemctl is-active --quiet firewalld; then
        firewall-cmd --permanent --add-service=http > /dev/null 2>&1
        firewall-cmd --permanent --add-service=https > /dev/null 2>&1
        firewall-cmd --reload > /dev/null 2>&1
        log_info "防火墙配置完成"
    else
        log_warn "防火墙未启用，跳过配置"
    fi
}

# 创建网站目录
create_site_directory() {
    log_step "创建网站目录..."
    
    mkdir -p $SITE_DIR
    chown -R nginx:nginx $SITE_DIR
    chmod -R 755 $SITE_DIR
    
    log_info "网站目录创建完成: $SITE_DIR"
}

# 部署网站文件
deploy_website() {
    log_step "部署网站文件..."
    
    # 检查是否存在网站文件
    if [[ -d "deepneed_site" ]]; then
        cp -r deepneed_site/* $SITE_DIR/
        log_info "从本地目录复制文件"
    else
        # 创建基础 index.html
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
    </style>
</head>
<body>
    <div class="container">
        <h1>DEEPNEED</h1>
        <p>AI 驱动的企业级产品研发专家</p>
        <div class="status">
            <p>🚀 网站部署成功！</p>
            <p>请上传您的网站文件到: /var/www/deepneed.com.cn</p>
        </div>
    </div>
</body>
</html>
EOF
        log_warn "未找到网站文件，创建了默认页面"
    fi
    
    # 设置权限
    chown -R nginx:nginx $SITE_DIR
    find $SITE_DIR -type f -exec chmod 644 {} \;
    find $SITE_DIR -type d -exec chmod 755 {} \;
    
    log_info "网站文件部署完成"
}

# 配置 Nginx
configure_nginx() {
    log_step "配置 Nginx..."
    
    # 备份默认配置
    if [[ -f /etc/nginx/conf.d/default.conf ]]; then
        mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
    fi
    
    # 创建站点配置
    cat > /etc/nginx/conf.d/${DOMAIN}.conf << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    root ${SITE_DIR};
    index index.html index.htm;

    # 日志配置
    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log /var/log/nginx/${DOMAIN}.error.log;

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
        try_files \$uri \$uri/ /index.html;
        
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
        systemctl restart nginx
        log_info "Nginx 配置完成"
    else
        log_error "Nginx 配置文件有误"
        exit 1
    fi
}

# 安装 SSL 证书
install_ssl() {
    log_step "安装 SSL 证书..."
    
    # 安装 Certbot
    yum install -y certbot python3-certbot-nginx > /dev/null 2>&1
    
    # 申请证书
    log_info "正在申请 SSL 证书，请确保域名已正确解析到此服务器..."
    
    if certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --non-interactive; then
        log_info "SSL 证书安装成功"
        
        # 设置自动续期
        echo "0 2 * * * /usr/bin/certbot renew --quiet" | crontab -
        log_info "已设置 SSL 证书自动续期"
    else
        log_warn "SSL 证书申请失败，可能是域名解析问题"
        log_info "您可以稍后手动执行: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
}

# 创建备份脚本
create_backup_script() {
    log_step "创建备份脚本..."
    
    mkdir -p /root/backups
    
    cat > /root/backup-website.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"
SITE_DIR="/var/www/deepneed.com.cn"

mkdir -p $BACKUP_DIR

# 备份网站文件
tar -czf $BACKUP_DIR/deepneed_site_$DATE.tar.gz -C $SITE_DIR .

# 备份 Nginx 配置
tar -czf $BACKUP_DIR/nginx_conf_$DATE.tar.gz /etc/nginx/conf.d/

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x /root/backup-website.sh
    
    # 添加定时备份
    (crontab -l 2>/dev/null; echo "0 3 * * * /root/backup-website.sh") | crontab -
    
    log_info "备份脚本创建完成"
}

# 显示部署结果
show_result() {
    echo
    echo "=========================================="
    echo -e "${GREEN}🎉 DEEPNEED 网站部署完成！${NC}"
    echo "=========================================="
    echo
    echo "📋 部署信息:"
    echo "   域名: $DOMAIN"
    echo "   网站目录: $SITE_DIR"
    echo "   Nginx 配置: /etc/nginx/conf.d/${DOMAIN}.conf"
    echo "   访问日志: /var/log/nginx/${DOMAIN}.access.log"
    echo "   错误日志: /var/log/nginx/${DOMAIN}.error.log"
    echo
    echo "🔧 管理命令:"
    echo "   重启 Nginx: systemctl restart nginx"
    echo "   查看状态: systemctl status nginx"
    echo "   测试配置: nginx -t"
    echo "   查看日志: tail -f /var/log/nginx/${DOMAIN}.access.log"
    echo
    echo "📁 文件上传:"
    echo "   scp -r your-files/* root@server-ip:$SITE_DIR/"
    echo
    echo "🔒 SSL 证书:"
    echo "   手动申请: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo "   续期测试: certbot renew --dry-run"
    echo
    echo "💾 备份:"
    echo "   手动备份: /root/backup-website.sh"
    echo "   自动备份: 每天凌晨3点"
    echo
    echo -e "${YELLOW}⚠️  请确保域名 DNS 解析已指向此服务器 IP${NC}"
    echo -e "${BLUE}🌐 访问: http://$DOMAIN${NC}"
    echo
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "    DEEPNEED 网站部署脚本"
    echo "    CentOS + Nginx + SSL"
    echo "========================================"
    echo -e "${NC}"
    
    check_root
    check_system
    update_system
    install_nginx
    configure_firewall
    create_site_directory
    deploy_website
    configure_nginx
    
    # 询问是否安装 SSL
    read -p "是否现在安装 SSL 证书？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_ssl
    else
        log_info "跳过 SSL 证书安装，您可以稍后手动安装"
    fi
    
    create_backup_script
    show_result
}

# 执行主函数
main "$@" 