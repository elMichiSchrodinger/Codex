import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  BookOpen,
  Shield,
  AlertTriangle,
  Search,
  FileText,
  TrendingUp,
  Wrench,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'services', label: 'Service Catalog', icon: BookOpen },
    { id: 'slas', label: 'SLA Management', icon: Shield },
    { id: 'incidents', label: 'Incidents & Requests', icon: AlertTriangle },
    { id: 'audits', label: 'Audits', icon: Search },
    { id: 'nonconformities', label: 'Non-Conformities', icon: FileText },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
    { id: 'risks', label: 'Risks', icon: TrendingUp },
    { id: 'assets', label: 'Assets', icon: Wrench },
    { id: 'problems', label: 'Problems', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ITSM Portal</h1>
            <p className="text-sm text-slate-400">Service Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}