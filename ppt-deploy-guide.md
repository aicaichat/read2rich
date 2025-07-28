# DEEPNEED Web PPT 部署指南

## 概述

本指南将帮助您将 DEEPNEED 企业演示 PPT 部署到已有的网站服务器上，让用户可以通过浏览器直接访问在线演示文稿。

## 部署方式

### 方式一：自动部署（推荐）

1. **上传文件到服务器**
   ```bash
   # 将本地 _static 目录和 deploy-ppt.sh 上传到服务器
   scp -r _static/ deploy-ppt.sh root@your-server:/tmp/
   ```

2. **连接服务器并执行部署**
   ```bash
   ssh root@your-server
   cd /tmp
   chmod +x deploy-ppt.sh
   ./deploy-ppt.sh
   ```

3. **访问 PPT**
   - PPT 导航页：`https://deepneed.com.cn/ppt/`
   - 直接演示：`https://deepneed.com.cn/ppt/slides.html`
   - PDF 版本：`https://deepneed.com.cn/ppt/slides.html?print-pdf`

### 方式二：手动部署

1. **创建 PPT 目录**
   ```bash
   mkdir -p /var/www/deepneed.com.cn/ppt
   chown -R nginx:nginx /var/www/deepneed.com.cn/ppt
   ```

2. **上传 PPT 文件**
   ```bash
   # 将 _static 目录内容复制到 ppt 目录
   cp -r _static/* /var/www/deepneed.com.cn/ppt/
   chown -R nginx:nginx /var/www/deepneed.com.cn/ppt
   ```

3. **配置 Nginx**
   
   编辑 `/etc/nginx/conf.d/deepneed.com.cn.conf`，在 `location /` 之前添加：
   
   ```nginx
   # PPT 演示文稿
   location /ppt/ {
       alias /var/www/deepneed.com.cn/ppt/;
       index index.html slides.html;
       try_files $uri $uri/ /ppt/index.html;
       
       # PPT 特殊缓存配置
       location ~* \.(js|css|woff|woff2|ttf|eot)$ {
           expires 30d;
           add_header Cache-Control "public";
       }
       
       # 允许 iframe 嵌入
       add_header X-Frame-Options "SAMEORIGIN" always;
   }
   ```

4. **重载 Nginx**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

## 功能特性

### 🎯 多种访问方式
- **在线演示**: 完整的交互式演示体验
- **PDF 打印**: 适合下载和打印的版本
- **嵌入模式**: 简化界面，适合嵌入其他页面

### 🔧 演示控制
- **键盘导航**: 
  - `→` `↓` `空格`: 下一页
  - `←` `↑`: 上一页
  - `Home`: 首页
  - `End`: 末页
- **特殊功能**:
  - `F`: 全屏模式
  - `S`: 演讲者视图
  - `B`: 黑屏
  - `?`: 帮助菜单

### 📱 响应式支持
- **桌面端**: 完整功能，键盘+鼠标控制
- **平板端**: 触摸滑动，手势支持
- **手机端**: 移动端优化，单手操作

### 🔗 分享功能
- **直接链接**: 可直接分享演示链接
- **嵌入代码**: 支持 iframe 嵌入
- **PDF 导出**: 支持浏览器打印为 PDF

## 访问地址

部署完成后，用户可以通过以下方式访问：

### 主要入口
- **PPT 导航页**: `https://deepneed.com.cn/ppt/`
- **主页按钮**: 点击主页的"查看演示PPT"按钮

### 直接访问
- **在线演示**: `https://deepneed.com.cn/ppt/slides.html`
- **PDF 版本**: `https://deepneed.com.cn/ppt/slides.html?print-pdf`
- **嵌入版本**: `https://deepneed.com.cn/ppt/slides.html?embedded=true`

## 文件结构

```
/var/www/deepneed.com.cn/ppt/
├── index.html          # PPT 导航页面
├── slides.html         # 主要演示文稿
├── favicon.ico         # 网站图标
├── dist/              # Reveal.js 核心文件
├── plugin/            # 插件文件
├── images/            # 图片资源
└── css/               # 样式文件
```

## 自定义配置

### 修改 PPT 主题
编辑 `slides.html` 中的主题配置：
```javascript
Reveal.initialize({
    theme: 'black',     // 主题: black, white, league, beige, sky, night, serif, simple, solarized
    transition: 'slide' // 过渡效果: slide, fade, zoom, convex, concave
});
```

### 添加自定义样式
在 `css/` 目录下创建自定义 CSS 文件，并在 `slides.html` 中引用。

### 配置演讲者视图
演讲者视图会显示：
- 当前幻灯片和下一张预览
- 演讲备注
- 计时器
- 幻灯片缩略图导航

## 故障排除

### 常见问题

1. **PPT 无法访问**
   - 检查 Nginx 配置是否正确
   - 确认文件权限：`chown -R nginx:nginx /var/www/deepneed.com.cn/ppt`
   - 查看 Nginx 错误日志：`tail -f /var/log/nginx/error.log`

2. **样式显示异常**
   - 确认所有 CSS 和 JS 文件都已上传
   - 检查浏览器控制台是否有资源加载错误
   - 清除浏览器缓存

3. **PDF 导出问题**
   - 使用 Chrome 浏览器访问 `?print-pdf` 版本
   - 在打印设置中选择"更多设置" → "背景图形"
   - 设置边距为"无"，格式为 A4

4. **移动端显示问题**
   - 确认 viewport meta 标签正确设置
   - 检查 CSS 媒体查询是否生效

### 性能优化

1. **启用 Gzip 压缩**
   ```nginx
   location /ppt/ {
       gzip on;
       gzip_types text/css application/javascript image/svg+xml;
   }
   ```

2. **设置缓存策略**
   ```nginx
   location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## 更新 PPT

当需要更新 PPT 内容时：

1. **本地更新**
   ```bash
   # 修改 slides.md 文件
   # 重新生成静态文件
   npx reveal-md slides.md --static _static --static-dirs=images
   ```

2. **部署更新**
   ```bash
   # 上传新的 _static 目录
   scp -r _static/* root@your-server:/var/www/deepneed.com.cn/ppt/
   ```

3. **清除缓存**
   ```bash
   # 在服务器上清除 Nginx 缓存
   find /var/cache/nginx -type f -delete
   systemctl reload nginx
   ```

## 安全建议

1. **访问控制**
   - 如需限制访问，可配置 IP 白名单
   - 考虑添加基础认证（如有需要）

2. **内容保护**
   - 禁用右键菜单（可选）
   - 添加水印（可选）
   - 使用 HTTPS 确保传输安全

## 监控和维护

1. **访问日志**
   ```bash
   # 查看 PPT 访问情况
   grep "/ppt/" /var/log/nginx/access.log | tail -20
   ```

2. **性能监控**
   ```bash
   # 监控服务器资源使用
   htop
   df -h
   ```

3. **定期备份**
   ```bash
   # 备份 PPT 文件
   tar -czf ppt-backup-$(date +%Y%m%d).tar.gz /var/www/deepneed.com.cn/ppt/
   ```

---

## 支持与反馈

如果在部署过程中遇到问题，请检查：
1. 服务器环境是否满足要求
2. 文件权限是否正确设置
3. Nginx 配置是否正确
4. 防火墙是否允许 HTTP/HTTPS 访问

部署完成后，您的用户就可以通过 `https://deepneed.com.cn/ppt/` 访问专业的在线演示文稿了！ 