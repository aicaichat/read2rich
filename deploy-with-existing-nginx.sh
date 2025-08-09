#!/bin/bash

# DeepNeed 项目部署脚本 - 使用现有nginx
# 适用于已有nginx的服务器

set -e

echo "🚀 开始部署 DeepNeed 项目..."

# 检查是否为root用户（可选）
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  检测到使用root用户运行"
    echo "建议使用普通用户运行以提高安全性"
    echo "是否继续？(y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "部署已取消"
        exit 1
    fi
fi

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="deepneed"
DOMAIN="${1:-deepneed.com.cn}"
WEB_PORT="3000"
API_PORT="8000"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

# 是否启用 AI Opportunity Finder 微服务（交互式设置，或通过环境变量 ENABLE_OPF=true 预设）
OPF_ENABLE=${ENABLE_OPF:-""}
OPF_API_PORT="8081" # apps/opportunity_finder/api_gateway 对外映射端口

# 检查环境变量文件
check_env_file() {
    echo -e "${BLUE}🔍 检查环境变量配置...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}⚠️  未找到 .env 文件${NC}"
        echo "请按照以下步骤配置环境变量："
        echo "1. 复制 env.example 为 .env"
        echo "2. 编辑 .env 文件，填入您的API keys"
        echo ""
        echo "是否要现在创建 .env 文件？(y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            if [ -f "env.example" ]; then
                cp env.example .env
                echo -e "${GREEN}✅ 已创建 .env 文件${NC}"
                echo -e "${YELLOW}⚠️  请编辑 .env 文件，填入您的API keys${NC}"
                echo "按回车键继续..."
                read
            else
                echo -e "${RED}❌ 未找到 env.example 文件${NC}"
                exit 1
            fi
        else
            echo -e "${RED}❌ 部署已取消${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ 找到 .env 文件${NC}"
    fi
    
    # 检查必需的API key
    if ! grep -q "DEEPSEEK_API_KEY=.*[^[:space:]]" .env; then
        echo -e "${RED}❌ 请在 .env 文件中设置 DEEPSEEK_API_KEY${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 环境变量检查通过${NC}"
}

echo -e "${BLUE}📋 部署配置:${NC}"
echo "  域名: $DOMAIN"
echo "  前端端口: $WEB_PORT"
echo "  后端端口: $API_PORT"
echo ""

# 检查Docker和Docker Compose
check_dependencies() {
    echo -e "${BLUE}🔍 检查依赖...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 依赖检查通过${NC}"
}

# 创建项目目录
setup_project() {
    echo -e "${BLUE}📁 设置项目目录...${NC}"

    # 解析路径函数（兼容无 realpath 的环境）
    resolve_path() {
        local target="$1"
        if command -v readlink >/dev/null 2>&1; then
            readlink -f "$target" 2>/dev/null || python3 -c 'import os,sys;print(os.path.realpath(sys.argv[1]))' "$target"
        else
            python3 -c 'import os,sys;print(os.path.realpath(sys.argv[1]))' "$target"
        fi
    }

    SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)"
    DEST_DIR="/opt/$PROJECT_NAME"

    mkdir -p "$DEST_DIR"

    # 如果是root用户，设置适当的权限
    if [ "$EUID" -eq 0 ]; then
        ACTUAL_USER=${SUDO_USER:-$USER}
        chown "$ACTUAL_USER":"$ACTUAL_USER" "$DEST_DIR"
    fi

    SRC_REAL="$(resolve_path "$SOURCE_DIR")"
    DST_REAL="$(resolve_path "$DEST_DIR")"

    if [ "$SRC_REAL" = "$DST_REAL" ]; then
        echo -e "${YELLOW}ℹ️  检测到代码已在目标目录，跳过文件复制${NC}"
    else
        echo "同步项目文件到 $DEST_DIR ..."
        if command -v rsync >/dev/null 2>&1; then
            rsync -a --delete --exclude '.git' --exclude 'node_modules' --exclude 'venv' "$SOURCE_DIR/" "$DEST_DIR/"
        else
            cp -a "$SOURCE_DIR/." "$DEST_DIR/"
        fi
    fi

    cd "$DEST_DIR"

    echo -e "${GREEN}✅ 项目目录设置完成${NC}"
}

