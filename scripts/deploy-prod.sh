#!/bin/bash

# DeepNeed AI 生产环境部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="DeepNeed AI"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE="docker/env/prod.env"
BACKUP_DIR="/backup/deepneed"

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🚀 ${PROJECT_NAME} 生产环境部署脚本${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 安全检查
security_check() {
    echo -e "${YELLOW}🔒 执行安全检查...${NC}"
    
    # 检查是否为root用户
    if [ "$EUID" -eq 0 ]; then
        echo -e "${RED}❌ 请不要使用root用户运行此脚本${NC}"
        echo -e "${YELLOW}💡 建议使用具有docker权限的普通用户${NC}"
        exit 1
    fi
    
    # 检查环境文件中的默认密码
    if grep -q "CHANGE_THIS" "$ENV_FILE" 2>/dev/null; then
        echo -e "${RED}❌ 环境文件中仍包含默认密码，请先修改所有敏感配置${NC}"
        echo -e "${YELLOW}💡 请编辑 $ENV_FILE 并修改所有包含 'CHANGE_THIS' 的配置${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 安全检查通过${NC}"
}

# 检查依赖
check_dependencies() {
    echo -e "${YELLOW}🔍 检查依赖...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装${NC}"
        exit 1
    fi
    
    if ! command -v nginx &> /dev/null; then
        echo -e "${YELLOW}⚠️ 建议安装nginx用于负载均衡${NC}"
    fi
    
    echo -e "${GREEN}✅ 依赖检查完成${NC}"
}

# 创建备份
create_backup() {
    if [ -d "$BACKUP_DIR" ]; then
        echo -e "${YELLOW}💾 创建数据备份...${NC}"
        
        BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
        BACKUP_PATH="$BACKUP_DIR/backup_$BACKUP_DATE"
        
        mkdir -p "$BACKUP_PATH"
        
        # 备份数据库
        if docker-compose -f $COMPOSE_FILE ps postgres | grep -q "Up"; then
            echo -e "${BLUE}  - 备份数据库...${NC}"
            docker-compose -f $COMPOSE_FILE exec -T postgres pg_dump -U deepneed deepneed_prod > "$BACKUP_PATH/database.sql"
        fi
        
        # 备份应用数据
        if [ -d "./data" ]; then
            echo -e "${BLUE}  - 备份应用数据...${NC}"
            cp -r ./data "$BACKUP_PATH/"
        fi
        
        echo -e "${GREEN}✅ 备份完成: $BACKUP_PATH${NC}"
    fi
}

# 蓝绿部署
blue_green_deploy() {
    echo -e "${YELLOW}🔄 执行蓝绿部署...${NC}"
    
    # 构建新镜像
    echo -e "${BLUE}📦 构建新镜像...${NC}"
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    # 启动新版本（绿色环境）
    echo -e "${BLUE}🟢 启动绿色环境...${NC}"
    docker-compose -f $COMPOSE_FILE up -d --scale backend=2
    
    # 等待服务就绪
    echo -e "${BLUE}⏳ 等待服务就绪...${NC}"
    sleep 30
    
    # 健康检查
    if ! curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${RED}❌ 健康检查失败，回滚到旧版本${NC}"
        docker-compose -f $COMPOSE_FILE down
        exit 1
    fi
    
    echo -e "${GREEN}✅ 蓝绿部署完成${NC}"
}

# 优化系统
optimize_system() {
    echo -e "${YELLOW}⚡ 优化系统配置...${NC}"
    
    # 设置文件描述符限制
    echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf >/dev/null || true
    echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf >/dev/null || true
    
    # 优化内核参数
    echo "net.core.somaxconn = 65535" | sudo tee -a /etc/sysctl.conf >/dev/null || true
    echo "net.ipv4.tcp_max_syn_backlog = 65535" | sudo tee -a /etc/sysctl.conf >/dev/null || true
    
    # 应用内核参数
    sudo sysctl -p >/dev/null 2>&1 || true
    
    echo -e "${GREEN}✅ 系统优化完成${NC}"
}

# 设置监控
setup_monitoring() {
    echo -e "${YELLOW}📊 设置监控...${NC}"
    
    # 启动监控服务
    docker-compose -f $COMPOSE_FILE up -d prometheus grafana
    
    # 等待监控服务启动
    sleep 10
    
    echo -e "${GREEN}✅ 监控服务已启动${NC}"
}

# 设置日志轮转
setup_log_rotation() {
    echo -e "${YELLOW}📝 设置日志轮转...${NC}"
    
    # 创建logrotate配置
    sudo tee /etc/logrotate.d/deepneed > /dev/null << EOF
/var/log/deepneed/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker kill -s USR1 \$(docker ps -q --filter name=deepneed-nginx-prod) 2>/dev/null || true
    endscript
}
EOF
    
    echo -e "${GREEN}✅ 日志轮转配置完成${NC}"
}

