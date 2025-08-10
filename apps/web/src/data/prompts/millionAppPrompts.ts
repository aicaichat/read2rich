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
];

export default millionAppPrompts;


