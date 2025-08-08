import React from 'react';

export interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
}

export const millionDollarCourseSlides: Slide[] = [
  {
    id: 1,
    title: "价值百万的AI应用公开课",
    content: (
      <div className="text-center h-full flex flex-col justify-center">
        <h1 className="text-5xl font-bold text-white mb-8 leading-tight">
          价值百万的AI应用公开课
        </h1>
        
        <div className="text-2xl text-emerald-400 font-semibold mb-12">
          15分钟掌握AI时代财富密码
        </div>
        
        <div className="text-3xl text-red-400 font-bold mb-16 animate-pulse">
          只讲一件事：如何把焦虑变成红利装进你的口袋
        </div>
        
        <div className="text-xl text-gray-300 mb-12">为什么是我来讲</div>
        
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">3</div>
            <div className="text-white">亿级产品</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">100+</div>
            <div className="text-white">发明专利</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">N</div>
            <div className="text-white">AI应用</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "当下我们正站在一个巨大的红利风口",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          当下我们正站在一个巨大的红利风口
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-2xl text-white mb-6">
            过去让我们焦虑的问题，现在都是AI时代的商机
          </div>
          <div className="text-xl text-gray-300">
            原来每个焦虑背后，都藏着一个等待挖掘的金矿
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-red-400 font-bold text-xl mb-4 text-center">❌ 不要做</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-white">
                <span className="text-red-400 mr-2">▸</span>
                不要做玩具
              </li>
              <li className="flex items-center text-white">
                <span className="text-red-400 mr-2">▸</span>
                不要空谈想法
              </li>
            </ul>
          </div>
          
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-emerald-400 font-bold text-xl mb-4 text-center">✅ 要做到</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-white">
                <span className="text-emerald-400 mr-2">▸</span>
                抓住真正的需求
              </li>
              <li className="flex items-center text-white">
                <span className="text-emerald-400 mr-2">▸</span>
                打造真正的产品
              </li>
              <li className="flex items-center text-white">
                <span className="text-emerald-400 mr-2">▸</span>
                实现商业价值
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📈</div>
              <div className="text-white font-semibold">需求天花板不断提升</div>
              <div className="text-gray-400 text-sm">需求爆炸式增长</div>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold">AI降低满足成本</div>
              <div className="text-gray-400 text-sm">门槛降到地板</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-white font-semibold">此刻就是红利期</div>
              <div className="text-gray-400 text-sm">普通人能摘果实</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "别做玩具，要做真正的需求",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          别做玩具，要做真正的需求
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-2xl text-red-400 font-bold mb-4">
            想法不落地都是空谈，我们要迅速行动！
          </div>
          <div className="text-3xl text-emerald-400 font-bold">
            Prompt是AI时代的编程新入口
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-emerald-500/30 rounded-xl p-8 mb-8">
          <h3 className="text-emerald-400 text-2xl font-bold mb-6 text-center">
            锁定真需求只需简单三步
          </h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">👀</div>
              <h4 className="text-emerald-400 font-bold text-lg mb-2">观察需求</h4>
              <p className="text-gray-300">发现用户痛点</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h4 className="text-purple-400 font-bold text-lg mb-2">访谈用户</h4>
              <p className="text-gray-300">验证需求真实性</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="text-cyan-400 font-bold text-lg mb-2">快速验证</h4>
              <p className="text-gray-300">MVP快速上线</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
          <div className="text-white text-xl font-semibold mb-4">
            高质量Prompt + API调用 + 官网快速搭建
          </div>
          <div className="text-2xl text-emerald-400 font-bold">
            一个晚上你的产品即可上线并开始收费！
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "别空谈想法，要把想法做成真正产品",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          别空谈想法，要把想法做成真正产品
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-2xl text-white font-semibold mb-2">
            MVP → Alpha → Beta 三阶段进化
          </div>
          <div className="text-gray-300">
            每个阶段专注一个核心指标
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-4">MVP</div>
            <h4 className="text-white font-bold text-lg mb-4">验证核心假设</h4>
            <div className="text-emerald-400 font-bold text-lg mb-1">留存率</div>
            <div className="text-emerald-400 font-bold text-3xl">{'>'}20%</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-4">Alpha</div>
            <h4 className="text-white font-bold text-lg mb-4">打磨核心功能</h4>
            <div className="text-purple-400 font-bold text-lg mb-1">NPS指数</div>
            <div className="text-purple-400 font-bold text-3xl">{'>'}30</div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-4">Beta</div>
            <h4 className="text-white font-bold text-lg mb-4">自动化测试</h4>
            <div className="text-cyan-400 font-bold text-lg mb-1">付费转化率</div>
            <div className="text-cyan-400 font-bold text-3xl">{'>'}5%</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
          <div className="text-2xl text-emerald-400 font-bold mb-4">
            小步快跑，周更迭代，用数据说话
          </div>
          <div className="text-gray-300">
            这是AI产品进化的不二法则
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "产品升级成真正商业",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          💰 产品升级成真正商业
        </h2>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-emerald-500/30 rounded-xl p-8 mb-8 text-center">
          <h3 className="text-emerald-400 text-2xl font-bold mb-6">百万价值公式</h3>
          <div className="text-3xl text-white mb-6">
            <span className="text-emerald-400">收入潜力</span> - <span className="text-red-400">成本结构</span> + <span className="text-purple-400">竞争壁垒</span>
          </div>
          <div className="text-gray-300 text-lg">
            盈利核心：AI推理成本必须远低于用户生命周期价值（LTV）
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-emerald-400 text-xl font-bold mb-4">💡 AI产品变现模式</h3>
            <ul className="space-y-3">
              {['订阅制', '增值服务', 'API计费', '市场分成', 'SaaS白标', '数据服务'].map((item, index) => (
                <li key={index} className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-6 text-center">
            <div className="text-lg text-white font-semibold mb-4">GPT Plus 成功案例</div>
            <div className="text-gray-300 mb-2">每月$20 × 1000万日活</div>
            <div className="text-4xl font-bold text-emerald-400 mb-2">$24亿</div>
            <div className="text-gray-400 text-sm mb-4">年收入</div>
            <div className="text-emerald-400 font-semibold">
              赚钱的逻辑简单，关键在于落地执行
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "案例1：Cal AI 拍照识别卡路里",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          📊 案例1：Cal AI 拍照识别卡路里
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-2xl text-white font-semibold mb-4">
            两位美国高中生，8个月创造奇迹
          </div>
          <div className="text-gray-300">
            通过拍食物照片AI自动识别热量
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-emerald-500/30 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-emerald-400 text-xl font-bold mb-4">项目数据</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">500万</div>
                  <div className="text-gray-400 text-sm">下载量</div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">$100万+</div>
                  <div className="text-gray-400 text-sm">月收入</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>开发者：</strong>两位美国高中生
                </li>
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>开发时间：</strong>8个月
                </li>
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>核心功能：</strong>拍照识别卡路里
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">关键启示</h3>
              <ul className="space-y-4">
                <li className="text-white">
                  <span className="text-emerald-400 font-bold">▸ 抓住用户刚需</span><br/>
                  <span className="text-sm text-gray-300">简化操作体验</span>
                </li>
                <li className="text-white">
                  <span className="text-purple-400 font-bold">▸ 微型团队高效执行</span><br/>
                  <span className="text-sm text-gray-300">迅速市场验证</span>
                </li>
                <li className="text-white">
                  <span className="text-cyan-400 font-bold">▸ Freemium模式精妙运用</span><br/>
                  <span className="text-sm text-gray-300">快速实现收支平衡</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "案例2：Cursor AI 程序员效率工具",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          💻 案例2：Cursor AI 程序员效率工具
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-2xl text-white font-semibold mb-4">
            专为程序员开发的AI辅助编程工具
          </div>
          <div className="text-gray-300">
            精准锁定垂直群体核心痛点
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-emerald-500/30 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-emerald-400 text-xl font-bold mb-4">惊人数据</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">$1亿</div>
                  <div className="text-gray-400 text-sm">首年收入</div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">$90亿</div>
                  <div className="text-gray-400 text-sm">估值</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>用户群体：</strong>36万+程序员
                </li>
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>商业模式：</strong>Freemium + PLG
                </li>
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>增长策略：</strong>社区驱动
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">关键启示</h3>
              <ul className="space-y-4">
                <li className="text-white">
                  <span className="text-emerald-400 font-bold">▸ 精准锁定垂直群体</span><br/>
                  <span className="text-sm text-gray-300">核心痛点深度挖掘</span>
                </li>
                <li className="text-white">
                  <span className="text-purple-400 font-bold">▸ 产品主导增长（PLG）</span><br/>
                  <span className="text-sm text-gray-300">Freemium模式成功</span>
                </li>
                <li className="text-white">
                  <span className="text-cyan-400 font-bold">▸ 社区驱动增长</span><br/>
                  <span className="text-sm text-gray-300">迅速扩散口碑</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "案例3：Remini AI 写真爆款",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          📸 案例3：Remini AI 写真爆款
        </h2>
        
        <div className="text-center mb-8">
          <div className="text-3xl text-emerald-400 font-bold mb-4">
            上传几张旧照，AI修复生成写真
          </div>
          <div className="text-2xl text-emerald-400 font-bold">
            海外两周收入过700万美元！
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-emerald-500/30 rounded-xl p-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-emerald-400 text-xl font-bold mb-4">爆款数据</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">4000万</div>
                  <div className="text-gray-400 text-sm">下载量（2周）</div>
                </div>
                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">$1.2亿</div>
                  <div className="text-gray-400 text-sm">年收入</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>核心功能：</strong>AI写真 + Baby AI预测
                </li>
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>应用内购：</strong>$1143万（2周）
                </li>
                <li className="flex items-center text-white">
                  <span className="text-emerald-400 mr-2">▸</span>
                  <strong>传播方式：</strong>社交裂变
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">关键启示</h3>
              <ul className="space-y-4">
                <li className="text-white">
                  <span className="text-emerald-400 font-bold">▸ 洞察情感与娱乐需求</span><br/>
                  <span className="text-sm text-gray-300">满足心理好奇与自我表达</span>
                </li>
                <li className="text-white">
                  <span className="text-purple-400 font-bold">▸ 功能爆点极强</span><br/>
                  <span className="text-sm text-gray-300">视觉冲击力带来社交传播</span>
                </li>
                <li className="text-white">
                  <span className="text-cyan-400 font-bold">▸ Freemium + 高频消费</span><br/>
                  <span className="text-sm text-gray-300">基础免费，高级付费收割</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "总结：从焦虑到掌控",
    content: (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          🎯 总结：从焦虑到掌控
        </h2>
        
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-emerald-500/30 rounded-xl p-8 mb-8">
          <h3 className="text-emerald-400 text-2xl font-bold mb-6 text-center">
            今天课程核心要点
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📈</div>
              <div className="text-white font-semibold mb-2">人类需求</div>
              <div className="text-emerald-400 font-bold text-lg">指数级增长</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <div className="text-white font-semibold mb-2">AI大幅降低</div>
              <div className="text-purple-400 font-bold text-lg">满足成本</div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <div className="text-white font-semibold mb-2">此刻红利期</div>
              <div className="text-cyan-400 font-bold text-lg">百万商机</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
          <h3 className="text-white text-2xl font-bold mb-6">
            🚀 加入"百万应用创造社群"
          </h3>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-4xl mb-4">📚</div>
              <div className="text-emerald-400 font-bold text-lg mb-2">365天持续陪伴</div>
              <p className="text-gray-300 text-sm">从需求到MVP到商业落地</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎁</div>
              <div className="text-purple-400 font-bold text-lg mb-2">私享资源包</div>
              <p className="text-gray-300 text-sm">私享会+Prompt模板库 + API沙箱额度</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🎤</div>
              <div className="text-cyan-400 font-bold text-lg mb-2">AI创新案例库</div>
              <p className="text-gray-300 text-sm">经典案例库，深度诊断业务，和AI大佬一起成长</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500/20 to-purple-500/20 border-2 border-emerald-500 rounded-xl p-6">
            <div className="text-2xl text-emerald-400 font-bold mb-4">扫码进入社群</div>
            <p className="text-white text-lg mb-4">让你的名字出现在下一个经典案例中！</p>
            <div className="text-gray-300">🔥 限时福利：前100名享受专属优惠</div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <h3 className="text-2xl text-emerald-400 font-bold mb-2">
            🌟 祝各位今晚就动手
          </h3>
          <h3 className="text-2xl text-purple-400 font-bold">
            拥抱AI，成就更美好的自己！
          </h3>
        </div>
      </div>
    )
  }
]; 