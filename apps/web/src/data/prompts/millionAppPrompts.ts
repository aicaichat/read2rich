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
];

export default millionAppPrompts;


