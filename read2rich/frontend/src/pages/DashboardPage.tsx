import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Clock, 
  BarChart3, 
  Star,
  BookOpen,
  Users,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, Opportunity } from '../lib/api';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [recentOpportunities, setRecentOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [userData, opportunitiesData] = await Promise.all([
          api.getCurrentUser(),
          api.getOpportunities({ limit: 3 })
        ]);
        
        setUser(userData);
        setRecentOpportunities(opportunitiesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = [
    {
      name: 'Opportunities Viewed',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: BookOpen
    },
    {
      name: 'Saved Opportunities',
      value: '8',
      change: '+3',
      changeType: 'positive' as const,
      icon: Star
    },
    {
      name: 'Analysis Reports',
      value: '5',
      change: '+2',
      changeType: 'positive' as const,
      icon: BarChart3
    },
    {
      name: 'Network Connections',
      value: '42',
      change: '+8',
      changeType: 'positive' as const,
      icon: Users
    }
  ];

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.full_name || user?.username || 'User'}!
          </h1>
          <p className="text-white/70 mt-2">
            Here's what's happening with your opportunity discovery journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="w-8 h-8 text-primary-500" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white/70">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-primary-500' : 'text-red-400'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Opportunities */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Opportunities</h2>
                <Link 
                  to="/opportunities" 
                  className="text-primary-500 hover:text-primary-400 text-sm font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-2">
                          {opportunity.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">
                          {opportunity.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {opportunity.investment_required ? 
                              `$${(opportunity.investment_required / 1000).toFixed(0)}K` : 
                              'N/A'
                            }
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {opportunity.time_to_market || 'N/A'}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            Level {opportunity.difficulty_level}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-2 py-1 bg-primary-500/20 text-primary-500 text-xs rounded-full">
                          {opportunity.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Progress */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  to="/opportunities" 
                  className="block w-full btn-primary text-center py-3"
                >
                  Discover Opportunities
                </Link>
                <button className="block w-full btn-secondary py-3">
                  Generate Report
                </button>
                <button className="block w-full btn-ghost py-3">
                  View Analytics
                </button>
              </div>
            </div>

            {/* Progress */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">Your Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Profile Completion</span>
                    <span className="text-white">75%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Opportunities Analyzed</span>
                    <span className="text-white">5/10</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Learning Modules</span>
                    <span className="text-white">3/8</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '37.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Today's Insights</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70 text-sm">
                    FinTech opportunities are trending 23% higher this week
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70 text-sm">
                    3 new opportunities match your investment criteria
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-white/70 text-sm">
                    Your portfolio diversity score improved to 8.5/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;