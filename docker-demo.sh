#!/bin/bash

# DeepNeed AI Docker 演示脚本
# 基于现有最小化后端的快速Docker演示

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🐳 DeepNeed AI Docker 演示${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查Docker
check_docker() {
    echo -e "${YELLOW}🔍 检查Docker环境...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker 未安装${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose 未安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Docker 环境正常${NC}"
}

# 停止现有服务
stop_existing_services() {
    echo -e "${YELLOW}🛑 停止现有服务...${NC}"
    
    # 停止可能运行的容器
    docker-compose -f docker-compose.demo.yml down 2>/dev/null || true
    
    # 杀死占用端口的进程
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    lsof -ti:80 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}✅ 现有服务已停止${NC}"
}

# 启动演示服务
start_demo_services() {
    echo -e "${YELLOW}🚀 启动Docker演示服务...${NC}"
    
    # 确保minimal_backend.py存在
    if [ ! -f "minimal_backend.py" ]; then
        echo -e "${RED}❌ minimal_backend.py 不存在${NC}"
        echo -e "${YELLOW}💡 请先运行 python3 start_backend_simple.py 创建最小化后端${NC}"
        return 1
    fi
    
    # 修改minimal_backend.py中的端口以避免冲突
    sed -i.bak 's/port=8000/port=8001/g' minimal_backend.py 2>/dev/null || true
    
    # 启动演示服务
    echo -e "${BLUE}📦 启动后端容器...${NC}"
    docker-compose -f docker-compose.demo.yml up -d backend
    
    # 等待后端启动
    echo -e "${BLUE}⏳ 等待后端服务启动...${NC}"
    for i in {1..30}; do
        if curl -s http://localhost:8001/health >/dev/null 2>&1; then
            echo -e "${GREEN}✅ 后端服务已启动${NC}"
            break
        fi
        sleep 2
        echo -n "."
    done
    echo
    
    echo -e "${GREEN}✅ Docker演示服务启动完成${NC}"
}

# 显示服务状态
show_demo_status() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 Docker演示环境运行中！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    
    echo -e "${YELLOW}📡 服务地址：${NC}"
    echo -e "  🔧 后端API (Docker):  http://localhost:8001"
    echo -e "  📚 API文档 (Docker):   http://localhost:8001/docs"
    echo -e "  🏥 健康检查:          http://localhost:8001/health"
    echo
    
    echo -e "${YELLOW}🐳 Docker容器状态：${NC}"
    docker-compose -f docker-compose.demo.yml ps
    echo
    
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看日志:    docker-compose -f docker-compose.demo.yml logs -f"
    echo -e "  停止服务:    docker-compose -f docker-compose.demo.yml down"
    echo -e "  重启服务:    docker-compose -f docker-compose.demo.yml restart"
    echo
    
    echo -e "${YELLOW}💡 测试命令：${NC}"
    echo -e "  健康检查:    curl http://localhost:8001/health"
    echo -e "  API测试:     curl http://localhost:8001/"
    echo
}

# 测试服务
test_services() {
    echo -e "${YELLOW}🧪 测试Docker服务...${NC}"
    
    # 测试健康检查
    echo -e "${BLUE}  - 测试健康检查...${NC}"
    if curl -s http://localhost:8001/health | grep -q "healthy"; then
        echo -e "${GREEN}  ✅ 健康检查通过${NC}"
    else
        echo -e "${RED}  ❌ 健康检查失败${NC}"
        return 1
    fi
    
    # 测试根端点
    echo -e "${BLUE}  - 测试根端点...${NC}"
    if curl -s http://localhost:8001/ | grep -q "DeepNeed"; then
        echo -e "${GREEN}  ✅ 根端点响应正常${NC}"
    else
        echo -e "${RED}  ❌ 根端点响应异常${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ 所有测试通过${NC}"
}

# 主函数
main() {
    case "${1:-}" in
        --stop)
            stop_existing_services
            echo -e "${GREEN}✅ Docker演示服务已停止${NC}"
            ;;
        --logs)
            docker-compose -f docker-compose.demo.yml logs -f
            ;;
        --test)
            test_services
            ;;
        --status)
            docker-compose -f docker-compose.demo.yml ps
            show_demo_status
            ;;
        *)
            check_docker
            stop_existing_services
            start_demo_services
            test_services
            show_demo_status
            ;;
    esac
}

# 执行主函数
main "$@" 