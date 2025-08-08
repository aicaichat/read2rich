// HTML单页面应用生成器
import { callAIAPI } from './mock-api';

export interface HTMLAppSpec {
  title: string;
  description: string;
  features: string[];
  targetUsers: string[];
  designStyle: string;
  colorScheme: string;
  layout: string;
}

export interface GeneratedHTMLApp {
  html: string;
  css: string;
  js: string;
  metadata: {
    title: string;
    description: string;
    features: string[];
    generatedAt: string;
    version: string;
  };
}

export class HTMLAppGenerator {
  
  /**
   * 根据PRD文档生成HTML单页面应用
   */
  async generateHTMLApp(prdContent: string, projectInfo: any): Promise<GeneratedHTMLApp> {
    console.log('🎨 开始生成HTML单页面应用...');
    
    try {
      // 1. 分析PRD内容，提取应用规格
      const appSpec = await this.analyzePRDContent(prdContent, projectInfo);
      
      // 2. 生成HTML结构
      const html = await this.generateHTMLStructure(appSpec);
      
      // 3. 生成CSS样式
      const css = await this.generateCSSStyles(appSpec);
      
      // 4. 生成JavaScript功能
      const js = await this.generateJavaScript(appSpec);
      
      // 5. 组合完整的HTML应用
      const completeHTML = this.combineHTMLApp(html, css, js, appSpec);
      
      console.log('✅ HTML单页面应用生成成功');
      
      return {
        html: completeHTML,
        css: css,
        js: js,
        metadata: {
          title: appSpec.title,
          description: appSpec.description,
          features: appSpec.features,
          generatedAt: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      
    } catch (error) {
      console.error('❌ HTML应用生成失败:', error);
      return this.generateFallbackHTMLApp(projectInfo);
    }
  }
  
  /**
   * 分析PRD内容，提取应用规格
   */
  private async analyzePRDContent(prdContent: string, projectInfo: any): Promise<HTMLAppSpec> {
    const analysisPrompt = `请分析以下PRD文档，提取HTML单页面应用的关键信息：

## PRD文档内容
${prdContent}

## 项目信息
- 项目名称: ${projectInfo.name || '未命名项目'}
- 项目类型: ${projectInfo.type || '通用项目'}

## 请提取以下信息：
1. 应用标题（简洁明了）
2. 应用描述（一句话概括）
3. 核心功能列表（3-5个主要功能）
4. 目标用户群体
5. 设计风格建议（现代、简约、专业等）
6. 配色方案建议（主色调和辅助色）
7. 布局类型建议（单页滚动、卡片式、分栏式等）

请以JSON格式返回结果：
{
  "title": "应用标题",
  "description": "应用描述",
  "features": ["功能1", "功能2", "功能3"],
  "targetUsers": ["用户群体1", "用户群体2"],
  "designStyle": "设计风格",
  "colorScheme": "配色方案",
  "layout": "布局类型"
}`;

    try {
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深的UI/UX设计师和前端开发专家，擅长分析产品需求并设计HTML应用。'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ]);
      
      // 尝试解析JSON响应
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // 如果无法解析JSON，使用默认值
      return this.extractInfoFromText(response, projectInfo);
      
    } catch (error) {
      console.warn('PRD分析失败，使用默认规格:', error);
      return this.getDefaultAppSpec(projectInfo);
    }
  }
  
  /**
   * 从文本中提取信息
   */
  private extractInfoFromText(text: string, projectInfo: any): HTMLAppSpec {
    return {
      title: projectInfo.name || '智能应用',
      description: '基于AI生成的现代化Web应用',
      features: ['核心功能', '用户管理', '数据分析'],
      targetUsers: ['目标用户'],
      designStyle: '现代简约',
      colorScheme: '蓝色主题',
      layout: '单页滚动'
    };
  }
  
  /**
   * 获取默认应用规格
   */
  private getDefaultAppSpec(projectInfo: any): HTMLAppSpec {
    return {
      title: projectInfo.name || '智能应用',
      description: '基于AI生成的现代化Web应用',
      features: ['核心功能', '用户管理', '数据分析'],
      targetUsers: ['目标用户'],
      designStyle: '现代简约',
      colorScheme: '蓝色主题',
      layout: '单页滚动'
    };
  }
  
  /**
   * 生成HTML结构
   */
  private async generateHTMLStructure(appSpec: HTMLAppSpec): Promise<string> {
    const htmlPrompt = `请为以下应用生成完整的HTML结构：

## 应用信息
- 标题: ${appSpec.title}
- 描述: ${appSpec.description}
- 功能: ${appSpec.features.join(', ')}
- 目标用户: ${appSpec.targetUsers.join(', ')}
- 设计风格: ${appSpec.designStyle}
- 布局类型: ${appSpec.layout}

## 要求
1. 使用语义化HTML5标签
2. 包含完整的页面结构（header, main, footer等）
3. 为每个功能创建对应的section
4. 添加适当的class名称用于CSS样式
5. 包含meta标签和SEO优化
6. 响应式设计考虑

请只返回HTML代码，不要包含其他说明。`;

    try {
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深的前端开发专家，擅长编写语义化、现代化的HTML结构。'
        },
        {
          role: 'user',
          content: htmlPrompt
        }
      ]);
      
      return response;
    } catch (error) {
      console.warn('HTML生成失败，使用默认模板:', error);
      return this.getDefaultHTMLStructure(appSpec);
    }
  }
  
  /**
   * 生成CSS样式
   */
  private async generateCSSStyles(appSpec: HTMLAppSpec): Promise<string> {
    const cssPrompt = `请为以下应用生成现代化的CSS样式：

## 应用信息
- 标题: ${appSpec.title}
- 设计风格: ${appSpec.designStyle}
- 配色方案: ${appSpec.colorScheme}
- 布局类型: ${appSpec.layout}

## 样式要求
1. 使用现代CSS特性（Flexbox, Grid, CSS变量等）
2. 实现响应式设计（移动端优先）
3. 添加平滑的动画和过渡效果
4. 使用现代化的设计原则
5. 确保良好的可访问性
6. 包含深色模式支持

## 配色建议
- 主色调: 根据${appSpec.colorScheme}选择合适的颜色
- 辅助色: 搭配主色调的协调颜色
- 背景色: 浅色和深色主题

请只返回CSS代码，不要包含其他说明。`;

    try {
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深的CSS专家，擅长编写现代化、响应式的CSS样式。'
        },
        {
          role: 'user',
          content: cssPrompt
        }
      ]);
      
      return response;
    } catch (error) {
      console.warn('CSS生成失败，使用默认样式:', error);
      return this.getDefaultCSSStyles(appSpec);
    }
  }
  
  /**
   * 生成JavaScript功能
   */
  private async generateJavaScript(appSpec: HTMLAppSpec): Promise<string> {
    const jsPrompt = `请为以下应用生成现代化的JavaScript功能：

## 应用信息
- 标题: ${appSpec.title}
- 功能: ${appSpec.features.join(', ')}
- 目标用户: ${appSpec.targetUsers.join(', ')}

## 功能要求
1. 使用现代ES6+语法
2. 实现交互功能（表单处理、导航、动画等）
3. 添加数据验证和错误处理
4. 实现响应式交互
5. 添加用户体验增强功能
6. 确保代码的可维护性

## 核心功能实现
- 导航菜单切换
- 表单提交和验证
- 数据展示和交互
- 主题切换（深色/浅色模式）
- 响应式菜单

请只返回JavaScript代码，不要包含其他说明。`;

    try {
      const response = await callAIAPI([
        {
          role: 'system',
          content: '你是资深的JavaScript专家，擅长编写现代化、可维护的JavaScript代码。'
        },
        {
          role: 'user',
          content: jsPrompt
        }
      ]);
      
      return response;
    } catch (error) {
      console.warn('JavaScript生成失败，使用默认功能:', error);
      return this.getDefaultJavaScript(appSpec);
    }
  }
  
  /**
   * 组合完整的HTML应用
   */
  private combineHTMLApp(html: string, css: string, js: string, appSpec: HTMLAppSpec): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${appSpec.description}">
    <meta name="keywords" content="${appSpec.features.join(', ')}">
    <title>${appSpec.title}</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${js}
    </script>
