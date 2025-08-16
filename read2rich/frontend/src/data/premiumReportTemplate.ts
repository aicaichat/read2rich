// 付费版报告结构模板
export interface PremiumReport {
  projectId: string;
  title: string;
  executiveSummary: ExecutiveSummary;
  marketAnalysis: MarketAnalysis;
  technicalImplementation: TechnicalImplementation;
  businessModel: BusinessModel;
  codeTemplates: CodeTemplates;
  quickStartKit: QuickStartKit;
  riskAssessment: RiskAssessment;
  appendices: Appendices;
}

export interface ExecutiveSummary {
  projectOverview: string;
  keyOpportunity: string;
  marketSize: string;
  revenueProjection: string;
  timeToMarket: string;
  investmentRequired: string;
  expectedROI: string;
  keySuccessFactors: string[];
}

export interface MarketAnalysis {
  marketSize: {
    tam: string; // Total Addressable Market
    sam: string; // Serviceable Addressable Market  
    som: string; // Serviceable Obtainable Market
  };
  marketTrends: string[];
  targetAudience: {
    primarySegment: string;
    secondarySegment: string;
    userPersonas: UserPersona[];
  };
  competitorAnalysis: Competitor[];
  marketValidation: {
    surveyData: string;
    expertInterviews: string;
    pilotResults: string;
  };
}

export interface UserPersona {
  name: string;
  demographics: string;
  painPoints: string[];
  motivations: string[];
  behavior: string;
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
  pricing: string;
  differentiation: string;
}

export interface TechnicalImplementation {
  architecture: {
    overview: string;
    components: TechComponent[];
    dataFlow: string;
  };
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    aiML: string[];
    deployment: string[];
  };
  coreAlgorithms: Algorithm[];
  scalingStrategy: string;
  securityConsiderations: string[];
  developmentRoadmap: Milestone[];
}

export interface TechComponent {
  name: string;
  description: string;
  technology: string;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface Algorithm {
  name: string;
  purpose: string;
  implementation: string;
  alternatives: string[];
}

export interface Milestone {
  phase: string;
  duration: string;
  deliverables: string[];
  resources: string;
}

export interface BusinessModel {
  revenueStreams: RevenueStream[];
  pricingStrategy: PricingStrategy;
  customerAcquisition: CustomerAcquisition;
  financialProjections: FinancialProjections;
  fundingStrategy: FundingStrategy;
}

export interface RevenueStream {
  type: string;
  description: string;
  potential: string;
  timeline: string;
}

export interface PricingStrategy {
  model: string;
  tiers: PricingTier[];
  rationale: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  targetSegment: string;
}

export interface CustomerAcquisition {
  channels: AcquisitionChannel[];
  cac: string; // Customer Acquisition Cost
  ltv: string; // Lifetime Value
  paybackPeriod: string;
}

export interface AcquisitionChannel {
  channel: string;
  cost: string;
  effectiveness: string;
  timeline: string;
}

export interface FinancialProjections {
  year1: FinancialMetrics;
  year2: FinancialMetrics;
  year3: FinancialMetrics;
  assumptions: string[];
}

export interface FinancialMetrics {
  revenue: string;
  expenses: string;
  profit: string;
  users: string;
}

export interface FundingStrategy {
  stages: FundingStage[];
  totalRequired: string;
  useOfFunds: string[];
}

export interface FundingStage {
  stage: string;
  amount: string;
  timeline: string;
  purpose: string;
}

export interface CodeTemplates {
  mvpFramework: CodeTemplate;
  coreFeatures: CodeTemplate[];
  apiDesign: CodeTemplate;
  databaseSchema: CodeTemplate;
  deploymentScripts: CodeTemplate;
}

export interface CodeTemplate {
  name: string;
  description: string;
  language: string;
  code: string;
  dependencies: string[];
  setup: string[];
}

export interface QuickStartKit {
  setupGuide: string;
  configFiles: ConfigFile[];
  sampleData: string;
  testingFramework: string;
  deploymentGuide: string;
  troubleshooting: string;
}

export interface ConfigFile {
  filename: string;
  purpose: string;
  content: string;
}

export interface RiskAssessment {
  technicalRisks: Risk[];
  marketRisks: Risk[];
  operationalRisks: Risk[];
  mitigationStrategies: MitigationStrategy[];
}

export interface Risk {
  risk: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface MitigationStrategy {
  risk: string;
  strategy: string;
  timeline: string;
  resources: string;
}

export interface Appendices {
  marketResearch: string;
  technicalSpecs: string;
  legalConsiderations: string;
  additionalResources: Resource[];
}

export interface Resource {
  type: string;
  title: string;
  description: string;
  url?: string;
}