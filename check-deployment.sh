#!/bin/bash

# DeepNeed AI 部署状态检查脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}🔍 DeepNeed AI 部署状态检查${NC}"
echo -e "${BLUE}======================================================${NC}"
echo

# 检查Docker服务
check_docker() {
    echo -e "${YELLOW}🐳 检查Docker服务...${NC}"
    
    if ! systemctl is-active --quiet docker; then
        echo -e "${RED}❌ Docker服务未运行${NC}"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker权限不足${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Docker服务正常${NC}"
    return 0
}

# 检查容器状态
check_containers() {
    echo -e "${YELLOW}📦 检查容器状态...${NC}"
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        echo -e "${RED}❌ 未找到生产环境配置文件${NC}"
        return 1
    fi
    
    # 检查所有容器是否运行
    local containers=$(docker-compose -f docker-compose.prod.yml ps -q)
    local running_containers=$(docker-compose -f docker-compose.prod.yml ps -q --filter "status=running")
    
    if [ "$containers" = "$running_containers" ] && [ -n "$containers" ]; then
        echo -e "${GREEN}✅ 所有容器运行正常${NC}"
        docker-compose -f docker-compose.prod.yml ps
    else
        echo -e "${RED}❌ 部分容器未运行${NC}"
        docker-compose -f docker-compose.prod.yml ps
        return 1
    fi
    
    return 0
}

# 检查网络连接
check_network() {
    echo -e "${YELLOW}🌐 检查网络连接...${NC}"
    
    # 检查端口监听
    local ports=(80 443 3000)
    local all_ok=true
    
    for port in "${ports[@]}"; do
        if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
            echo -e "${GREEN}✅ 端口 $port 正常监听${NC}"
        else
            echo -e "${RED}❌ 端口 $port 未监听${NC}"
            all_ok=false
        fi
    done
    
    if [ "$all_ok" = true ]; then
        return 0
    else
        return 1
    fi
}

# 检查应用健康状态
check_health() {
    echo -e "${YELLOW}🏥 检查应用健康状态...${NC}"
    
    # 检查HTTP健康端点
    if curl -f http://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTP健康检查通过${NC}"
    else
        echo -e "${RED}❌ HTTP健康检查失败${NC}"
        return 1
    fi
    
    # 检查HTTPS健康端点
    if curl -k -f https://localhost/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ HTTPS健康检查通过${NC}"
    else
        echo -e "${YELLOW}⚠️ HTTPS健康检查失败（可能是自签名证书）${NC}"
    fi
    
    return 0
}

# 检查数据库连接
check_database() {
    echo -e "${YELLOW}🗄️ 检查数据库连接...${NC}"
    
    if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL数据库连接正常${NC}"
    else
        echo -e "${RED}❌ PostgreSQL数据库连接失败${NC}"
        return 1
    fi
    
    return 0
}

# 检查Redis连接
check_redis() {
    echo -e "${YELLOW}🔴 检查Redis连接...${NC}"
    
    if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Redis连接正常${NC}"
    else
        echo -e "${RED}❌ Redis连接失败${NC}"
        return 1
    fi
    
    return 0
}

# 检查SSL证书
check_ssl() {
    echo -e "${YELLOW}🔒 检查SSL证书...${NC}"
    
    if [ -f "docker/nginx/ssl/cert.pem" ] && [ -f "docker/nginx/ssl/key.pem" ]; then
        echo -e "${GREEN}✅ SSL证书文件存在${NC}"
        
        # 检查证书有效期
        local expiry=$(openssl x509 -in docker/nginx/ssl/cert.pem -noout -enddate 2>/dev/null | cut -d= -f2)
        if [ -n "$expiry" ]; then
            echo -e "${BLUE}📅 证书有效期至: $expiry${NC}"
        fi
    else
        echo -e "${RED}❌ SSL证书文件缺失${NC}"
        return 1
    fi
    
    return 0
}

# 检查环境配置
check_environment() {
    echo -e "${YELLOW}⚙️ 检查环境配置...${NC}"
    
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ 环境配置文件不存在${NC}"
        return 1
    fi
    
    # 检查关键配置项
    local required_vars=("SECRET_KEY" "POSTGRES_PASSWORD" "CLAUDE_API_KEY" "DEEPSEEK_API_KEY")
    local all_ok=true
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            local value=$(grep "^${var}=" .env | cut -d= -f2)
            if [ -n "$value" ] && [ "$value" != "your-claude-api-key-here" ] && [ "$value" != "your-deepseek-api-key-here" ]; then
                echo -e "${GREEN}✅ $var 已配置${NC}"
            else
                echo -e "${YELLOW}⚠️ $var 需要配置实际值${NC}"
                all_ok=false
            fi
        else
            echo -e "${RED}❌ $var 未配置${NC}"
            all_ok=false
        fi
    done
    
    if [ "$all_ok" = true ]; then
        return 0
    else
        return 1
    fi
}

# 检查系统资源
check_resources() {
    echo -e "${YELLOW}💻 检查系统资源...${NC}"
    
    # 检查内存使用
    local mem_total=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    local mem_used=$(free -m | awk 'NR==2{printf "%.0f", $3}')
    local mem_usage=$((mem_used * 100 / mem_total))
    
    if [ $mem_usage -lt 80 ]; then
        echo -e "${GREEN}✅ 内存使用率: ${mem_usage}%${NC}"
    else
        echo -e "${YELLOW}⚠️ 内存使用率较高: ${mem_usage}%${NC}"
    fi
    
    # 检查磁盘使用
    local disk_usage=$(df -h / | awk 'NR==2{print $5}' | sed 's/%//')
    if [ $disk_usage -lt 80 ]; then
        echo -e "${GREEN}✅ 磁盘使用率: ${disk_usage}%${NC}"
    else
        echo -e "${YELLOW}⚠️ 磁盘使用率较高: ${disk_usage}%${NC}"
    fi
    
    # 检查Docker资源
    echo -e "${BLUE}🐳 Docker资源使用:${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# 显示访问信息
show_access_info() {
    echo -e "${BLUE}======================================================${NC}"
    echo -e "${GREEN}🎉 部署状态检查完成！${NC}"
    echo -e "${BLUE}======================================================${NC}"
    echo
    
    echo -e "${YELLOW}🌐 访问地址：${NC}"
    echo -e "  🏠 应用首页:      https://localhost"
    echo -e "  🔧 API文档:       https://localhost/docs"
    echo -e "  📊 监控面板:      http://localhost:3000"
    echo
    
    echo -e "${YELLOW}🔧 管理命令：${NC}"
    echo -e "  查看状态:         docker-compose -f docker-compose.prod.yml ps"
    echo -e "  查看日志:         docker-compose -f docker-compose.prod.yml logs -f"
    echo -e "  重启服务:         docker-compose -f docker-compose.prod.yml restart"
    echo -e "  停止服务:         docker-compose -f docker-compose.prod.yml down"
    echo
    
    echo -e "${YELLOW}📝 日志位置：${NC}"
    echo -e "  Nginx日志:        docker-compose -f docker-compose.prod.yml logs nginx"
    echo -e "  后端日志:         docker-compose -f docker-compose.prod.yml logs backend"
    echo -e "  数据库日志:       docker-compose -f docker-compose.prod.yml logs postgres"
    echo
}

# 主函数
main() {
    local all_checks_passed=true
    
    # 执行各项检查
    check_docker || all_checks_passed=false
    echo
    
    check_containers || all_checks_passed=false
    echo
    
    check_network || all_checks_passed=false
    echo
    
    check_health || all_checks_passed=false
    echo
    
    check_database || all_checks_passed=false
    echo
    
    check_redis || all_checks_passed=false
    echo
    
    check_ssl || all_checks_passed=false
    echo
    
    check_environment || all_checks_passed=false
    echo
    
    check_resources
    echo
    
    show_access_info
    
    if [ "$all_checks_passed" = true ]; then
        echo -e "${GREEN}✅ 所有检查通过，部署状态良好！${NC}"
        exit 0
    else
        echo -e "${RED}❌ 部分检查未通过，请查看上述错误信息${NC}"
        exit 1
    fi
}

# 执行主函数
main "$@" 