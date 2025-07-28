#!/bin/bash

# DeepNeed AI 开发环境部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="DeepNeed AI"
COMPOSE_FILE="docker-compose.dev.yml"
ENV_FILE="docker/env/dev.env"

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🚀 ${PROJECT_NAME} 开发环境部署脚本${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查Docker和Docker Compose
check_dependencies() {
    echo -e "${YELLOW}🔍 检查依赖...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装，请先安装 Docker Compose${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker 和 Docker Compose 已安装${NC}"
}

# 检查环境文件
check_env_file() {
    echo -e "${YELLOW}🔍 检查环境配置文件...${NC}"
    
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}❌ 环境配置文件 $ENV_FILE 不存在${NC}"
        echo -e "${YELLOW}💡 请先复制并配置环境文件：${NC}"
        echo -e "   cp docker/env/dev.env.example $ENV_FILE"
        echo -e "   然后编辑 $ENV_FILE 配置相应参数"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 环境配置文件存在${NC}"
}

# 停止现有服务
stop_services() {
    echo -e "${YELLOW}🛑 停止现有服务...${NC}"
    docker-compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null || true
    echo -e "${GREEN}✅ 现有服务已停止${NC}"
}

# 清理Docker资源
cleanup_docker() {
    echo -e "${YELLOW}🧹 清理Docker资源...${NC}"
    
    # 删除未使用的容器
    docker container prune -f >/dev/null 2>&1 || true
    
    # 删除未使用的镜像（谨慎使用）
    if [ "$1" = "--clean-all" ]; then
        echo -e "${YELLOW}⚠️ 清理所有未使用的Docker镜像...${NC}"
        docker image prune -a -f >/dev/null 2>&1 || true
    else
        docker image prune -f >/dev/null 2>&1 || true
    fi
    
    echo -e "${GREEN}✅ Docker资源清理完成${NC}"
}

# 构建和启动服务
build_and_start() {
    echo -e "${YELLOW}🔨 构建并启动服务...${NC}"
    
    # 加载环境变量
    export $(grep -v '^#' $ENV_FILE | xargs)
    
    # 构建镜像
    echo -e "${BLUE}📦 构建Docker镜像...${NC}"
    docker-compose -f $COMPOSE_FILE build --no-cache
    
    # 启动服务
    echo -e "${BLUE}🚀 启动服务...${NC}"
    docker-compose -f $COMPOSE_FILE up -d
    
    echo -e "${GREEN}✅ 服务启动完成${NC}"
}

# 等待服务就绪
wait_for_services() {
    echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
    
    # 等待后端服务
    echo -e "${BLUE}  - 等待后端服务...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:8001/health >/dev/null 2>&1; then
            echo -e "${GREEN}  ✅ 后端服务已就绪${NC}"
            break
        fi
        sleep 2
        echo -n "."
    done
    
    # 等待前端服务
    echo -e "${BLUE}  - 等待前端服务...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:5173 >/dev/null 2>&1; then
            echo -e "${GREEN}  ✅ 前端服务已就绪${NC}"
            break
        fi
        sleep 2
        echo -n "."
    done
    echo
}

# 显示服务状态
show_status() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 ${PROJECT_NAME} 开发环境部署完成！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    echo -e "${YELLOW}📡 服务地址：${NC}"
    echo -e "  🌐 前端应用:     http://localhost:5173"
    echo -e "  🔧 后端API:      http://localhost:8001"
    echo -e "  📚 API文档:      http://localhost:8001/docs"
    echo -e "  🗄️ 数据库管理:    http://localhost:8080"
    echo -e "  🔍 Redis:        localhost:6379"
    echo
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看日志:        docker-compose -f $COMPOSE_FILE logs -f"
    echo -e "  停止服务:        docker-compose -f $COMPOSE_FILE down"
    echo -e "  重启服务:        docker-compose -f $COMPOSE_FILE restart"
    echo -e "  查看状态:        docker-compose -f $COMPOSE_FILE ps"
    echo
    echo -e "${YELLOW}💾 数据库连接信息：${NC}"
    echo -e "  主机: localhost"
    echo -e "  端口: 5432"
    echo -e "  数据库: deepneed_dev"
    echo -e "  用户: deepneed"
    echo -e "  密码: deepneed_dev_password"
    echo
}

# 主函数
main() {
    case "${1:-}" in
        --clean-all)
            check_dependencies
            check_env_file
            stop_services
            cleanup_docker --clean-all
            build_and_start
            wait_for_services
            show_status
            ;;
        --restart)
            echo -e "${YELLOW}🔄 重启服务...${NC}"
            docker-compose -f $COMPOSE_FILE restart
            wait_for_services
            show_status
            ;;
        --logs)
            docker-compose -f $COMPOSE_FILE logs -f
            ;;
        --stop)
            stop_services
            echo -e "${GREEN}✅ 开发环境已停止${NC}"
            ;;
        --status)
            docker-compose -f $COMPOSE_FILE ps
            ;;
        *)
            check_dependencies
            check_env_file
            stop_services
            cleanup_docker
            build_and_start
            wait_for_services
            show_status
            ;;
    esac
}

# 执行主函数
main "$@" 