#!/bin/bash

# SSL问题诊断脚本

echo "🔍 SSL证书申请问题诊断"
echo "=================================="

# 1. 检查当前服务器IP
echo "📡 当前服务器IP:"
CURRENT_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || curl -s icanhazip.com 2>/dev/null)
echo "服务器IP: $CURRENT_IP"

# 2. 检查域名解析
echo ""
echo "🌐 域名解析检查:"
echo "read2rich.com 解析到:"
dig +short read2rich.com
echo "www.read2rich.com 解析到:"
dig +short www.read2rich.com

# 3. 检查端口开放情况
echo ""
echo "🔌 端口检查:"
echo "80端口状态:"
netstat -tlnp | grep :80 || echo "80端口未监听"
echo "443端口状态:"
netstat -tlnp | grep :443 || echo "443端口未监听"

# 4. 检查防火墙状态
echo ""
echo "🔥 防火墙状态:"
if command -v firewall-cmd &> /dev/null; then
    echo "Firewalld状态:"
    firewall-cmd --state 2>/dev/null || echo "Firewalld未运行"
    echo "开放的服务:"
    firewall-cmd --list-services 2>/dev/null || echo "无法获取服务列表"
    echo "开放的端口:"
    firewall-cmd --list-ports 2>/dev/null || echo "无法获取端口列表"
elif command -v ufw &> /dev/null; then
    echo "UFW状态:"
    ufw status
elif command -v iptables &> /dev/null; then
    echo "iptables规则:"
    iptables -L INPUT -n | grep -E "(80|443|ACCEPT|DROP)"
else
    echo "未检测到防火墙工具"
fi

# 5. 检查nginx状态和配置
echo ""
echo "🔧 Nginx状态:"
systemctl status nginx --no-pager -l
echo ""
echo "Nginx配置测试:"
nginx -t

# 6. 检查webroot目录
echo ""
echo "📁 Webroot目录检查:"
WEBROOT="/var/www/html"
echo "目录: $WEBROOT"
ls -la $WEBROOT 2>/dev/null || echo "目录不存在"
echo "权限:"
ls -ld $WEBROOT 2>/dev/null || echo "无法检查权限"

# 7. 测试HTTP访问
echo ""
echo "🧪 HTTP访问测试:"
echo "本地访问测试:"
curl -I http://localhost 2>/dev/null || echo "本地HTTP访问失败"
echo ""
echo "外部访问测试 (read2rich.com):"
curl -I http://read2rich.com 2>/dev/null || echo "外部HTTP访问失败"

# 8. 创建测试文件
echo ""
echo "📝 创建测试文件:"
mkdir -p $WEBROOT/.well-known/acme-challenge/
echo "test-file-$(date +%s)" > $WEBROOT/.well-known/acme-challenge/test-file
chmod 644 $WEBROOT/.well-known/acme-challenge/test-file
chown -R www-data:www-data $WEBROOT 2>/dev/null || chown -R nginx:nginx $WEBROOT 2>/dev/null || echo "无法设置权限"

echo "测试文件创建完成: $WEBROOT/.well-known/acme-challenge/test-file"
echo "测试访问: curl http://read2rich.com/.well-known/acme-challenge/test-file"

# 9. 建议解决方案
echo ""
echo "�� 建议解决方案:"
echo "1. 如果域名解析不正确，请在域名管理面板中设置A记录指向: $CURRENT_IP"
echo "2. 如果防火墙阻止了80/443端口，请开放这些端口"
echo "3. 如果nginx无法访问webroot目录，请检查权限设置"
echo "4. 可以先测试访问: http://read2rich.com/.well-known/acme-challenge/test-file"

