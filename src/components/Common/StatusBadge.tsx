import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'priority' | 'result';
}

export function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    if (type === 'priority') {
      switch (status.toLowerCase()) {
        case 'critical': return `${baseClasses} bg-red-100 text-red-800`;
        case 'high': return `${baseClasses} bg-orange-100 text-orange-800`;
        case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'low': return `${baseClasses} bg-green-100 text-green-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }

    if (type === 'result') {
      switch (status.toLowerCase()) {
        case 'passed': return `${baseClasses} bg-green-100 text-green-800`;
        case 'failed': return `${baseClasses} bg-red-100 text-red-800`;
        case 'partial': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
      }
    }

    // Default status colors
    switch (status.toLowerCase()) {
      case 'active':
      case 'healthy':
      case 'completed':
      case 'resolved':
      case 'closed':
      case 'mitigated':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'warning':
      case 'in-progress':
      case 'investigating':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'critical':
      case 'failed':
      case 'open':
      case 'identified':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'inactive':
      case 'maintenance':
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <span className={getStatusStyles()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}