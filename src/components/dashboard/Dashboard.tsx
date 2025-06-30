import React from 'react';
import QuickLaunch from './QuickLaunch';
import ReferralStats from './ReferralStats';
import { useTheme } from '../../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  
  // Dummy user data
  const userData = {
    name: "John Doe",
    referralCode: "ARKHAM2024",
    totalEarnings: 250.50,
    referrals: [
      { id: 1, name: "Alice Smith", date: "2024-03-15", earnings: 50, products: ["AI App Builder", "Sound Manager"] },
      { id: 2, name: "Bob Johnson", date: "2024-03-14", earnings: 75, products: ["AI Research", "EdTech"] },
      { id: 3, name: "Carol White", date: "2024-03-13", earnings: 125.50, products: ["K-Protocol", "Freelancer"] }
    ]
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Welcome, {userData.name}</h1>
          <p className="text-gray-400">Access your tools and track your referrals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuickLaunch />
          </div>
          
          <div className="lg:col-span-1">
            <ReferralStats userData={userData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;