# 询问是否部署 Opportunity Finder 微服务
prompt_opf_enable() {
    if [ -n "$OPF_ENABLE" ]; then
        # 已通过环境变量设置
        if [[ "$OPF_ENABLE" =~ ^(true|TRUE|1|yes|Y)$ ]]; then
            OPF_ENABLE=true
        else
            OPF_ENABLE=false
        fi
        echo -e "${BLUE}🧩 Opportunity Finder 微服务：${NC} ${OPF_ENABLE} (来自 ENABLE_OPF 环境变量)"
        return 0
    fi
    echo -e "${BLUE}🧩 是否部署 AI Opportunity Finder 微服务并配置 /opfinder-api/ 反向代理？(y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        OPF_ENABLE=true
    else
        OPF_ENABLE=false
    fi
}

# 部署 Opportunity Finder 微服务集群
deploy_opf_services() {
    if [ "$OPF_ENABLE" != true ]; then
        return 0
    fi
    echo -e "${BLUE}🧩 部署 AI Opportunity Finder 微服务...${NC}"

    local OPF_DIR="/opt/$PROJECT_NAME/apps/opportunity_finder"
    if [ ! -d "$OPF_DIR" ]; then
        echo -e "${RED}❌ 未找到 $OPF_DIR，确认项目已完整复制${NC}"
        return 1
    fi

    pushd "$OPF_DIR" >/dev/null

    # 环境文件
    if [ ! -f .env ]; then
        if [ -f env.example ]; then
            cp env.example .env
            echo -e "${YELLOW}⚠️  已为 Opportunity Finder 生成默认 .env，请按需修改 ${OPF_DIR}/.env${NC}"
        else
            echo -e "${RED}❌ 未找到 ${OPF_DIR}/env.example，请手动创建 .env${NC}"
            popd >/dev/null
            return 1
        fi
    fi

    # 构建并启动
    docker-compose up -d --build

    echo -e "${GREEN}✅ Opportunity Finder 微服务已启动${NC}"

    # 基本健康检查：API Gateway
    sleep 5
    if curl -fsS http://localhost:${OPF_API_PORT}/monitor/status >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Opportunity Finder API Gateway 正常 (${OPF_API_PORT})${NC}"
    else
        echo -e "${YELLOW}⚠️ Opportunity Finder API Gateway 健康检查失败（端口 ${OPF_API_PORT}），请稍后重试${NC}"
    fi

    popd >/dev/null
}

# 构建和启动服务
deploy_services() {
    echo -e "${BLUE}🐳 构建和启动Docker服务...${NC}"
    
    # 停止现有容器
    docker-compose -f docker-compose.production.yml down 2>/dev/null || true
    
    # 构建镜像
    echo "构建前端镜像..."
    docker-compose -f docker-compose.production.yml build frontend
    
    echo "构建后端镜像..."
    docker-compose -f docker-compose.production.yml build backend
    
    # 启动服务
    echo "启动服务..."
    docker-compose -f docker-compose.production.yml up -d
    
    echo -e "${GREEN}✅ 服务启动完成${NC}"
}

