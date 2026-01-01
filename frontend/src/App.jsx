import React, { useState } from 'react';
import Layout from './components/Layout';
import DashboardPage from './components/DashboardPage';
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';
import ReportPage from './components/ReportPage';
import Dpdp from './components/Dpdp';


function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportData, setReportData] = useState(null);

  const handleAnalysisStart = (data) => {
    // Data is already transformed by the caller or helper
    setReportData(data);
    setActiveTab('results'); // Navigate directly to Report Page as requested
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveTab} />;
      case 'upload':
        return <UploadPage onAnalyze={handleAnalysisStart} />;
      case 'results':
        return <ResultsPage data={reportData} />;
      case 'report':
        return <ReportPage data={reportData} />;
      case 'dpdp':
        return <Dpdp />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
