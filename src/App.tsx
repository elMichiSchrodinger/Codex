import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ServiceCatalog } from './components/Services/ServiceCatalog';
import { SLAManagement } from './components/SLA/SLAManagement';
import { IncidentsRequests } from './components/Incidents/IncidentsRequests';
import { Audits } from './components/Audits/Audits';
import { NonConformities } from './components/NonConformities/NonConformities';
import { Reports } from './components/Reports/Reports';
import { Risks } from './components/Risks/Risks';
import { Assets } from './components/Assets/Assets';
import { Problems } from './components/Problems/Problems';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <ServiceCatalog />;
      case 'slas':
        return <SLAManagement />;
      case 'incidents':
        return <IncidentsRequests />;
      case 'audits':
        return <Audits />;
      case 'nonconformities':
        return <NonConformities />;
      case 'reports':
        return <Reports />;
      case 'risks':
        return <Risks />;
      case 'assets':
        return <Assets />;
      case 'problems':
        return <Problems />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;