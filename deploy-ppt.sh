#!/bin/bash

# DEEPNEED Web PPT 部署脚本

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

# 创建 PPT 目录
create_ppt_directory() {
    log_step "创建 PPT 目录..."
    mkdir -p $PPT_DIR
    chown -R nginx:nginx $PPT_DIR
    chmod -R 755 $PPT_DIR
    log_info "PPT 目录创建完成: $PPT_DIR"
}

# 部署 PPT 文件
deploy_ppt_files() {
    log_step "部署 PPT 文件..."
    
    # 检查本地是否有 _static 目录
    if [[ -d "_static" ]]; then
        cp -r _static/* $PPT_DIR/
        log_info "从本地 _static 目录复制 PPT 文件"
    else
        log_warn "未找到 _static 目录，请先生成 PPT 静态文件"
        log_info "请执行: npx reveal-md slides.md --static _static"
        return 1
    fi
    
    # 设置权限
    chown -R nginx:nginx $PPT_DIR
    find $PPT_DIR -type f -exec chmod 644 {} \;
    find $PPT_DIR -type d -exec chmod 755 {} \;
    
    log_info "PPT 文件部署完成"
}

# 更新主页面，添加 PPT 链接
update_homepage() {
    log_step "更新主页面，添加 PPT 入口..."
    
    # 备份原始文件
    if [[ -f "$SITE_DIR/index.html" ]]; then
        cp "$SITE_DIR/index.html" "$SITE_DIR/index.html.bak"
    fi
    
    # 检查是否已经添加了 PPT 链接
    if grep -q "查看演示PPT" "$SITE_DIR/index.html" 2>/dev/null; then
        log_info "PPT 链接已存在，跳过更新"
        return
    fi
    
    # 在主页面添加 PPT 链接
    sed -i 's|<a href="#contact" class="cta-btn primary" data-i18n="hero_cta">获取方案</a>|<a href="#contact" class="cta-btn primary" data-i18n="hero_cta">获取方案</a>\n        <a href="/ppt/" class="cta-btn secondary" target="_blank" data-i18n="hero_ppt">查看演示PPT</a>|' "$SITE_DIR/index.html"
    
    # 更新语言字典
    sed -i 's|hero_cta2:"了解服务",|hero_cta2:"了解服务",\n      hero_ppt:"View PPT",|' "$SITE_DIR/index.html"
    sed -i 's|hero_cta2:"了解服务",|hero_cta2:"了解服务",\n      hero_ppt:"查看演示PPT",|' "$SITE_DIR/index.html"
    
    log_info "主页面更新完成，已添加 PPT 链接"
}

# 配置 Nginx PPT 路由
configure_nginx_ppt() {
    log_step "配置 Nginx PPT 路由..."
    
    # 检查配置文件是否存在
    if [[ ! -f "/etc/nginx/conf.d/${DOMAIN}.conf" ]]; then
        log_error "Nginx 配置文件不存在，请先配置基础网站"
        exit 1
    fi
    
    # 检查是否已经添加了 PPT 配置
    if grep -q "location /ppt/" "/etc/nginx/conf.d/${DOMAIN}.conf"; then
        log_info "PPT 路由配置已存在，跳过配置"
        return
    fi
    
    # 在 Nginx 配置中添加 PPT 路由
    sed -i '/# 主页面/i\
    # PPT 演示文稿\
    location /ppt/ {\
        alias /var/www/deepneed.com.cn/ppt/;\
        index index.html slides.html;\
        try_files $uri $uri/ /ppt/index.html;\
        \
        # PPT 特殊缓存配置\
        location ~* \\.(js|css|woff|woff2|ttf|eot)$ {\
            expires 30d;\
            add_header Cache-Control "public";\
        }\
        \
        # 允许 iframe 嵌入\
        add_header X-Frame-Options "SAMEORIGIN" always;\
    }\
' "/etc/nginx/conf.d/${DOMAIN}.conf"
    
    # 测试配置
    if nginx -t > /dev/null 2>&1; then
        systemctl reload nginx
        log_info "Nginx PPT 路由配置完成并已重载"
    else
        log_error "Nginx 配置文件有误"
        nginx -t
        exit 1
    fi
}

# 创建 PPT 导航页面
create_ppt_index() {
    log_step "创建 PPT 导航页面..."
    
    cat > $PPT_DIR/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DEEPNEED 演示文稿 | AI 时代研发专家</title>
    <meta name="description" content="DEEPNEED 企业演示文稿，展示 AI 驱动的企业级产品研发服务与技术能力">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0; padding: 0;
            background: radial-gradient(ellipse at top, #1f2937 0%, #0a0e1a 50%), #0a0e1a;
            color: white; min-height: 100vh;
            display: flex; flex-direction: column;
        }
        
        .header {
            padding: 20px 40px;
            background: rgba(10,14,26,0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .logo {
            font-size: 1.6rem; font-weight: 800;
            background: linear-gradient(135deg, #00ff94, #ffd93d);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            text-decoration: none;
        }
        
        .container {
            flex: 1; display: flex; align-items: center; justify-content: center;
            padding: 40px 20px;
        }
        
        .content {
            max-width: 800px; text-align: center;
        }
        
        h1 {
            font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #00ff94 50%, #ffd93d 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            font-size: 1.2rem; color: #9ca3af; margin-bottom: 40px;
            line-height: 1.6;
        }
        
        .ppt-options {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px; margin: 40px 0;
        }
        
        .ppt-card {
            background: linear-gradient(135deg, rgba(17,24,39,0.8) 0%, rgba(31,41,55,0.9) 100%);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px; padding: 30px;
            transition: all 0.4s ease;
            text-decoration: none; color: inherit;
            position: relative; overflow: hidden;
        }
        
        .ppt-card::before {
            content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
            background: linear-gradient(90deg, #00ff94, #ffd93d, #ff6b6b);
            transform: scaleX(0); transition: transform 0.4s ease;
        }
        
        .ppt-card:hover::before { transform: scaleX(1); }
        
        .ppt-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border-color: rgba(0,255,148,0.3);
        }
        
        .ppt-icon {
            font-size: 3rem; margin-bottom: 20px;
            color: #00ff94;
        }
        
        .ppt-title {
            font-size: 1.4rem; font-weight: 700; margin-bottom: 10px;
            color: #ffffff;
        }
        
        .ppt-desc {
            color: #9ca3af; line-height: 1.5;
        }
        
        .features {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px; margin: 40px 0;
        }
        
        .feature {
            background: rgba(0,255,148,0.1);
            border: 1px solid rgba(0,255,148,0.2);
            border-radius: 12px; padding: 20px;
            text-align: center;
        }
        
        .feature-icon {
            font-size: 2rem; color: #00ff94; margin-bottom: 10px;
        }
        
        .feature-text {
            font-size: 0.9rem; color: #e5e7eb;
        }
        
        .back-link {
            margin-top: 30px;
        }
        
        .back-link a {
            color: #9ca3af; text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .back-link a:hover {
            color: #00ff94;
        }
        
        @media (max-width: 768px) {
            .header { padding: 15px 20px; }
            .container { padding: 20px; }
            .ppt-options { grid-template-columns: 1fr; gap: 20px; }
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
    
    chown nginx:nginx $PPT_DIR/index.html
    chmod 644 $PPT_DIR/index.html
    log_info "PPT 导航页面创建完成"
}

# 创建 robots.txt 更新
update_robots() {
    log_step "更新 robots.txt..."
    
    if [[ ! -f "$SITE_DIR/robots.txt" ]]; then
        cat > $SITE_DIR/robots.txt << 'EOF'
User-agent: *
Allow: /
Allow: /ppt/

Sitemap: https://deepneed.com.cn/sitemap.xml
EOF
    else
        # 添加 PPT 目录到现有 robots.txt
        if ! grep -q "Allow: /ppt/" "$SITE_DIR/robots.txt"; then
            sed -i '/Allow: \//a Allow: /ppt/' "$SITE_DIR/robots.txt"
        fi
    fi
    
    chown nginx:nginx $SITE_DIR/robots.txt
    chmod 644 $SITE_DIR/robots.txt
    log_info "robots.txt 更新完成"
}

# 显示结果
show_result() {
    echo
    echo "=========================================="
    echo -e "${GREEN}🎉 Web PPT 部署完成！${NC}"
    echo "=========================================="
    echo
    echo "📋 部署信息:"
    echo "   PPT 目录: $PPT_DIR"
    echo "   在线访问: https://$DOMAIN/ppt/"
    echo "   直接演示: https://$DOMAIN/ppt/slides.html"
    echo "   PDF 打印: https://$DOMAIN/ppt/slides.html?print-pdf"
    echo
    echo "🎯 访问方式:"
    echo "   1. 主页按钮: 点击主页的 '查看演示PPT' 按钮"
    echo "   2. 直接访问: https://$DOMAIN/ppt/"
    echo "   3. 演示模式: https://$DOMAIN/ppt/slides.html"
    echo
    echo "🔧 PPT 功能:"
    echo "   - 键盘导航: 方向键控制翻页"
    echo "   - 全屏模式: 按 F 键进入全屏"
    echo "   - 演讲者视图: 按 S 键打开演讲者视图"
    echo "   - PDF 导出: 添加 ?print-pdf 参数"
    echo
    echo "📱 响应式支持:"
    echo "   - 桌面端: 完整功能体验"
    echo "   - 平板端: 触摸滑动支持"
    echo "   - 手机端: 移动端优化界面"
    echo
    echo "🔗 分享链接:"
    echo "   - 在线演示: https://$DOMAIN/ppt/slides.html"
    echo "   - 嵌入版本: https://$DOMAIN/ppt/slides.html?embedded=true"
    echo
    echo -e "${BLUE}🌐 立即访问: https://$DOMAIN/ppt/${NC}"
    echo
}

# 主函数
main() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "    DEEPNEED Web PPT 部署脚本"
    echo "========================================"
    echo -e "${NC}"
    
    check_root
    create_ppt_directory
    
    if deploy_ppt_files; then
        configure_nginx_ppt
        create_ppt_index
        update_homepage
        update_robots
        show_result
    else
        log_error "PPT 文件部署失败，请检查 _static 目录是否存在"
        exit 1
    fi
}

# 执行主函数
main "$@" 