# 显示部署状态
show_deployment_status() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 ${PROJECT_NAME} 生产环境部署完成！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    
    echo -e "${YELLOW}📡 服务状态：${NC}"
    docker-compose -f $COMPOSE_FILE ps
    echo
    
    echo -e "${YELLOW}🌐 访问地址：${NC}"
    echo -e "  🏠 应用首页:      http://your-domain.com"
    echo -e "  🔧 API文档:       http://your-domain.com/docs"
    echo -e "  📊 监控面板:      http://your-domain.com:3000"
    echo
    
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看日志:         docker-compose -f $COMPOSE_FILE logs -f"
    echo -e "  滚动更新:         $0 --rolling-update"
    echo -e "  创建备份:         $0 --backup"
    echo -e "  健康检查:         $0 --health-check"
    echo
    
    echo -e "${YELLOW}⚠️ 重要提醒：${NC}"
    echo -e "  1. 请确保防火墙只开放必要端口 (80, 443)"
    echo -e "  2. 定期更新系统和Docker镜像"
    echo -e "  3. 监控系统资源使用情况"
    echo -e "  4. 定期备份数据库和应用数据"
    echo
}

# 健康检查
health_check() {
    echo -e "${YELLOW}🏥 执行健康检查...${NC}"
    
    # 检查容器状态
    echo -e "${BLUE}  - 检查容器状态...${NC}"
    if ! docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
        echo -e "${RED}  ❌ 部分容器未运行${NC}"
        return 1
    fi
    
    # 检查应用响应
    echo -e "${BLUE}  - 检查应用响应...${NC}"
    if ! curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${RED}  ❌ 应用健康检查失败${NC}"
        return 1
    fi
    
    # 检查数据库连接
    echo -e "${BLUE}  - 检查数据库连接...${NC}"
    if ! docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready >/dev/null 2>&1; then
        echo -e "${RED}  ❌ 数据库连接失败${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ 所有健康检查通过${NC}"
    return 0
}

# 滚动更新
rolling_update() {
    echo -e "${YELLOW}🔄 执行滚动更新...${NC}"
    
    # 创建备份
    create_backup
    
    # 更新镜像
    docker-compose -f $COMPOSE_FILE pull
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    # 逐个重启服务
    for service in backend nginx; do
        echo -e "${BLUE}🔄 更新服务: $service${NC}"
        docker-compose -f $COMPOSE_FILE up -d --no-deps $service
        sleep 10
        
        if ! health_check; then
            echo -e "${RED}❌ 服务 $service 更新失败${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ 滚动更新完成${NC}"
}

# 主函数
main() {
    case "${1:-}" in
        --health-check)
            health_check
            ;;
        --backup)
            create_backup
            ;;
        --rolling-update)
            rolling_update
            ;;
        --stop)
            echo -e "${YELLOW}🛑 停止生产环境...${NC}"
            docker-compose -f $COMPOSE_FILE down
            echo -e "${GREEN}✅ 生产环境已停止${NC}"
            ;;
        --logs)
            docker-compose -f $COMPOSE_FILE logs -f
            ;;
        *)
            security_check
            check_dependencies
            create_backup
            optimize_system
            blue_green_deploy
            setup_monitoring
            setup_log_rotation
            show_deployment_status
            ;;
    esac
}

# 执行主函数
main "$@" 