# 配置nginx
configure_nginx() {
    echo -e "${BLUE}🌐 配置nginx...${NC}"
    
    # 检查是否已有deepneed.com.cn配置
    if [ -f "/etc/nginx/conf.d/deepneed.com.cn.conf" ]; then
        echo -e "${YELLOW}⚠️  检测到现有deepneed.com.cn配置${NC}"
        echo "是否要更新现有配置以支持Docker容器代理？(y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            # 备份原配置
            cp /etc/nginx/conf.d/deepneed.com.cn.conf /etc/nginx/conf.d/deepneed.com.cn.conf.backup.$(date +%Y%m%d_%H%M%S)
            echo -e "${GREEN}✅ 已备份原配置${NC}"
            
            # 检查是否存在SSL证书
            SSL_CERT_EXISTS=false
            if [ -f "/etc/letsencrypt/live/deepneed.com.cn/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/deepneed.com.cn/privkey.pem" ]; then
                SSL_CERT_EXISTS=true
                echo -e "${GREEN}✅ 检测到现有SSL证书${NC}"
            else
                echo -e "${YELLOW}⚠️  未检测到SSL证书，将创建HTTP配置${NC}"
            fi
            
            # 根据SSL证书存在情况生成配置
            # 若启用 OPF，为 nginx 片段准备可选 location 块
            OPF_LOCATION=""
            if [ "$OPF_ENABLE" = true ]; then
read -r -d '' OPF_LOCATION << 'OPFSSL'

    # AI Opportunity Finder API 反向代理
    location /opfinder-api/ {
        proxy_pass http://localhost:8081/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
OPFSSL
                # 转义 $ 以避免 heredoc 展开冲突
                OPF_LOCATION=${OPF_LOCATION//$/\$}
            fi

            if [ "$SSL_CERT_EXISTS" = true ]; then
                # HTTPS配置 - 使用现有SSL证书
                cat > /tmp/deepneed_update.conf << EOF
# HTTPS配置 - 主服务器
server {
    server_name deepneed.com.cn www.deepneed.com.cn;
    
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

    # 前端代理 - 指向Docker容器
    location / {
        proxy_pass http://localhost:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
    
    # API代理 - 指向Docker容器
    location /api/ {
        proxy_pass http://localhost:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

${OPF_LOCATION}
    
    # 静态文件缓存（通过上游容器代理，避免本机文件系统404）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # 隐藏 Nginx 版本
    server_tokens off;

    # 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/deepneed.com.cn/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/deepneed.com.cn/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# HTTP重定向到HTTPS
server {
    if (\$host = www.deepneed.com.cn) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    if (\$host = deepneed.com.cn) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    listen 80;
    server_name deepneed.com.cn www.deepneed.com.cn;
    return 404; # managed by Certbot
}
EOF
            else
                # 若启用 OPF，为 nginx 片段准备可选 location 块（HTTP）
                OPF_LOCATION_HTTP=""
                if [ "$OPF_ENABLE" = true ]; then
read -r -d '' OPF_LOCATION_HTTP << 'OPFHTTP'

    # AI Opportunity Finder API 反向代理
    location /opfinder-api/ {
        proxy_pass http://localhost:8081/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
OPFHTTP
                    OPF_LOCATION_HTTP=${OPF_LOCATION_HTTP//$/\$}
                fi

                # HTTP配置
                cat > /tmp/deepneed_update.conf << EOF
# HTTP配置 - 主服务器
server {
    server_name deepneed.com.cn www.deepneed.com.cn;
    
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

    # 前端代理 - 指向Docker容器
    location / {
        proxy_pass http://localhost:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
    
    # API代理 - 指向Docker容器
    location /api/ {
        proxy_pass http://localhost:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

${OPF_LOCATION_HTTP}
    
    # 静态文件缓存（通过上游容器代理，避免本机文件系统404）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # 隐藏 Nginx 版本
    server_tokens off;

    # 404 页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    listen 80;
}
EOF
            fi
            
            # 更新配置
            cp /tmp/deepneed_update.conf /etc/nginx/conf.d/deepneed.com.cn.conf
            echo -e "${GREEN}✅ 已更新nginx配置${NC}"
        else
            echo -e "${YELLOW}⚠️  跳过nginx配置更新${NC}"
            return 0
        fi
    else
        # 创建新的配置文件 - 指向Docker容器
        cat > /tmp/deepneed.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # 前端代理 - 指向Docker容器
    location / {
        proxy_pass http://localhost:$WEB_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # API代理 - 指向Docker容器
    location /api/ {
        proxy_pass http://localhost:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

$(if [ "$OPF_ENABLE" = true ]; then cat << 'EOI'

    # AI Opportunity Finder API 反向代理
    location /opfinder-api/ {
        proxy_pass http://localhost:8081/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
EOI
; fi)
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:$WEB_PORT;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
        
        # 复制配置文件
        cp /tmp/deepneed.conf $NGINX_CONF_DIR/deepneed
        
        # 启用站点
        ln -sf $NGINX_CONF_DIR/deepneed $NGINX_ENABLED_DIR/deepneed
    fi
    
    # 测试nginx配置
    if nginx -t; then
        systemctl reload nginx
        echo -e "${GREEN}✅ nginx配置完成${NC}"
    else
        echo -e "${RED}❌ nginx配置错误${NC}"
        exit 1
    fi
}

# 设置SSL证书（可选）
setup_ssl() {
    echo -e "${BLUE}🔒 设置SSL证书...${NC}"
    
    if command -v certbot &> /dev/null; then
        echo "检测到certbot，是否要设置SSL证书？(y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            certbot --nginx -d $DOMAIN
            echo -e "${GREEN}✅ SSL证书设置完成${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  certbot未安装，跳过SSL设置${NC}"
        echo "如需SSL，请手动安装certbot: apt install certbot python3-certbot-nginx"
    fi
}

# 创建systemd服务
create_systemd_service() {
    echo -e "${BLUE}⚙️ 创建systemd服务...${NC}"
    
    # 创建服务文件
    cat > /tmp/deepneed.service << EOF
[Unit]
Description=DeepNeed Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/$PROJECT_NAME
ExecStart=/usr/local/bin/docker-compose -f docker-compose.production.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.production.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
    
    cp /tmp/deepneed.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable deepneed
    
    echo -e "${GREEN}✅ systemd服务创建完成${NC}"
}

# 为 Opportunity Finder 创建独立的 systemd 服务（可选）
create_systemd_service_opf() {
    if [ "$OPF_ENABLE" != true ]; then
        return 0
    fi
    echo -e "${BLUE}⚙️ 为 Opportunity Finder 创建 systemd 服务...${NC}"

    cat > /tmp/deepneed-opf.service << EOF
[Unit]
Description=DeepNeed Opportunity Finder Services
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/$PROJECT_NAME/apps/opportunity_finder
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    cp /tmp/deepneed-opf.service /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable deepneed-opf || true

    echo -e "${GREEN}✅ Opportunity Finder systemd 服务创建完成${NC}"
}

# 健康检查
health_check() {
    echo -e "${BLUE}🏥 健康检查...${NC}"
    
    # 等待服务启动
    sleep 10
    
    # 检查前端
    if curl -f http://localhost:$WEB_PORT > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 前端服务正常${NC}"
    else
        echo -e "${RED}❌ 前端服务异常${NC}"
    fi
    
    # 检查后端
    if curl -f http://localhost:$API_PORT/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 后端服务正常${NC}"
    else
        echo -e "${YELLOW}⚠️ 后端健康检查失败（可能没有/health端点）${NC}"
    fi
    
    # 检查nginx
    if curl -f http://$DOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✅ nginx代理正常${NC}"
    else
        echo -e "${RED}❌ nginx代理异常${NC}"
    fi

    # 检查 Opportunity Finder（如启用）
    if [ "$OPF_ENABLE" = true ]; then
        if curl -fsS http://localhost:${OPF_API_PORT}/monitor/status >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Opportunity Finder /monitor/status 正常${NC}"
        else
            echo -e "${YELLOW}⚠️ Opportunity Finder 健康检查失败（可能仍在启动中）${NC}"
        fi
    fi
}

# 显示部署信息
show_deployment_info() {
    echo ""
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo ""
    echo -e "${BLUE}📊 部署信息:${NC}"
    
    # 检查SSL证书存在情况来显示正确的URL
    if [ -f "/etc/letsencrypt/live/deepneed.com.cn/fullchain.pem" ] && [ -f "/etc/letsencrypt/live/deepneed.com.cn/privkey.pem" ]; then
        echo "  域名: https://deepneed.com.cn (SSL已启用)"
        SITE_URL="https://deepneed.com.cn"
    else
        echo "  域名: http://$DOMAIN"
        SITE_URL="http://$DOMAIN"
        if [ "$DOMAIN" != "deepneed.com.cn" ]; then
            echo "  注意: 检测到自定义域名，请确认SSL证书配置"
        fi
    fi
    
    echo "  前端端口: $WEB_PORT (Docker容器)"
    echo "  后端端口: $API_PORT (Docker容器)"
    echo "  项目目录: /opt/$PROJECT_NAME"
    echo ""
    echo -e "${BLUE}🔧 管理命令:${NC}"
    echo "  查看服务状态: sudo systemctl status deepneed"
    echo "  重启服务: sudo systemctl restart deepneed"
    echo "  查看日志: sudo journalctl -u deepneed -f"
    echo "  查看容器: docker-compose -f /opt/$PROJECT_NAME/docker-compose.production.yml ps"
    if [ "$OPF_ENABLE" = true ]; then
        echo "  OPF服务状态: sudo systemctl status deepneed-opf"
        echo "  重启OPF: sudo systemctl restart deepneed-opf"
    fi
    echo ""
    echo -e "${BLUE}📝 下一步:${NC}"
    echo "  1. 访问 $SITE_URL 查看应用"
    if [ ! -f "/etc/letsencrypt/live/deepneed.com.cn/fullchain.pem" ]; then
        echo "  2. 如需SSL，运行: sudo certbot --nginx -d $DOMAIN"
        echo "  3. 配置防火墙: sudo ufw allow 80,443"
    else
        echo "  2. SSL证书已配置，直接使用HTTPS访问"
        echo "  3. 如有问题，检查Docker容器状态"
    fi
    if [ "$OPF_ENABLE" = true ]; then
        echo ""
        echo "  Opportunity Finder API: $SITE_URL/opfinder-api/ (通过Nginx反代)"
        echo "  内部直连: http://localhost:${OPF_API_PORT}/monitor/status"
    fi
    echo ""
}

# 主执行流程
main() {
    echo -e "${GREEN}🚀 DeepNeed 项目部署开始${NC}"
    echo ""
    
    check_dependencies
    check_env_file
    setup_project
    prompt_opf_enable
    deploy_services
    deploy_opf_services
    configure_nginx
    setup_ssl
    create_systemd_service
    create_systemd_service_opf
    health_check
    show_deployment_info
}

# 执行主函数
main "$@" 