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
];

export default millionAppPrompts;


