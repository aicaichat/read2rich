import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, TrendingUp, DollarSign, Clock, Target, BarChart3 } from 'lucide-react';
import { api, Opportunity, Category } from '../lib/api';

const OpportunitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [opportunitiesData, categoriesData] = await Promise.all([
          api.getOpportunities({ category: selectedCategory }),
          api.getCategories()
        ]);
        
        setOpportunities(opportunitiesData);
        setCategories(categoriesData.categories);
        setError(null);
      } catch (err) {
        setError(t('common.error'));
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Reload opportunities when category changes
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const opportunitiesData = await api.getOpportunities({ 
          category: selectedCategory 
        });
        setOpportunities(opportunitiesData);
      } catch (err) {
        setError(t('common.error'));
        console.error('Error loading opportunities:', err);
      }
    };

    if (categories.length > 0) {
      loadOpportunities();
    }
  }, [selectedCategory, categories.length]);

  // Filter opportunities by search term
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = !searchTerm || 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMarketSize = (size?: number) => {
    if (!size) return 'N/A';
    if (size >= 1000000) {
      return `$${(size / 1000000).toFixed(1)}M`;
    }
    if (size >= 1000) {
      return `$${(size / 1000).toFixed(1)}K`;
    }
    return `$${size}`;
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-dark-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl">{t('common.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-dark-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-400 text-xl">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-dark-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('opportunities.title')}
          </h1>
          <p className="text-xl text-white/70">
            {t('opportunities.subtitle')}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-6 rounded-xl">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-primary-500 text-dark-300'
                      : 'bg-dark-100 hover:bg-dark-50 text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder={t('opportunities.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input min-w-[300px]"
              />
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="card hover:border-primary-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-500 text-sm rounded-full">
                  {opportunity.category}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {opportunity.title}
              </h3>
              
              <p className="text-white/70 mb-4 line-clamp-3">
                {opportunity.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Market Size
                  </span>
                  <span className="text-white font-medium">
                    {formatMarketSize(opportunity.market_size)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Investment
                  </span>
                  <span className="text-white font-medium">
                    {formatCurrency(opportunity.investment_required)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Time to Market
                  </span>
                  <span className="text-white font-medium">
                    {opportunity.time_to_market || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Difficulty
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full mr-1 ${
                          i < opportunity.difficulty_level
                            ? 'bg-primary-500'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 btn-primary py-2 px-4">
                  {t('opportunities.actions.view_details')}
                </button>
                <button className="flex-1 btn-secondary py-2 px-4">
                  {t('opportunities.actions.analyze')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/60 text-lg mb-4">
              No opportunities found matching your criteria.
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesPage;