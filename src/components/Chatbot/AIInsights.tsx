import React, { useState } from 'react';
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { openaiService } from '../../services/openai';

interface AIInsightsProps {
  data: any;
  type: 'incident' | 'risk' | 'general';
}

export function AIInsights({ data, type }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const generateInsights = async () => {
    setIsLoading(true);
    setIsVisible(true);
    
    try {
      let result = '';
      
      if (type === 'incident') {
        result = await openaiService.generateIncidentSummary(data);
      } else if (type === 'risk') {
        result = await openaiService.suggestRiskMitigation(data);
      }
      
      setInsights(result);
    } catch (error) {
      setInsights('Unable to generate AI insights at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'incident':
        return <AlertTriangle className="w-4 h-4" />;
      case 'risk':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'incident':
        return 'AI Incident Analysis';
      case 'risk':
        return 'AI Risk Mitigation';
      default:
        return 'AI Insights';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h4 className="font-medium text-gray-900">{getTitle()}</h4>
        </div>
        {!isVisible && (
          <button
            onClick={generateInsights}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            <span>Get AI Insights</span>
          </button>
        )}
      </div>
      
      {isVisible && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm">Analyzing with AI...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-3 border border-purple-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{insights}</p>
            </div>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs text-purple-600 hover:text-purple-800 transition-colors"
          >
            Hide insights
          </button>
        </div>
      )}
    </div>
  );
}