</body>
</html>`;
  }
  
  /**
   * 生成默认HTML结构
   */
  private getDefaultHTMLStructure(appSpec: HTMLAppSpec): string {
    return `
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">${appSpec.title}</div>
            <ul class="nav-menu">
                <li><a href="#home">首页</a></li>
                <li><a href="#features">功能</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
            <button class="nav-toggle" aria-label="切换菜单">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    </header>

    <main class="main">
        <section id="home" class="hero">
            <div class="container">
                <h1 class="hero-title">${appSpec.title}</h1>
                <p class="hero-description">${appSpec.description}</p>
                <button class="btn btn-primary">开始使用</button>
            </div>
        </section>

        <section id="features" class="features">
            <div class="container">
                <h2 class="section-title">核心功能</h2>
                <div class="features-grid">
                    ${appSpec.features.map(feature => `
                    <div class="feature-card">
                        <h3>${feature}</h3>
                        <p>${feature}的详细描述和功能说明。</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2 class="section-title">关于我们</h2>
                <p>这是一个基于AI生成的现代化Web应用，专为${appSpec.targetUsers.join('、')}设计。</p>
            </div>
        </section>

        <section id="contact" class="contact">
            <div class="container">
                <h2 class="section-title">联系我们</h2>
                <form class="contact-form">
                    <input type="text" placeholder="您的姓名" required>
                    <input type="email" placeholder="您的邮箱" required>
                    <textarea placeholder="您的消息" rows="5" required></textarea>
                    <button type="submit" class="btn btn-primary">发送消息</button>
                </form>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${appSpec.title}. 由 AI 生成。</p>
        </div>
    </footer>`;
  }
  
  /**
   * 生成默认CSS样式
   */
  private getDefaultCSSStyles(appSpec: HTMLAppSpec): string {
    return `
    :root {
        --primary-color: #3b82f6;
        --secondary-color: #1e40af;
        --accent-color: #f59e0b;
        --text-color: #1f2937;
        --bg-color: #ffffff;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-600: #4b5563;
        --gray-800: #1f2937;
        --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        background-color: var(--bg-color);
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    /* Header */
    .header {
        background: var(--bg-color);
        box-shadow: var(--shadow);
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
    }

    .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
    }

    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
    }

    .nav-menu {
        display: flex;
        list-style: none;
        gap: 2rem;
    }

    .nav-menu a {
        text-decoration: none;
        color: var(--text-color);
        font-weight: 500;
        transition: color 0.3s ease;
    }

    .nav-menu a:hover {
        color: var(--primary-color);
    }

    .nav-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
    }

    .nav-toggle span {
        display: block;
        width: 25px;
        height: 3px;
        background: var(--text-color);
        margin: 5px 0;
        transition: 0.3s;
    }

    /* Main */
    .main {
        margin-top: 80px;
    }

    /* Hero */
    .hero {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 4rem 0;
        text-align: center;
    }

    .hero-title {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

    .hero-description {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
    }

    /* Sections */
    .features, .about, .contact {
        padding: 4rem 0;
    }

    .section-title {
        font-size: 2.5rem;
        text-align: center;
        margin-bottom: 3rem;
        color: var(--text-color);
    }

    /* Features Grid */
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .feature-card {
        background: var(--bg-color);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: var(--shadow);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }

    .feature-card h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }

    /* Contact Form */
    .contact-form {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .contact-form input,
    .contact-form textarea {
        padding: 1rem;
        border: 2px solid var(--gray-200);
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    /* Buttons */
    .btn {
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }

    .btn-primary {
        background: var(--primary-color);
        color: white;
    }

    .btn-primary:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
    }

    /* Footer */
    .footer {
        background: var(--gray-800);
        color: white;
        text-align: center;
        padding: 2rem 0;
        margin-top: 4rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }

        .nav-toggle {
            display: block;
        }

        .hero-title {
            font-size: 2rem;
        }

        .section-title {
            font-size: 2rem;
        }

        .features-grid {
            grid-template-columns: 1fr;
        }
    }`;
  }
  
  /**
   * 生成默认JavaScript功能
   */
  private getDefaultJavaScript(appSpec: HTMLAppSpec): string {
    return `
    // 导航菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // 简单的表单验证
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟表单提交
            alert('消息已发送！我们会尽快回复您。');
            this.reset();
        });
    }

    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有卡片元素
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 主题切换功能
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = \`
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 1000;
        transition: all 0.3s ease;
    \`;
    
    document.body.appendChild(themeToggle);
    
    let isDarkMode = false;
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
    });

    // 添加深色模式样式
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = \`
        .dark-mode {
            --text-color: #f9fafb;
            --bg-color: #111827;
            --gray-100: #374151;
            --gray-200: #4b5563;
            --gray-300: #6b7280;
        }
        
        .dark-mode .header {
            background: var(--bg-color);
        }
        
        .dark-mode .feature-card {
            background: var(--gray-100);
            color: var(--text-color);
        }
    \`;
    document.head.appendChild(darkModeStyles);

    console.log('${appSpec.title} 应用已加载完成！');`;
  }
  
  /**
   * 生成回退HTML应用
   */
  private generateFallbackHTMLApp(projectInfo: any): GeneratedHTMLApp {
    const appSpec = this.getDefaultAppSpec(projectInfo);
    const html = this.getDefaultHTMLStructure(appSpec);
    const css = this.getDefaultCSSStyles(appSpec);
    const js = this.getDefaultJavaScript(appSpec);
    
    return {
      html: this.combineHTMLApp(html, css, js, appSpec),
      css: css,
      js: js,
      metadata: {
        title: appSpec.title,
        description: appSpec.description,
        features: appSpec.features,
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };
  }
  
  /**
   * 下载HTML应用
   */
  downloadHTMLApp(htmlApp: GeneratedHTMLApp, filename?: string): void {
    const blob = new Blob([htmlApp.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${htmlApp.metadata.title}-app.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  /**
   * 预览HTML应用
   */
  previewHTMLApp(htmlApp: GeneratedHTMLApp): void {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlApp.html);
      newWindow.document.close();
    }
  }
}

// 导出单例实例
export const htmlAppGenerator = new HTMLAppGenerator(); 