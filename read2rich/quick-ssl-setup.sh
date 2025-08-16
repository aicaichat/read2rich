#!/bin/bash

# 快速SSL设置脚本 - 适用于已有nginx的服务器

DOMAIN="read2rich.com"
EMAIL="admin@read2rich.com"

echo "🔒 快速SSL证书设置"
echo "域名: $DOMAIN"

# 1. 安装certbot (如果没有)
if ! command -v certbot &> /dev/null; then
    echo "安装 certbot..."
    if command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-nginx
    else
        sudo apt install -y certbot python3-certbot-nginx
    fi
fi

# 2. 申请证书
echo "申请SSL证书..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# 3. 设置自动续期
echo "设置自动续期..."
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | sudo crontab -

echo "✅ SSL证书设置完成!"
echo "测试: curl -I https://$DOMAIN"
