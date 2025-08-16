// Mock API client for Read2Rich
export interface Opportunity {
  id: number;
  title: string;
  description: string;
  category: string;
  market_size?: number;
  difficulty_level: number;
  investment_required?: number;
  time_to_market?: string;
  source_url?: string;
  created_at: string;
}

export interface Category {
  key: string;
  label: string;
}

// Mock data
const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "AI-Powered Personal Finance Assistant",
    description: "A mobile app that uses AI to analyze spending patterns and provide personalized financial advice. With the growing interest in personal finance management, this could capture a significant market share.",
    category: "fintech",
    market_size: 50000000,
    difficulty_level: 3,
    investment_required: 150000,
    time_to_market: "8-12 months",
    source_url: "https://example.com/opportunity/1",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Sustainable Packaging Marketplace",
    description: "An online marketplace connecting businesses with sustainable packaging suppliers. As environmental consciousness grows, this addresses a real need in the market.",
    category: "ecommerce",
    market_size: 25000000,
    difficulty_level: 2,
    investment_required: 75000,
    time_to_market: "4-6 months",
    source_url: "https://example.com/opportunity/2",
    created_at: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    title: "Remote Team Collaboration Platform",
    description: "A specialized platform for remote teams with features like virtual workspaces, async communication, and productivity tracking. The remote work trend continues to grow.",
    category: "saas",
    market_size: 80000000,
    difficulty_level: 4,
    investment_required: 300000,
    time_to_market: "12-18 months",
    source_url: "https://example.com/opportunity/3",
    created_at: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Local Service Booking App",
    description: "A mobile app for booking local services like cleaning, repairs, and maintenance. Focus on small towns and suburban areas underserved by existing platforms.",
    category: "marketplace",
    market_size: 35000000,
    difficulty_level: 2,
    investment_required: 100000,
    time_to_market: "6-9 months",
    source_url: "https://example.com/opportunity/4",
    created_at: "2024-01-12T16:45:00Z"
  },
  {
    id: 5,
    title: "AI-Driven Health Monitoring Wearable",
    description: "A wearable device that uses advanced AI to predict health issues before they become serious. Targets the growing health-conscious consumer market.",
    category: "healthtech",
    market_size: 120000000,
    difficulty_level: 5,
    investment_required: 500000,
    time_to_market: "18-24 months",
    source_url: "https://example.com/opportunity/5",
    created_at: "2024-01-11T11:30:00Z"
  },
  {
    id: 6,
    title: "Micro-Learning Platform for Professionals",
    description: "A platform delivering bite-sized learning content for busy professionals. Content is tailored to specific industries and job roles.",
    category: "edtech",
    market_size: 45000000,
    difficulty_level: 3,
    investment_required: 200000,
    time_to_market: "8-12 months",
    source_url: "https://example.com/opportunity/6",
    created_at: "2024-01-10T13:20:00Z"
  }
];

const MOCK_CATEGORIES: Category[] = [
  { key: "all", label: "All Categories" },
  { key: "saas", label: "SaaS" },
  { key: "ecommerce", label: "E-commerce" },
  { key: "fintech", label: "FinTech" },
  { key: "healthtech", label: "HealthTech" },
  { key: "edtech", label: "EdTech" },
  { key: "marketplace", label: "Marketplace" },
  { key: "ai", label: "AI/ML" },
  { key: "blockchain", label: "Blockchain" },
  { key: "iot", label: "IoT" },
  { key: "mobile", label: "Mobile App" }
];

// API functions
export const api = {
  async getOpportunities(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    language?: string;
  }): Promise<Opportunity[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let opportunities = MOCK_OPPORTUNITIES.slice();
    
    // Filter by category
    if (params?.category && params.category !== "all") {
      opportunities = opportunities.filter(opp => opp.category === params.category);
    }
    
    // Apply pagination
    const skip = params?.skip || 0;
    const limit = params?.limit || 100;
    opportunities = opportunities.slice(skip, skip + limit);
    
    return opportunities;
  },

  async getCategories(): Promise<{ categories: Category[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { categories: MOCK_CATEGORIES };
  },

  async getOpportunity(id: number): Promise<Opportunity> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const opportunity = MOCK_OPPORTUNITIES.find(opp => opp.id === id);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }
    
    return opportunity;
  },

  async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: 1,
      email: userData.email,
      username: userData.username,
      full_name: userData.full_name,
      is_active: true,
      is_superuser: false,
      created_at: new Date().toISOString()
    };
  },

  async login(credentials: { email: string; password: string }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      access_token: "mock_jwt_token_12345",
      token_type: "bearer"
    };
  },

  async getCurrentUser() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      id: 1,
      email: "user@read2rich.com",
      username: "testuser",
      full_name: "Test User",
      is_active: true,
      is_superuser: false,
      created_at: new Date().toISOString()
    };
  }
};
