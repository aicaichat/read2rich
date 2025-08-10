import type { CrawledPrompt } from '@/lib/github-prompt-crawler';

// DeepNeed 官方种子提示词（缩略版，示例若干条）
// 约定：source = 'deepneed-seed'，用于与抓取/本地合并时识别

export const millionAppPrompts: CrawledPrompt[] = [
  {
    title: '机会评估·TAM/SAM/SOM 与关键信号',
    description: '用市场三分法评估机会规模与进入时机',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'business',
    tags: ['opportunity','market','tamsamsom'],
    variables: ['想法', '细分市场', '目标用户', '竞品列表'],
    stars: 0,
    content: `你是一名擅长市场评估的产品战略专家。请基于以下信息评估一个机会：\n- 想法：{{想法}}\n- 细分市场：{{细分市场}}\n- 目标用户：{{目标用户}}\n- 竞品列表：{{竞品列表}}\n\n请输出JSON，包含字段：{ "tamsamsom": [{name, value, method, assumption}], "signals": [{type, evidence, confidence}], "risks": [{item, impact, mitigation}], "go": true|false, "why" }。`
  },
  {
    title: '演示文稿/WebPPT·世界级版式与叙事结构',
    description: '生成演示脚本+每页要点+视觉风格+Reveal/Keynote提示词',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['slides','webppt','reveal','deck','story'],
    variables: ['主题', '受众', '页数', '叙事结构（问题-洞察-方案-证据-行动）', '品牌与风格', '图表与可视化需求'],
    stars: 0,
    content: `请基于“{{主题}}”为“{{受众}}”生成 {{页数}} 页演示：\n1) 大纲（叙事结构={{叙事结构（问题-洞察-方案-证据-行动）}}）\n2) 每页要点（<=3 bullet）+建议视觉（图表/图像/版式）\n3) Reveal/Keynote 生成提示词（英文）：版式/层级/留白/排版/配色/图表类型（{{图表与可视化需求}}）\n4) 开场钩子与收尾CTA；备注：品牌/风格={{品牌与风格}}。`
  },
  {
    title: '信息图/长图·数据到版式的可视化提示词',
    description: '从数据结构→图形语法→视觉层级→导出规格（社媒/网站）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['infographic','visualization','longform','chart'],
    variables: ['主题', '数据点与分组', '目标尺寸/比例', '图形风格（极简/插画/数据新闻）', '品牌主色', '导出平台'],
    stars: 0,
    content: `围绕“{{主题}}”与数据：{{数据点与分组}}，生成信息图方案：\n- 结构：模块分区与信息层级\n- 图形语法：适用图表类型与映射\n- 视觉：配色（含品牌主色={{品牌主色}}）、留白与对比\n- 英文生成提示词（图形元素/排版/负面）\n- 导出规格：{{目标尺寸/比例}}，平台={{导出平台}}。`
  },
  {
    title: 'Figma UI Kit·设计令牌与组件体系',
    description: '从Design Tokens到组件/变体/AutoLayout/约束的系统化说明与Prompt',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['figma','ui-kit','design-tokens','components'],
    variables: ['品牌与产品定位', '色彩/字体/间距/圆角/阴影策略', '核心组件清单', '适配平台（Web/iOS/Android）'],
    stars: 0,
    content: `为“{{品牌与产品定位}}”输出UI Kit方案：\n- Design Tokens：颜色/字体/间距/圆角/阴影（命名与取值：{{色彩/字体/间距/圆角/阴影策略}}）\n- 组件与变体：按钮/输入/卡片/表单/导航等（状态/尺寸）\n- AutoLayout/约束/响应式策略\n- Figma 插件/Prompt 建议：批量生成/校验一致性\n- 交付清单与验收要点（含可视差异阈值）。`
  },
  {
    title: '品牌指南·视觉/语气/应用规范（Brand Guideline）',
    description: '输出品牌手册结构：基础资产→应用场景→禁用案例→交付清单',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['brand','guideline','voice','applications'],
    variables: ['品牌核心', '视觉资产（Logo/色板/字体/图形）', '语气与措辞', '应用场景（站点/社媒/线下）'],
    stars: 0,
    content: `为品牌“{{品牌核心}}”生成指南：\n- 视觉：{{视觉资产（Logo/色板/字体/图形）}} 使用规范与留白\n- 语气：{{语气与措辞}} 示例与禁用\n- 应用：{{应用场景（站点/社媒/线下）}} 版式/尺寸/对比度要求\n- 英文生成提示词：在不同平台自动化产出一致视觉\n- 交付：源文件结构与审阅清单。`
  },
  {
    title: '图标系统·风格统一与语义网格',
    description: '定义语义网格/线宽/圆角/端点/填充，批量生成与校验提示词',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['icons','grid','stroke','semantics'],
    variables: ['主题域', '风格（线性/双色/实底）', '网格尺度', '线宽/圆角/端点', '配色'],
    stars: 0,
    content: `请为“{{主题域}}”定义图标系统：\n- 语义网格与构图原则（网格={{网格尺度}}）\n- 线宽/圆角/端点/拐角一致性\n- 填充与配色方案\n- 英文提示词：批量生成/一致性校验/Negative\n- 导出命名与树结构建议（SVG/PNG/Font）。`
  },
  {
    title: '纹理/材质/背景·批量生成提示词',
    description: '生成可平铺/高对比/低压缩损失的纹理与材质包提示词',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['texture','pattern','background','tileable'],
    variables: ['主题', '风格', '色彩', '颗粒/噪点', '平铺无缝', '输出尺寸'],
    stars: 0,
    content: `请为“{{主题}}”生成纹理/材质包提示词：风格={{风格}}；色彩={{色彩}}；颗粒/噪点={{颗粒/噪点}}；平铺={{平铺无缝}}；输出尺寸={{输出尺寸}}。\n输出：英文Prompt/Negative/参数建议，以及三种变体方向。`
  },
  {
    title: '3D 资产/场景·建模与渲染提示词',
    description: '面向Blender/NeRF/Unreal：建模细节/材质/灯光/相机/渲染参数',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['3d','blender','unreal','nerf','render'],
    variables: ['对象/场景', '几何细节', '材质/贴图', '灯光布光', '相机运动', '渲染参数'],
    stars: 0,
    content: `围绕“{{对象/场景}}”生成3D资产方案：\n- 建模：{{几何细节}} 细节层级/拓扑建议\n- 材质：{{材质/贴图}} PBR 通道与分辨率\n- 灯光：{{灯光布光}}；相机：{{相机运动}}\n- 渲染参数：采样/反走样/运动模糊\n- 英文生成提示词：建模/材质/灯光/渲染/Negative。`
  },
  {
    title: '配乐/旁白/音效·生成与剪辑提示词',
    description: '音乐（风格/节奏/轨道）+旁白文案+音效清单，适配时长与节奏点',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['music','voiceover','sfx','audio'],
    variables: ['主题与场景', '音乐风格与BPM', '旁白语言/人设/语速', '时长', '节奏点（秒）'],
    stars: 0,
    content: `为“{{主题与场景}}”生成音频方案：\n- 音乐：风格/BPM/段落与过门；长度={{时长}}；节奏点={{节奏点（秒）}}\n- 旁白：语言/人设/语速={{旁白语言/人设/语速}}；文本草稿（短句/口语化）\n- 音效：清单（命名/时刻/用途）\n- 英文生成提示词（音乐/旁白/音效/Negative）。`
  },
  {
    title: '缩略图/封面优化·点击率导向提示词',
    description: '基于平台规范与人类注意力机制优化缩略图元素与文案位',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['thumbnail','cover','ctr','attention'],
    variables: ['平台', '主题与卖点', '品牌元素', '禁止元素', '对比与边框'],
    stars: 0,
    content: `优化“{{平台}}”缩略图：主题={{主题与卖点}}；品牌={{品牌元素}}；禁止={{禁止元素}}；对比/边框要求={{对比与边框}}。\n输出：元素布局/文案位/对比色/强调与留白、英文Prompt/Negative、三种变体方向。`
  },
  {
    title: '图像精修·抠图/去噪/上色/修复提示词',
    description: '背景移除/去噪/划痕修复/老照片上色/超分/去水印的流程化提示词',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['retouch','restore','upscale','denoise','colorize'],
    variables: ['源图说明', '问题类型', '期望风格', '输出尺寸'],
    stars: 0,
    content: `针对源图：{{源图说明}}；问题：{{问题类型}}；目标风格：{{期望风格}}；输出：{{输出尺寸}}。\n输出：步骤化英文提示词（抠图/去噪/修复/上色/超分/去水印），负面词与参数建议。`
  },
  {
    title: '色彩分级/ LUT 生成·电影级校色提示词',
    description: '输入参考风格，输出校色说明与LUT生成提示词，适配不同场景',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['grading','lut','color','cinematic'],
    variables: ['参考影片/风格', '镜头场景', '肤色保护与对比', '输出介质（web/影院/移动）'],
    stars: 0,
    content: `依据“{{参考影片/风格}}”，对“{{镜头场景}}”输出校色方案：肤色保护={{肤色保护与对比}}；介质={{输出介质（web/影院/移动）}}。\n输出：英文提示词（Lift/Gamma/Gain、曲线、胶片质感）、LUT生成建议、预览校验清单。`
  },
  {
    title: '字体与排版搭配·可读性与品牌一致性',
    description: '标题/正文字体搭配，字号行距对齐系统，适配中英双语与等宽需求',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['typography','pairing','readability','bilingual'],
    variables: ['品牌与场景', '标题与正文字体备选', '字号/行距/栅格', '中英双语/等宽需求'],
    stars: 0,
    content: `为“{{品牌与场景}}”设计排版系统：字体搭配（标题/正文）、字号/行距/栅格、对齐与对比、双语与等宽适配；输出英文Prompt用于自动化产出一致排版示例。`
  },
  {
    title: 'SEO 内容Brief·关键词簇与大纲',
    description: '生成关键词簇/搜索意图/标题与小节大纲/FAQ/结构化数据建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'growth',
    tags: ['seo','brief','keywords','outline','schema'],
    variables: ['核心主题', '目标关键词', '用户画像', '竞品页面URL（可选）'],
    stars: 0,
    content: `围绕“{{核心主题}}”“{{目标关键词}}”，结合用户画像={{用户画像}}：\n- 关键词簇/意图分组/难度估计\n- 标题与小节大纲（含FAQ）\n- 结构化数据（FAQ/Article/Product）与内部链接建议\n- 产出规范（长度/语气/媒体要素）`
  },
  {
    title: '内容日历·多渠道编排（4-8周）',
    description: '生成主题→渠道→素材→发布频率→复用策略的内容日历（表格）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'growth',
    tags: ['content-calendar','social','repurpose'],
    variables: ['目标人群', '主线主题（2-3个）', '渠道（站点/社媒/邮箱/视频）', '频率与节奏', '素材池来源'],
    stars: 0,
    content: `请生成内容日历（4-8周）：\n- 周节奏与渠道分配\n- 每条内容：标题/要点/素材/CTA/复用建议\n- KPI与复盘维度；素材池管理与迭代机制。`
  },
  {
    title: '邮件营销·Drip Campaign（3-7封）',
    description: '冷启动/激活/教育/促销/回访路径，含主题行/开头/CTA与A/B方案',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'growth',
    tags: ['email','drip','ab-test','copy'],
    variables: ['目标人群', '价值主张', '路径阶段', '关键异议点'],
    stars: 0,
    content: `为“{{目标人群}}”设计 Drip Campaign（{{路径阶段}}）：\n- 每封邮件：主题行/开头/主体/CTA/PS\n- A/B 两版（不同角度打点关键异议：{{关键异议点}}）\n- 发送节奏与触发条件；退订与偏好中心建议。`
  },
  {
    title: '新闻稿/媒体通稿·结构与要点',
    description: '标题/导语/关键信息/引用/数据/落地页链接/媒体适配要点',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'writing',
    tags: ['press','pr','news','media'],
    variables: ['事件主题', '受众与媒体类型', '关键信息点（3-5条）', '引用对象与素材'],
    stars: 0,
    content: `为“{{事件主题}}”撰写通稿：\n- 标题/导语/主体结构\n- 关键信息点（{{关键信息点（3-5条）}}）与数据\n- 引用与署名/素材位\n- 落地页与媒体适配要点（长度/格式）。`
  },
  {
    title: '广告创意·多变体生成（文案+视觉要素）',
    description: '同一诉求多角度打点：痛点/愿景/证据/对比/限定/赠品/社会证明等',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'growth',
    tags: ['ads','creative','variants','copy-visual'],
    variables: ['产品/服务', '目标人群', '主诉求', '投放渠道', '合规限制'],
    stars: 0,
    content: `请为“{{产品/服务}}”面向“{{目标人群}}”，在“{{投放渠道}}”生成 6-10 个创意变体：\n- 每个变体：角度（痛点/愿景/证据/对比/限定/赠品/社会证明等）+短文案+视觉元素建议\n- 合规：{{合规限制}}；输出对照表，便于A/B测试。`
  },
  {
    title: '落地页/着陆页·结构与文案提示词',
    description: '从价值主张→利益点→证据→异议处理→CTA→FAQ 的完整结构与提示词',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'growth',
    tags: ['landing-page','copywriting','conversion'],
    variables: ['产品/服务', '目标用户', '核心利益点', '证据与案例', '关键异议'],
    stars: 0,
    content: `请输出落地页结构与提示词：\n- 首屏（标题/副标题/CTA/视觉）\n- 利益点（3-5条）与证据（案例/数据/口碑）\n- 异议处理与保障\n- CTA组合与FAQ\n- 英文Prompt：用于自动化生成页面视觉与变体。`
  },
  {
    title: 'PRD骨架·MVP验收',
    description: '生成MVP导向的PRD骨架与验收标准',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'product',
    tags: ['prd','mvp','spec'],
    variables: ['应用名称', '目标用户', '核心任务', '关键KPI'],
    stars: 0,
    content: `为{{应用名称}}生成PRD骨架，目标用户为{{目标用户}}，核心任务为{{核心任务}}，关键KPI为{{关键KPI}}。\n分节输出Markdown：目标与人群、用户故事、范围(必须/可延后)、MVP验收(可操作/可度量)、成功指标、风险与假设、后续路线图(4周)。`
  },
  {
    title: '技术方案·可演进架构',
    description: '模块/接口/数据/鉴权/监控一体化输出',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'engineering',
    tags: ['architecture','api','data','security'],
    variables: ['技术栈', '核心模块'],
    stars: 0,
    content: `基于{{技术栈}}为系统设计“可演进架构”，列出模块与接口契约（入参/出参/错误码）、数据模型、鉴权与配额、监控指标与告警、部署拓扑。\n同时给出Mermaid架构图(代码块)与接口表(表格)。`
  },
  {
    title: '定价与单元经济',
    description: 'LTV/CAC/毛利与回本测算，给出价格建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'growth',
    tags: ['pricing','unit-economics'],
    variables: ['收费模式', '成本结构', '渠道与CAC'],
    stars: 0,
    content: `为产品建立单元经济模型：收费模式{{收费模式}}，成本结构{{成本结构}}，渠道与CAC{{渠道与CAC}}。\n输出表格：LTV、CAC、毛利率、回本周期；敏感性分析(价格/留存/成本 3x3)；价格建议(区间/依据)。`
  },
  {
    title: '路演BP·10页结构',
    description: 'Why Now / Moat / Unit Economics / Ask',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'capital',
    tags: ['bp','fundraising'],
    variables: ['项目要点'],
    stars: 0,
    content: `将{{项目要点}}组织为投资级BP大纲：10页（Problem/Insight/Solution/WhyNow/Market/GoToMarket/Moat/UnitEconomics/Team/Ask）。每页给出要点与1句证据。`
  }
  ,
  // —— 玄学/算命 专业提示词 ——
  {
    title: '八字四柱·专业命理解读（含大运流年）',
    description: '以传统命理方法，输出结构化、可执行的解读与建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['bazi','four-pillars','destiny','fortune'],
    variables: ['公历生日', '出生时间', '出生地点', '性别', '关注主题'],
    stars: 0,
    content: `你是资深命理师，按四柱八字正统方法进行专业解读。
输入：
- 公历生日：{{公历生日}}
- 出生时间：{{出生时间}}
- 出生地点：{{出生地点}}
- 性别：{{性别}}
- 关注主题：{{关注主题}}（如事业/财运/感情/健康/合作）

输出Markdown（结构化）：
1) 命盘信息（天干地支、五行旺衰、喜忌用神）
2) 核心性格与禀赋（优势/短板）
3) 事业/财运/感情/健康 分项趋势（含要点与风险）
4) 大运流年重点（近3年焦点与时间窗口）
5) 行动建议（可执行：避免××、把握××、建立××）
6) 注意：仅作参考，不涉绝对化断言。`
  },
  {
    title: '紫微斗数·命盘专业分析（含格局定位）',
    description: '结合主星、四化与宫位，形成可读的策略建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['ziwei','fortune','stars'],
    variables: ['公历生日', '出生时间', '出生地点', '关注主题'],
    stars: 0,
    content: `你是专业紫微斗数老师，请生成命盘要点并做决策支持。
输入：
- 公历生日：{{公历生日}}
- 出生时间：{{出生时间}}
- 出生地点：{{出生地点}}
- 关注主题：{{关注主题}}

输出：
- 盘型概览（命宫/身宫、主星组合、格局与宫位关系）
- 四化影响与迁移（化禄/权/科/忌的作用点）
- 关键宫位逐项研判（事业/财帛/夫妻/疾厄/田宅/福德等）
- 未来18-24个月关键节点（月份/主题/建议）
- 结论与行动清单（清晰可执行）`
  },
  {
    title: '西方占星·本命盘专业解读（含相位与宫位）',
    description: 'Sun/Moon/ASC 及行星相位、宫位落点的系统化说明',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['astrology','natal-chart','transit'],
    variables: ['公历生日', '出生时间', '出生地点', '关注主题'],
    stars: 0,
    content: `你是占星专家，请基于本命盘做专业解读并转化为实践建议。
输入：{{公历生日}} / {{出生时间}} / {{出生地点}}；关注：{{关注主题}}
输出：
- 核心三要素（太阳/月亮/上升）与人格基调
- 行星在宫位与星座的落点要义
- 主要相位对主题的影响（合冲刑拱六合）
- 未来1年行运提示（重点月份、主题与注意事项）
- 结合主题的可执行建议（职业/关系/健康/学习等）`
  },
  {
    title: '塔罗牌·三张牌/十字牌阵解读',
    description: '专业牌义解析与行动方案，兼顾逆位与语境',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['tarot','spread','reading'],
    variables: ['问题描述', '牌阵类型', '抽到的牌（含正逆）'],
    stars: 0,
    content: `你是专业塔罗师。基于 {{牌阵类型}}，针对“{{问题描述}}”解读：
- 牌面：{{抽到的牌（含正逆）}}
请输出：
1) 每张牌的语义（结合正逆与问题语境）
2) 故事线与因果关系
3) 对应的行动建议（立刻/短期/长期）
4) 风险与备选方案
5) 温馨提示：结论供参考，不作绝对保证。`
  },
  {
    title: '家居风水·户型诊断与优化建议',
    description: '坐向/明堂/动线/五行/采光/煞气等综合分析',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['fengshui','home','layout'],
    variables: ['户型图说明', '朝向', '家庭成员', '主要诉求'],
    stars: 0,
    content: `你是资深风水顾问，请根据提供信息做合理诊断与优化。
输入：
- 户型图说明：{{户型图说明}}
- 朝向：{{朝向}}
- 家庭成员：{{家庭成员}}
- 主要诉求：{{主要诉求}}
输出：
- 风水要点体检（采光/通风/动线/煞气/五行平衡）
- 高影响问题清单（影响与原因）
- 可执行优化（分区：玄关/客厅/卧室/厨房/卫生间/书房）
- 禁忌与注意事项
- 预期变化与验证方法（周期/观察点）`
  },
  {
    title: '起名与五行音律·专业建议与评分',
    description: '结合五行声调、形音义、文化内涵与重名风险',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['naming','five-elements','phonology'],
    variables: ['姓氏', '性别', '出生信息', '文化偏好', '用途（人名/品牌）'],
    stars: 0,
    content: `你是命名顾问。基于{{姓氏}}与{{出生信息}}，为{{用途（人名/品牌）}}提供3-5个候选名：
要求：
- 五行与声调平衡（阴阳/清浊/平仄）
- 形音义协调，避免谐音歧义
- 文化意象与愿景匹配
- 重名风险提示与域名可用性初筛
输出表格：候选名/读音/五行与声调/寓意/重名风险/建议场景。`
  }
  ,
  // —— 追加：奇门遁甲 / 六爻 / 流年流月细化 / 合盘 ——
  {
    title: '奇门遁甲·时空盘策略（决策/择时/布局）',
    description: '基于时空盘、九宫、九星、八门、九神形成策略建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['qimen','timing','strategy'],
    variables: ['起局时间', '地点', '事项主题', '目标与约束'],
    stars: 0,
    content: `你是专业奇门顾问，请基于“{{起局时间}} @ {{地点}}”就“{{事项主题}}”给出策略：
1) 盘面要点（值符/值使、宫位旺衰、吉凶格局）
2) 最佳方位与行动路径（择时/择方）
3) 三步方案（先行/协同/验证）
4) 风险与化解
5) 注意：为参考建议，不作绝对保证。`
  },
  {
    title: '六爻/梅花易数·断卦（世应/用神/变爻）',
    description: '起卦、旺衰、用神定位、变爻解读与结论建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['liuyao','meihua','divination'],
    variables: ['起卦方式', '卦象', '问题主题', '时间窗口'],
    stars: 0,
    content: `你是六爻/梅花易数资深老师，针对“{{问题主题}}”：
输入：起卦方式={{起卦方式}}；卦象={{卦象}}；时间={{时间窗口}}
输出：
- 用神与世应定位、旺衰与冲合
- 变爻与互卦、错综关系
- 结论倾向与概率、关键时间点
- 可执行建议与备选方案
- 提示：供参考。`
  },
  {
    title: '流年流月·细颗粒趋势与规划（12个月）',
    description: '按月提示主题与窗口，输出行动规划清单',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['annual','monthly','planning'],
    variables: ['生日信息', '关注主题', '当年年份'],
    stars: 0,
    content: `请基于{{生日信息}}，围绕“{{关注主题}}”，对{{当年年份}}的12个月给出：
- 月度主题与强弱评分
- 关键窗口与注意事项
- 行动计划（当月3个要点）
- 复盘指标（如何验证）
结尾给出：季度里程碑与资源配置建议。`
  },
  {
    title: '八字合婚·匹配度与关系策略（合盘）',
    description: '以八字合盘评估匹配与风险，并给出关系建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['bazi','synastry','relationship'],
    variables: ['甲方出生信息', '乙方出生信息', '关注焦点'],
    stars: 0,
    content: `你是八字合婚顾问，请就关系进行合盘分析：
输入：甲方={{甲方出生信息}}；乙方={{乙方出生信息}}；关注={{关注焦点}}
输出：
- 五行互补与冲克、喜忌互动
- 关系强弱点：沟通/价值/节奏/压力源
- 关键时间点与相处策略
- 风险与修复建议（具体可执行）
- 提示：结论为参考。`
  },
  {
    title: '占星合盘（Synastry & Composite）·关系洞察',
    description: '两人盘/组合盘，核心相位、宫位落点与建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['astrology','synastry','composite'],
    variables: ['甲方出生信息', '乙方出生信息', '关系疑问'],
    stars: 0,
    content: `你是占星关系顾问：
输入：甲方={{甲方出生信息}}；乙方={{乙方出生信息}}；疑问={{关系疑问}}
输出：
- 合盘核心相位的吸引/摩擦点
- 宫位落点对生活领域的影响
- 组合盘（Composite）稳定性与主题
- 沟通与边界建议；阶段性时间窗口
- 注意：为参考建议。`
  }
  ,
  // —— 场景化：事业/财运择时、开业/搬家/签约择吉 ——
  {
    title: '事业/财运专项·择时窗口与行动方案',
    description: '基于命理/占星，给出近90天最优行动窗口与计划',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['timing','career','wealth'],
    variables: ['出生信息', '地点', '目标（升职/跳槽/谈判/投资/回款）', '时间范围（如90天）', '风险偏好'],
    stars: 0,
    content: `你是事业/财运择时顾问，请结合命理/占星给出“{{时间范围（如90天）}}”内“{{目标（升职/跳槽/谈判/投资/回款）}}”的最优窗口：
1) 时间热力图（周为粒度），标注强/中/弱
2) Top3窗口（日期区间/主题/注意事项）
3) 行动方案（前置准备/当日节奏/复盘要点）
4) 风险控制（阈值/止损/替代方案）
5) 附注：地点={{地点}}；风险偏好={{风险偏好}}；仅供参考。`
  },
  {
    title: '择吉：开业/搬家/签约·专业建议（含禁忌）',
    description: '确定吉日与时段、主事人/方位/流程与注意事项',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['auspicious','opening','moving','contract'],
    variables: ['事件类型（开业/搬家/签约）', '候选日期范围', '地点', '主事人出生信息', '环境限制（周末/工作日/时段）'],
    stars: 0,
    content: `你是专业择吉顾问，请为“{{事件类型（开业/搬家/签约）}}”在“{{候选日期范围}}”与地点“{{地点}}”条件下给出：
1) 推荐日期与时段（至少3个，含理由）
2) 动线与方位建议（迎送/摆放/仪式次序）
3) 主事人与辅助人员注意（属相/禁忌/配合）
4) 备选方案与不宜日提醒
5) 注意：环境限制={{环境限制（周末/工作日/时段）}}；结论供参考。`
  }
  ,
  // —— 扩展：高实用度专业提示词 ——
  {
    title: '健康体质与调养·饮食/作息/运动方案',
    description: '基于命理/占星倾向，定制三阶段调养与指标追踪',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['health','wellbeing','plan'],
    variables: ['出生信息', '当前症状/困扰', '作息与工作形态', '运动偏好与禁忌'],
    stars: 0,
    content: `请基于{{出生信息}}与现状（{{当前症状/困扰}}，作息：{{作息与工作形态}}）制定调养方案：
- 体质倾向与风险点（2-3条）
- 饮食/作息/运动三阶段方案（4周/8周/12周）
- 关键指标追踪（睡眠/心率/体重/疼痛/心情等）
- 加剧因素与避免清单；可替代方案
- 温馨提示：个体差异显著，结论供参考。`
  },
  {
    title: '考试/面试·择时与应对策略',
    description: '给出准备节奏、临场策略与备选窗口（近60天）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['exam','interview','timing'],
    variables: ['出生信息', '目标考试/岗位', '预估时间范围', '短板与优势'],
    stars: 0,
    content: `针对“{{目标考试/岗位}}”，在{{预估时间范围}}内给出：
- 准备节奏（周粒度）与重点
- 临场策略（开场/节奏/应变）
- Top3备选窗口（日期/理由/注意）
- 心理与体能维持建议；复盘方法
- 备注：短板={{短板与优势}}；仅供参考。`
  },
  {
    title: '合作/签约·风控清单与匹配度评估',
    description: '从五行/相位互动抽取风险点并转化为条款清单',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['partnership','contract','risk'],
    variables: ['甲方信息', '乙方信息', '合作目标', '关键敏感点'],
    stars: 0,
    content: `请就“{{合作目标}}”对甲方={{甲方信息}} 与 乙方={{乙方信息}} 出具：
- 匹配度要点（价值/节奏/权责/压力源）
- 风险点与缓解策略（转化为合同条款建议）
- 决策建议（推进/观望/中止）与理由
- 沟通边界与关键检查点
- 附注：关键敏感点={{关键敏感点}}；仅供参考。`
  },
  {
    title: '投资与资产配置·周期提示与动作边界',
    description: '结合行运/周期，在风险控制下给出动作建议',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['investment','asset-allocation','risk'],
    variables: ['出生信息', '风险偏好', '资产结构', '关注市场'],
    stars: 0,
    content: `基于{{出生信息}}、风险偏好={{风险偏好}}、资产={{资产结构}}、市场={{关注市场}}：
- 未来6-12个月周期提示（强/中/弱）
- 买卖动作边界（仓位/止损/加减仓条件）
- 资产分散与相关性建议
- 三个“不要做”的清单；复盘指标
- 免责声明：不构成投资建议。`
  },
  {
    title: '备孕/怀孕/生产·择时与注意事项',
    description: '结合体质倾向与时间窗口给出风险与建议（参考用）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['fertility','pregnancy','timing'],
    variables: ['个人出生信息', '伴侣出生信息', '医生建议/既往史', '时间范围'],
    stars: 0,
    content: `请在{{时间范围}}内，结合个人/伴侣与医生建议，给出：
- 备孕与产检节奏建议；注意事项
- 相对有利/不利窗口（谨慎表述）
- 身心调适与支持系统清单
- 风险提示与就医建议（权威优先）
- 重要：仅作参考，遵医嘱。`
  },
  {
    title: '迁移/出国·择时与落地规划',
    description: '选择窗口、落地风险与资源配置（家庭/职业）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['relocation','overseas','planning'],
    variables: ['家庭成员与出生信息', '目标国家/城市', '职业方向', '时间范围'],
    stars: 0,
    content: `围绕迁移到“{{目标国家/城市}}”，在{{时间范围}}内：
- 窗口选择（Top2-3）与注意事项
- 家庭/职业双线落地方案
- 风险点（政策/文化/健康/教育）与准备清单
- 阶段性目标与验证指标
- 备注：仅供参考。`
  },
  {
    title: '产品发布/上新·择时与发布节奏',
    description: '给出发布窗口、节奏与传播位形（近90天）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['product-launch','marketing','timing'],
    variables: ['产品/版本', '目标市场', '传播渠道', '时间范围'],
    stars: 0,
    content: `请为“{{产品/版本}}”在{{时间范围}}内给出：
- 发布窗口（日期/理由/风险）
- 预热-发布-复盘节奏（节点与内容）
- 渠道与内容位形建议
- 风险与应急预案
- 提示：目标市场={{目标市场}}；渠道={{传播渠道}}。`
  },
  {
    title: '旅行/出行·风险窗口与线路建议',
    description: '标注风险窗口并输出行程与注意事项清单',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['travel','safety','plan'],
    variables: ['出行时间范围', '目的地/线路', '同行人信息', '健康/安全关注点'],
    stars: 0,
    content: `针对“{{目的地/线路}}”在{{出行时间范围}}内：
- 风险窗口与注意点（交通/天气/健康/治安）
- 线路建议与节奏（含备选）
- 随身清单与保险建议
- 不宜安排的活动提醒
- 注意：信息随时变动，出行前再核验。`
  },
  {
    title: '子女教育·倾向与发展规划（3-12个月）',
    description: '基于禀赋与兴趣，给出分阶段目标与实践路径',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'metaphysics',
    tags: ['education','children','planning'],
    variables: ['子女出生信息', '当前年级/兴趣', '家庭资源', '目标与担忧'],
    stars: 0,
    content: `请基于{{子女出生信息}}，结合{{当前年级/兴趣}}与家庭资源：
- 天赋与兴趣倾向（观察点）
- 3-12个月阶段目标与实践任务
- 家庭支持与资源配置建议
- 风险与纠偏方式
- 提示：以孩子身心健康与兴趣为先。`
  }
  ,
  // —— 视觉与视频生成：图片/Logo/头像/视频 ——
  {
    title: '图片生成·通用构图与风格提示词器（MJ/SD/FLUX）',
    description: '一键生成高质量图片生成提示词，含风格/光线/镜头/负面词/比例',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['image','midjourney','sdxl','flux','photography','illustration'],
    variables: ['主题', '画面要素', '风格参考（摄影/插画/艺术家）', '光线', '色调', '镜头与相机', '材质与质感', '纵横比', '负面词', '模型/平台'],
    stars: 0,
    content: `目标：围绕“{{主题}}”生成高质量图片的英文提示词（兼容 MJ/SD/FLUX）。\n\n画面要素：{{画面要素}}\n风格参考：{{风格参考（摄影/插画/艺术家）}}\n光线：{{光线}}；色调：{{色调}}；镜头：{{镜头与相机}}；材质：{{材质与质感}}\n纵横比：{{纵横比}}；平台/模型：{{模型/平台}}\n\n请输出：\n1) Prompt（英文，<=180词，主体在前，修饰排布清晰，逗号分隔，避免语法噪声）\n2) Parameters（如 --ar, --stylize / SDXL: CFG, steps, sampler）\n3) Negative Prompt（中文→英文，去除瑕疵/多指/畸变/文字/水印/低清等）：{{负面词}}\n4) 变体建议（更写实/更艺术/更简洁 三条）`
  },
  {
    title: 'Logo 设计·品牌风格与多变体生成提示词',
    description: '围绕品牌名与人格，生成英文Logo提示词与色板/约束',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['logo','brand','visual-identity','vector','minimal'],
    variables: ['品牌名', '标语（可选）', '行业', '品牌人格（理性/活力/高端/亲和）', '色彩偏好', '禁用元素'],
    stars: 0,
    content: `请基于品牌“{{品牌名}}”（标语：{{标语（可选）}}，行业：{{行业}}），人格：{{品牌人格（理性/活力/高端/亲和）}}，生成英文Logo提示词：\n- Prompt（英文，强调：简洁、可读、可缩放、矢量/网格、留白、负空间、适配深浅底色）\n- 设计约束：需排除{{禁用元素}}；色彩偏好：{{色彩偏好}}（给出HEX）\n- 输出3个风格方向（极简字标/图形标/徽章式），每个方向给出：关键词、形态特征、应用场景\n- Negative Prompt（避免复杂纹理/摄影质感/像素化/低分辨率/多余文字）`
  },
  {
    title: '头像/人像·高质写真与风格化提示词',
    description: '适用于个人形象/社交头像/职场形象照/二次元化',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['avatar','portrait','headshot','studio','anime'],
    variables: ['性别', '年龄段', '气质关键词', '服装与配饰', '背景环境', '发型与妆容', '表情与姿态', '相机与镜头', '光线', '比例', '负面词'],
    stars: 0,
    content: `Please craft a high-quality portrait prompt for a {{性别}}, {{年龄段}} with vibes: {{气质关键词}}.\nWardrobe: {{服装与配饰}}; Hair/Makeup: {{发型与妆容}}; Background: {{背景环境}}; Expression/Pose: {{表情与姿态}};\nCamera/Lens: {{相机与镜头}}; Lighting: {{光线}}; Aspect Ratio: {{比例}}.\nReturn: (1) English Prompt (<=150 words); (2) Negative Prompt (remove artifacts/extra fingers/text/logos/lowres): {{负面词}}; (3) 3 style variants (studio/natural/cinematic).`
  },
  {
    title: '视频生成·脚本/分镜/镜头级提示词（Sora/Runway/Pika）',
    description: '从文案到镜头表与镜头提示词（每镜头5-8秒）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['video','storyboard','gen-vid','sora','pika','runway'],
    variables: ['题材', '目标受众', '时长（秒）', '风格（电影/广告/教程）', '旁白语言与语速', '音乐风格', '字幕样式', '分辨率', '纵横比'],
    stars: 0,
    content: `请围绕“{{题材}}”为“{{目标受众}}”生成 {{时长（秒）}}s 视频方案：\n1) 一句话钩子+价值主张\n2) 段落脚本（3-6段，旁白文案简短有力；{{旁白语言与语速}}）\n3) 分镜表（每镜头5-8秒）：镜头号/景别/画面描述/运动/转场/音效/字幕\n4) 每镜头“生成视频提示词”（英文），包含：Scene Prompt、Negative、Camera（焦段/运动）、Lighting、Motion、Duration（秒）、Resolution={{分辨率}}、Aspect={{纵横比}}\n5) BGM建议与节奏点，字幕样式={{字幕样式}}；结尾CTA。`
  },
  {
    title: '电商产品图/海报·卖点可视化与排版提示词',
    description: '从卖点→主视觉→辅助图→信息层级→版式要素（可输出多版）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['ecommerce','poster','product','layout','typography'],
    variables: ['产品名称', '核心卖点（3-5条）', '目标人群', '场景与道具', '风格与质感', '品牌主色', '尺寸与比例', '负面词'],
    stars: 0,
    content: `请围绕“{{产品名称}}”，面向“{{目标人群}}”，将“{{核心卖点（3-5条）}}”可视化：\n- 主视觉图提示词（英文，突出质感/材质/光线/构图）\n- 辅助细节图（2-3张）提示词（功能/场景/对比）\n- 海报排版要素：标题/副标题/卖点bullet/价格位/CTA按钮位/徽标位，版式层级与留白建议\n- 色彩与字体建议（包含品牌主色：{{品牌主色}}）\n- Negative Prompt：{{负面词}}；尺寸与比例：{{尺寸与比例}}。`
  }
  ,
  {
    title: '社媒封面/帖子套件·多平台多比例提示词',
    description: '针对多平台（B站/抖音/X/Instagram/小红书）批量输出封面与帖子视觉提示词',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['social','cover','post','bilibili','douyin','instagram','x','xiaohongshu'],
    variables: ['品牌名', '活动/话题', '主视觉元素', '口号与关键信息', '配色方案', '目标平台', '纵横比列表'],
    stars: 0,
    content: `围绕品牌“{{品牌名}}”与话题“{{活动/话题}}”，基于主视觉“{{主视觉元素}}”、配色“{{配色方案}}”，面向平台：{{目标平台}}（比例：{{纵横比列表}}），输出：\n- 封面Prompt（英文，突出识别性与可读性）\n- 帖子主图Prompt（英文，信息层级清晰）\n- 文案位/徽标位/CTA位的版式建议（每平台适配）\n- 负面词（防止低清/文字糊/水印/畸变）\n- 可生成3个方向变体（品牌延展/主题强化/极简传播）`
  },
  {
    title: '短视频脚本·钩子-价值-节奏（B站/抖音）',
    description: '30-90秒短视频：钩子/价值点/节奏/镜头与字幕/BGM/CTA 一体化',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['short-video','script','bilibili','douyin','tiktok'],
    variables: ['主题', '目标受众', '时长（秒）', '关键信息', '风格（科普/测评/剧情/教程）', '旁白与字幕语言', 'BGM风格'],
    stars: 0,
    content: `请为“{{主题}}”面向“{{目标受众}}”生成 {{时长（秒）}}s 短视频方案（{{风格（科普/测评/剧情/教程）}}）：\n1) 开场钩子（5-7秒）+价值主张\n2) 内容节奏（3-5段，每段一句话目标）\n3) 镜头级提示词（英文）：Scene/Camera/Lighting/Motion/Negative/Subtitles\n4) 字幕与BGM节奏点（{{旁白与字幕语言}}；BGM={{BGM风格}}）\n5) 结尾CTA（关注/转发/链接）`
  },
  {
    title: '开箱/评测视频·分镜与画面提示词',
    description: '产品开箱/评测脚本，分镜与镜头提示词，突出卖点与对比',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['unboxing','review','storyboard','product'],
    variables: ['产品名称', '核心卖点', '竞品与对比点', '目标受众', '时长（秒）', '风格（理性/感性/实测）'],
    stars: 0,
    content: `针对“{{产品名称}}”做开箱/评测：\n- 脚本结构：引入-卖点-对比-实测-结论\n- 分镜表（每镜头5-8秒）：画面/运动/光线/字幕/音效\n- 每镜头英文提示词（Scene/Camera/Lighting/Negative）\n- 竞品对比可视化建议\n- 结论：适用人群/购买建议`
  },
  {
    title: '产品动效·Lottie/AE 关键帧提示词',
    description: '将交互意图与节奏转为 Lottie/AE 动效结构与关键帧描述',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['motion','lottie','after-effects','ui-animation'],
    variables: ['动效目标（引导/反馈/过渡）', '品牌风格', '元素/层列表', '节奏（快/中/慢）', '时长（秒）', '导出规格'],
    stars: 0,
    content: `请将“{{动效目标（引导/反馈/过渡）}}”转化为动效方案：\n- 结构：层/组/父子关系；进入/停留/退出\n- 关键帧：位置/缩放/透明/旋转/弹性曲线（ease-in/out/bounce）\n- 品牌风格与色彩/节奏={{节奏（快/中/慢）}}；时长={{时长（秒）}}\n- Lottie 导出注意（矢量/不嵌字体/可交互标记）；AE 参考设置\n- 英文生成提示词：用于图形元素与帧动画描述（含 Negative）`
  },
  {
    title: 'SVG 图标/插画·可访问与可缩放生成提示词',
    description: '输出干净的 SVG（viewBox、stroke/fill、无栅格、无外链字体），附可读性与对比度约束',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'design',
    tags: ['svg','icon','illustration','vector','accessibility'],
    variables: ['主题', '风格（线性/双色/扁平/极简）', '线宽与端点', '配色（HEX）', '视图盒（viewBox）', '尺寸'],
    stars: 0,
    content: `请生成“{{主题}}”的 SVG 提示词（英文）：\n- 结构：<svg viewBox="{{视图盒（viewBox）}}" ...>，对象使用 <path>/<rect>/<circle> 等；统一 stroke/fill；线宽与端点={{线宽与端点}}；尺寸={{尺寸}}\n- 风格：{{风格（线性/双色/扁平/极简）}}；颜色={{配色（HEX）}}\n- 可访问性：含 <title> 与 aria-label；良好对比度；避免匀色导致不可读\n- 约束：不包含栅格/外链字体/模糊滤镜；结构语义清晰；便于动画与样式复用\n- Negative：冗余节点/锯齿/位图痕迹/无viewBox。`
  },
  {
    title: '脑图生成·Mermaid Mindmap/JSON 结构化输出',
    description: '将主题拆解为层级结构，输出 Mermaid mindmap 与 JSON 节点树',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'analysis',
    tags: ['mindmap','mermaid','diagram','outline'],
    variables: ['主题', '深度（2-4）', '主分支数', '风格（实用/教学/项目分解/知识纲要）'],
    stars: 0,
    content: `请围绕“{{主题}}”生成脑图：\n- Mermaid 语法：mindmap 格式（根-分支-子节点）\n- 同步输出 JSON 节点树（id/title/children），用于前端渲染\n- 深度={{深度（2-4）}}；主分支={{主分支数}}；风格={{风格（实用/教学/项目分解/知识纲要）}}\n- 约束：节点命名短小一致；层级清晰；避免冗余与重复`
  },
  {
    title: '速记/会议纪要·要点提炼与行动清单',
    description: '快速结构化记录：要点/决策/行动/阻塞/负责人与截止时间（RFC风格）',
    source: 'deepneed-seed',
    repo: 'deepneed-seed',
    category: 'writing',
    tags: ['notes','minutes','todo','rfc'],
    variables: ['会议主题/场景', '参与者', '原始要点（可粘贴）', '目标与关注点'],
    stars: 0,
    content: `请将以下内容结构化为速记：\n输入：{{原始要点（可粘贴）}}；会议：{{会议主题/场景}}；参与者：{{参与者}}；目标：{{目标与关注点}}\n输出：\n- 要点清单（短句/分组）\n- 决策与结论\n- 行动项（负责人/截止时间/依赖/状态）\n- 风险与阻塞\n- Follow-up 会议建议时间与议题`
  }
];

export default millionAppPrompts;


