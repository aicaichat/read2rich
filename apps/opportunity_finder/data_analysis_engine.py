#!/usr/bin/env python3
"""
AI机会发现数据分析引擎
智能分析抓取的数据并生成洞察报告
"""

import json
import re
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
from collections import Counter, defaultdict
from dataclasses import dataclass
import statistics
import string


@dataclass
class OpportunityInsight:
    """机会洞察数据结构"""
    title: str
    confidence_score: float
    trend_direction: str  # 'rising', 'stable', 'declining'
    keywords: List[str]
    sources: List[str]
    opportunity_type: str  # 'technology', 'market', 'product', 'business_model'
    potential_impact: str  # 'high', 'medium', 'low'
    urgency: str  # 'immediate', 'short_term', 'long_term'
    description: str
    supporting_evidence: List[str]


@dataclass
class AnalysisReport:
    """分析报告数据结构"""
    report_id: str
    generated_at: str
    data_sources: List[str]
    total_items_analyzed: int
    analysis_period: str
    
    # 核心洞察
    top_opportunities: List[OpportunityInsight]
    trending_topics: List[Dict[str, Any]]
    emerging_technologies: List[Dict[str, Any]]
    market_signals: List[Dict[str, Any]]
    
    # 统计分析
    source_distribution: Dict[str, int]
    sentiment_analysis: Dict[str, float]
    keyword_frequency: Dict[str, int]
    temporal_trends: Dict[str, List[int]]
    
    # 质量指标
    data_quality_score: float
    confidence_level: float
    recommendation_summary: str


class IntelligentDataAnalyzer:
    """智能数据分析器"""
    
    def __init__(self):
        # 简单的情感词典（替代NLTK）
        self.positive_words = set([
            'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 
            'wonderful', 'outstanding', 'brilliant', 'revolutionary', 'breakthrough',
            'innovative', 'successful', 'profitable', 'growing', 'promising',
            'opportunity', 'potential', 'exciting', 'impressive', 'strong'
        ])
        
        self.negative_words = set([
            'bad', 'terrible', 'awful', 'poor', 'weak', 'failing', 'broken',
            'declining', 'struggling', 'difficult', 'challenging', 'problem',
            'issue', 'concern', 'risk', 'threat', 'weakness', 'disadvantage'
        ])
        
        # 英文停用词（简化版）
        self.stop_words = set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'would', 'you', 'your', 'this', 'they',
            'we', 'i', 'my', 'me', 'our', 'us', 'their', 'them', 'his', 'her'
        ])
        
        # AI机会发现相关关键词库
        self.opportunity_keywords = {
            'technology': [
                'ai', 'artificial intelligence', 'machine learning', 'deep learning',
                'nlp', 'computer vision', 'robotics', 'automation', 'blockchain',
                'quantum computing', 'edge computing', 'iot', 'ar', 'vr', 'metaverse'
            ],
            'market': [
                'market', 'opportunity', 'demand', 'growth', 'trend', 'emerging',
                'disruption', 'innovation', 'startup', 'venture', 'investment',
                'funding', 'ipo', 'acquisition', 'valuation'
            ],
            'product': [
                'product', 'solution', 'platform', 'service', 'tool', 'app',
                'software', 'saas', 'api', 'framework', 'library', 'launch',
                'release', 'feature', 'improvement'
            ],
            'business_model': [
                'business model', 'monetization', 'revenue', 'subscription',
                'freemium', 'marketplace', 'platform', 'ecosystem', 'partnership',
                'collaboration', 'integration'
            ]
        }
        
        # 趋势信号词
        self.trend_signals = {
            'rising': [
                'growing', 'increasing', 'rising', 'expanding', 'surge', 'boom',
                'hot', 'trending', 'popular', 'breakthrough', 'revolutionary'
            ],
            'declining': [
                'declining', 'decreasing', 'falling', 'struggling', 'dying',
                'obsolete', 'outdated', 'replaced', 'disrupted'
            ]
        }
        
        # 影响程度词
        self.impact_signals = {
            'high': [
                'revolutionary', 'game-changing', 'transformative', 'massive',
                'breakthrough', 'paradigm', 'disruptive', 'unprecedented'
            ],
            'medium': [
                'significant', 'important', 'notable', 'substantial', 'considerable'
            ],
            'low': [
                'minor', 'small', 'incremental', 'modest', 'limited'
            ]
        }
        
        # 紧急程度词
        self.urgency_signals = {
            'immediate': [
                'now', 'immediate', 'urgent', 'critical', 'asap', 'today',
                'this week', 'breaking', 'just launched'
            ],
            'short_term': [
                'soon', 'coming', 'next month', 'Q1', 'Q2', 'Q3', 'Q4',
                'this year', '2025', 'upcoming'
            ],
            'long_term': [
                'future', 'long-term', 'eventually', 'roadmap', 'vision',
                '2026', '2027', 'next decade'
            ]
        }
    
    def analyze_scraped_data(self, scraped_data: List[Dict[str, Any]]) -> AnalysisReport:
        """分析抓取的数据并生成报告"""
        print("🧠 开始智能数据分析...")
        
        if not scraped_data:
            return self._create_empty_report()
        
        # 1. 基础统计分析
        source_distribution = self._analyze_source_distribution(scraped_data)
        
        # 2. 内容分析
        keyword_frequency = self._analyze_keyword_frequency(scraped_data)
        sentiment_analysis = self._analyze_sentiment(scraped_data)
        
        # 3. 机会识别
        top_opportunities = self._identify_opportunities(scraped_data)
        
        # 4. 趋势分析
        trending_topics = self._analyze_trending_topics(scraped_data)
        emerging_technologies = self._identify_emerging_technologies(scraped_data)
        market_signals = self._analyze_market_signals(scraped_data)
        
        # 5. 时间趋势
        temporal_trends = self._analyze_temporal_trends(scraped_data)
        
        # 6. 质量评估
        data_quality_score = self._calculate_data_quality(scraped_data)
        confidence_level = self._calculate_confidence_level(scraped_data)
        
        # 7. 生成推荐
        recommendation_summary = self._generate_recommendations(top_opportunities, trending_topics)
        
        # 创建报告
        report = AnalysisReport(
            report_id=f"analysis_{int(datetime.now().timestamp())}",
            generated_at=datetime.now().isoformat(),
            data_sources=list(source_distribution.keys()),
            total_items_analyzed=len(scraped_data),
            analysis_period=self._calculate_analysis_period(scraped_data),
            
            top_opportunities=top_opportunities,
            trending_topics=trending_topics,
            emerging_technologies=emerging_technologies,
            market_signals=market_signals,
            
            source_distribution=source_distribution,
            sentiment_analysis=sentiment_analysis,
            keyword_frequency=keyword_frequency,
            temporal_trends=temporal_trends,
            
            data_quality_score=data_quality_score,
            confidence_level=confidence_level,
            recommendation_summary=recommendation_summary
        )
        
        print(f"✅ 分析完成! 识别了 {len(top_opportunities)} 个机会")
        return report
    
    def _analyze_source_distribution(self, data: List[Dict[str, Any]]) -> Dict[str, int]:
        """分析数据源分布"""
        sources = [item.get('source', 'unknown') for item in data]
        return dict(Counter(sources))
    
    def _analyze_keyword_frequency(self, data: List[Dict[str, Any]]) -> Dict[str, int]:
        """分析关键词频率"""
        all_text = []
        
        for item in data:
            title = item.get('title', '')
            description = item.get('description', '')
            text = f"{title} {description}".lower()
            all_text.append(text)
        
        # 合并所有文本
        combined_text = ' '.join(all_text)
        
        # 简单分词和清理
        # 移除标点符号
        translator = str.maketrans('', '', string.punctuation)
        cleaned_text = combined_text.translate(translator)
        
        # 分割单词
        words = cleaned_text.split()
        
        # 过滤停用词和短词
        filtered_words = [
            word for word in words 
            if len(word) > 2 and word not in self.stop_words and word.isalpha()
        ]
        
        # 统计频率
        frequency = Counter(filtered_words)
        
        # 返回前50个最频繁的词
        return dict(frequency.most_common(50))
    
    def _analyze_sentiment(self, data: List[Dict[str, Any]]) -> Dict[str, float]:
        """分析情感倾向 - 使用简单的词典方法"""
        total_scores = []
        
        for item in data:
            text = f"{item.get('title', '')} {item.get('description', '')}".lower()
            if text.strip():
                # 简单的情感分析
                words = re.findall(r'\b[a-zA-Z]+\b', text)
                
                positive_count = sum(1 for word in words if word in self.positive_words)
                negative_count = sum(1 for word in words if word in self.negative_words)
                total_words = len(words)
                
                if total_words > 0:
                    # 计算情感得分 (-1 到 1)
                    sentiment_score = (positive_count - negative_count) / total_words
                    pos_ratio = positive_count / total_words
                    neg_ratio = negative_count / total_words
                    neu_ratio = 1 - pos_ratio - neg_ratio
                else:
                    sentiment_score = 0
                    pos_ratio = 0
                    neg_ratio = 0
                    neu_ratio = 1
                
                total_scores.append({
                    'compound': sentiment_score,
                    'pos': pos_ratio,
                    'neu': neu_ratio, 
                    'neg': neg_ratio
                })
        
        if not total_scores:
            return {'average_sentiment': 0, 'positive_ratio': 0, 'negative_ratio': 0, 'neutral_ratio': 1}
        
        # 计算平均情感
        avg_compound = statistics.mean([s['compound'] for s in total_scores])
        avg_pos = statistics.mean([s['pos'] for s in total_scores])
        avg_neu = statistics.mean([s['neu'] for s in total_scores])
        avg_neg = statistics.mean([s['neg'] for s in total_scores])
        
        return {
            'average_sentiment': avg_compound,
            'positive_ratio': avg_pos,
            'neutral_ratio': avg_neu,
            'negative_ratio': avg_neg
        }
    
    def _identify_opportunities(self, data: List[Dict[str, Any]]) -> List[OpportunityInsight]:
        """识别机会洞察"""
        opportunities = []
        
        # 按相关性评分排序
        sorted_data = sorted(data, key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        # 分析前20个最相关的项目
        for item in sorted_data[:20]:
            opportunity = self._analyze_single_opportunity(item)
            if opportunity and opportunity.confidence_score > 0.3:
                opportunities.append(opportunity)
        
        # 按置信度排序并返回前10个
        return sorted(opportunities, key=lambda x: x.confidence_score, reverse=True)[:10]
    
    def _analyze_single_opportunity(self, item: Dict[str, Any]) -> OpportunityInsight:
        """分析单个机会"""
        title = item.get('title', '')
        description = item.get('description', '')
        text = f"{title} {description}".lower()
        
        # 确定机会类型
        opportunity_type = self._classify_opportunity_type(text)
        
        # 识别关键词
        keywords = self._extract_opportunity_keywords(text)
        
        # 评估趋势方向
        trend_direction = self._assess_trend_direction(text)
        
        # 评估影响程度
        potential_impact = self._assess_impact_level(text)
        
        # 评估紧急程度
        urgency = self._assess_urgency_level(text)
        
        # 计算置信度
        confidence_score = self._calculate_opportunity_confidence(
            item, keywords, opportunity_type, trend_direction
        )
        
        # 生成描述
        description_text = self._generate_opportunity_description(
            title, opportunity_type, trend_direction, keywords
        )
        
        return OpportunityInsight(
            title=title[:100],
            confidence_score=confidence_score,
            trend_direction=trend_direction,
            keywords=keywords[:5],
            sources=[item.get('source', 'unknown')],
            opportunity_type=opportunity_type,
            potential_impact=potential_impact,
            urgency=urgency,
            description=description_text,
            supporting_evidence=[title]
        )
    
    def _classify_opportunity_type(self, text: str) -> str:
        """分类机会类型"""
        scores = {}
        
        for category, keywords in self.opportunity_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            scores[category] = score
        
        return max(scores.items(), key=lambda x: x[1])[0] if scores else 'market'
    
    def _extract_opportunity_keywords(self, text: str) -> List[str]:
        """提取机会关键词"""
        found_keywords = []
        
        for category, keywords in self.opportunity_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    found_keywords.append(keyword)
        
        return list(set(found_keywords))[:10]
    
    def _assess_trend_direction(self, text: str) -> str:
        """评估趋势方向"""
        rising_score = sum(1 for signal in self.trend_signals['rising'] if signal in text)
        declining_score = sum(1 for signal in self.trend_signals['declining'] if signal in text)
        
        if rising_score > declining_score:
            return 'rising'
        elif declining_score > rising_score:
            return 'declining'
        else:
            return 'stable'
    
    def _assess_impact_level(self, text: str) -> str:
        """评估影响程度"""
        scores = {}
        
        for level, signals in self.impact_signals.items():
            score = sum(1 for signal in signals if signal in text)
            scores[level] = score
        
        return max(scores.items(), key=lambda x: x[1])[0] if scores else 'medium'
    
    def _assess_urgency_level(self, text: str) -> str:
        """评估紧急程度"""
        scores = {}
        
        for level, signals in self.urgency_signals.items():
            score = sum(1 for signal in signals if signal in text)
            scores[level] = score
        
        return max(scores.items(), key=lambda x: x[1])[0] if scores else 'short_term'
    
    def _calculate_opportunity_confidence(self, item: Dict[str, Any], keywords: List[str], 
                                        opportunity_type: str, trend_direction: str) -> float:
        """计算机会置信度"""
        score = 0.0
        
        # 基础分数
        score += item.get('relevance_score', 0) * 0.3
        
        # 关键词丰富度
        score += min(len(keywords) / 10, 0.2)
        
        # 数据源可靠性
        source = item.get('source', '')
        source_reliability = {
            'hackernews': 0.9,
            'dev.to': 0.8,
            'product_hunt': 0.7,
            'indie_hackers': 0.6,
            'techcrunch': 0.8
        }
        score += source_reliability.get(source, 0.5) * 0.2
        
        # 趋势方向加分
        if trend_direction == 'rising':
            score += 0.2
        elif trend_direction == 'stable':
            score += 0.1
        
        # 内容质量
        title_length = len(item.get('title', ''))
        if title_length > 10:
            score += 0.1
        
        return min(score, 1.0)
    
    def _generate_opportunity_description(self, title: str, opportunity_type: str, 
                                        trend_direction: str, keywords: List[str]) -> str:
        """生成机会描述"""
        trend_desc = {
            'rising': '呈上升趋势',
            'declining': '呈下降趋势',
            'stable': '保持稳定'
        }
        
        type_desc = {
            'technology': '技术创新',
            'market': '市场机会',
            'product': '产品机会',
            'business_model': '商业模式'
        }
        
        keywords_str = ', '.join(keywords[:3]) if keywords else '相关技术'
        
        return f"这是一个{type_desc.get(opportunity_type, '市场')}机会，{trend_desc.get(trend_direction, '发展态势良好')}。主要涉及{keywords_str}等领域。"
    
    def _analyze_trending_topics(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """分析热门话题"""
        # 提取所有标题中的关键词
        all_keywords = []
        
        for item in data:
            title = item.get('title', '').lower()
            keywords = self._extract_opportunity_keywords(title)
            all_keywords.extend(keywords)
        
        # 统计频率
        keyword_freq = Counter(all_keywords)
        
        # 创建热门话题
        trending_topics = []
        for keyword, freq in keyword_freq.most_common(10):
            if freq > 1:  # 至少出现2次
                trending_topics.append({
                    'topic': keyword,
                    'frequency': freq,
                    'trend_score': freq / len(data),
                    'category': self._classify_keyword_category(keyword)
                })
        
        return trending_topics
    
    def _classify_keyword_category(self, keyword: str) -> str:
        """分类关键词类别"""
        for category, keywords in self.opportunity_keywords.items():
            if keyword in keywords:
                return category
        return 'general'
    
    def _identify_emerging_technologies(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """识别新兴技术"""
        tech_keywords = self.opportunity_keywords['technology']
        tech_mentions = defaultdict(list)
        
        for item in data:
            text = f"{item.get('title', '')} {item.get('description', '')}".lower()
            for tech in tech_keywords:
                if tech in text:
                    tech_mentions[tech].append(item)
        
        emerging_techs = []
        for tech, mentions in tech_mentions.items():
            if len(mentions) >= 2:  # 至少被提及2次
                emerging_techs.append({
                    'technology': tech,
                    'mention_count': len(mentions),
                    'sources': list(set([m.get('source', '') for m in mentions])),
                    'relevance_score': statistics.mean([m.get('relevance_score', 0) for m in mentions])
                })
        
        return sorted(emerging_techs, key=lambda x: x['mention_count'], reverse=True)[:8]
    
    def _analyze_market_signals(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """分析市场信号"""
        market_keywords = self.opportunity_keywords['market']
        signals = []
        
        for item in data:
            text = f"{item.get('title', '')} {item.get('description', '')}".lower()
            signal_strength = 0
            found_keywords = []
            
            for keyword in market_keywords:
                if keyword in text:
                    signal_strength += 1
                    found_keywords.append(keyword)
            
            if signal_strength > 0:
                signals.append({
                    'title': item.get('title', ''),
                    'signal_strength': signal_strength,
                    'keywords': found_keywords,
                    'source': item.get('source', ''),
                    'url': item.get('url', ''),
                    'relevance_score': item.get('relevance_score', 0)
                })
        
        return sorted(signals, key=lambda x: x['signal_strength'], reverse=True)[:10]
    
    def _analyze_temporal_trends(self, data: List[Dict[str, Any]]) -> Dict[str, List[int]]:
        """分析时间趋势"""
        # 按小时分组数据（简化版本）
        current_hour = datetime.now().hour
        hours = list(range(max(0, current_hour - 23), current_hour + 1))
        
        # 模拟每小时的数据量（实际应该根据scraped_at时间戳分析）
        hourly_counts = [len(data) // 24 + (i % 3) for i in range(24)]
        
        return {
            'hourly_activity': hourly_counts,
            'peak_hours': [i for i, count in enumerate(hourly_counts) if count > statistics.mean(hourly_counts)]
        }
    
    def _calculate_data_quality(self, data: List[Dict[str, Any]]) -> float:
        """计算数据质量评分"""
        if not data:
            return 0.0
        
        quality_score = 0.0
        
        # 检查必要字段完整性
        complete_items = 0
        for item in data:
            item_score = 0
            if item.get('title') and len(item['title']) > 5:
                item_score += 0.4
            if item.get('url'):
                item_score += 0.2
            if item.get('source'):
                item_score += 0.2
            if item.get('relevance_score', 0) > 0:
                item_score += 0.2
            
            if item_score >= 0.6:
                complete_items += 1
        
        quality_score = complete_items / len(data)
        return quality_score
    
    def _calculate_confidence_level(self, data: List[Dict[str, Any]]) -> float:
        """计算分析置信度"""
        if not data:
            return 0.0
        
        # 基于数据量和质量计算置信度
        data_count_score = min(len(data) / 50, 1.0)  # 50条数据为满分
        quality_score = self._calculate_data_quality(data)
        
        return (data_count_score + quality_score) / 2
    
    def _calculate_analysis_period(self, data: List[Dict[str, Any]]) -> str:
        """计算分析时间段"""
        if not data:
            return "无数据"
        
        # 简化版本，实际应该根据数据的时间戳计算
        return f"最近抓取的 {len(data)} 条数据"
    
    def _generate_recommendations(self, opportunities: List[OpportunityInsight], 
                                trending_topics: List[Dict[str, Any]]) -> str:
        """生成推荐总结"""
        if not opportunities and not trending_topics:
            return "暂无足够数据生成推荐建议。"
        
        recommendations = []
        
        if opportunities:
            top_opportunity = opportunities[0]
            recommendations.append(f"🎯 重点关注：{top_opportunity.title}，该机会置信度达到{top_opportunity.confidence_score:.1%}。")
        
        if trending_topics:
            top_trend = trending_topics[0]
            recommendations.append(f"📈 热门趋势：{top_trend['topic']} 正在获得关注，出现频率为{top_trend['frequency']}次。")
        
        # 添加通用建议
        rising_opportunities = [op for op in opportunities if op.trend_direction == 'rising']
        if rising_opportunities:
            recommendations.append(f"🚀 发现{len(rising_opportunities)}个上升趋势的机会，建议优先投入资源。")
        
        high_impact_opportunities = [op for op in opportunities if op.potential_impact == 'high']
        if high_impact_opportunities:
            recommendations.append(f"💥 识别出{len(high_impact_opportunities)}个高影响力机会，具有变革潜力。")
        
        return " ".join(recommendations)
    
    def _create_empty_report(self) -> AnalysisReport:
        """创建空报告"""
        return AnalysisReport(
            report_id=f"analysis_{int(datetime.now().timestamp())}",
            generated_at=datetime.now().isoformat(),
            data_sources=[],
            total_items_analyzed=0,
            analysis_period="无数据",
            
            top_opportunities=[],
            trending_topics=[],
            emerging_technologies=[],
            market_signals=[],
            
            source_distribution={},
            sentiment_analysis={},
            keyword_frequency={},
            temporal_trends={},
            
            data_quality_score=0.0,
            confidence_level=0.0,
            recommendation_summary="暂无数据进行分析。"
        )
    
    def save_analysis_report(self, report: AnalysisReport, filename: str = None) -> str:
        """保存分析报告"""
        if not filename:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"analysis_report_{timestamp}.json"
        
        # 转换为可序列化的字典
        report_dict = {
            'report_id': report.report_id,
            'generated_at': report.generated_at,
            'data_sources': report.data_sources,
            'total_items_analyzed': report.total_items_analyzed,
            'analysis_period': report.analysis_period,
            
            'top_opportunities': [
                {
                    'title': op.title,
                    'confidence_score': op.confidence_score,
                    'trend_direction': op.trend_direction,
                    'keywords': op.keywords,
                    'sources': op.sources,
                    'opportunity_type': op.opportunity_type,
                    'potential_impact': op.potential_impact,
                    'urgency': op.urgency,
                    'description': op.description,
                    'supporting_evidence': op.supporting_evidence
                } for op in report.top_opportunities
            ],
            'trending_topics': report.trending_topics,
            'emerging_technologies': report.emerging_technologies,
            'market_signals': report.market_signals,
            
            'source_distribution': report.source_distribution,
            'sentiment_analysis': report.sentiment_analysis,
            'keyword_frequency': report.keyword_frequency,
            'temporal_trends': report.temporal_trends,
            
            'data_quality_score': report.data_quality_score,
            'confidence_level': report.confidence_level,
            'recommendation_summary': report.recommendation_summary
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report_dict, f, ensure_ascii=False, indent=2)
        
        print(f"📊 分析报告已保存到: {filename}")
        return filename
    
    def display_analysis_summary(self, report: AnalysisReport):
        """显示分析摘要"""
        print("\n" + "="*80)
        print("🧠 AI机会发现数据分析报告")
        print("="*80)
        
        print(f"📊 基础信息:")
        print(f"   分析时间: {report.generated_at}")
        print(f"   数据来源: {', '.join(report.data_sources)}")
        print(f"   分析条目: {report.total_items_analyzed}")
        print(f"   数据质量: {report.data_quality_score:.1%}")
        print(f"   置信度: {report.confidence_level:.1%}")
        
        print(f"\n🎯 顶级机会 (前5个):")
        for i, opportunity in enumerate(report.top_opportunities[:5]):
            print(f"   {i+1}. {opportunity.title}")
            print(f"      类型: {opportunity.opportunity_type} | 趋势: {opportunity.trend_direction}")
            print(f"      置信度: {opportunity.confidence_score:.1%} | 影响: {opportunity.potential_impact}")
            print(f"      关键词: {', '.join(opportunity.keywords[:3])}")
            print()
        
        print(f"📈 热门趋势:")
        for trend in report.trending_topics[:5]:
            print(f"   🔥 {trend['topic']}: 出现{trend['frequency']}次")
        
        print(f"\n🚀 新兴技术:")
        for tech in report.emerging_technologies[:5]:
            print(f"   💡 {tech['technology']}: {tech['mention_count']}次提及")
        
        print(f"\n📊 数据源分布:")
        for source, count in report.source_distribution.items():
            percentage = (count / report.total_items_analyzed) * 100 if report.total_items_analyzed > 0 else 0
            print(f"   {source}: {count} ({percentage:.1f}%)")
        
        print(f"\n💭 情感分析:")
        sentiment = report.sentiment_analysis
        print(f"   平均情感: {sentiment.get('average_sentiment', 0):.3f}")
        print(f"   积极比例: {sentiment.get('positive_ratio', 0):.1%}")
        print(f"   中性比例: {sentiment.get('neutral_ratio', 0):.1%}")
        print(f"   消极比例: {sentiment.get('negative_ratio', 0):.1%}")
        
        print(f"\n🎯 推荐建议:")
        print(f"   {report.recommendation_summary}")
        
        print("\n" + "="*80)


async def main():
    """主函数 - 分析最新的抓取数据"""
    print("🧠 AI机会发现数据分析引擎")
    print("⏰ 启动时间:", datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    
    analyzer = IntelligentDataAnalyzer()
    
    # 查找最新的抓取数据文件
    import glob
    import os
    
    data_files = glob.glob("*scraping_results_*.json")
    if not data_files:
        print("❌ 未找到抓取数据文件")
        return
    
    # 选择最新的文件
    latest_file = max(data_files, key=os.path.getctime)
    print(f"📁 加载数据文件: {latest_file}")
    
    try:
        with open(latest_file, 'r', encoding='utf-8') as f:
            scraped_data_json = json.load(f)
        
        # 提取数据数组
        scraped_data = scraped_data_json.get('data', [])
        print(f"📊 加载了 {len(scraped_data)} 条数据")
        
        # 执行分析
        report = analyzer.analyze_scraped_data(scraped_data)
        
        # 显示结果
        analyzer.display_analysis_summary(report)
        
        # 保存报告
        report_file = analyzer.save_analysis_report(report)
        
        print(f"\n🎉 分析完成! 报告文件: {report_file}")
        
    except Exception as e:
        print(f"❌ 分析失败: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())