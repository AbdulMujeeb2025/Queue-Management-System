import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  FileText, 
  Globe, 
  AlertTriangle,
  Users, 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import api from '../../services/api';

const counterPurposes = [
  { id: 1, name: 'Counter 1', purpose: 'FIR', icon: FileText, color: 'from-red-500 to-red-600', currentNumber: 'FIR-005' },
  { id: 2, name: 'Counter 2', purpose: 'ID Creation', icon: Shield, color: 'from-blue-500 to-blue-600', currentNumber: 'ID-012' },
  { id: 3, name: 'Counter 3', purpose: 'Passport', icon: Globe, color: 'from-green-500 to-green-600', currentNumber: 'PS-008' },
  { id: 4, name: 'Counter 4', purpose: 'Complaint', icon: AlertTriangle, color: 'from-orange-500 to-orange-600', currentNumber: 'CMP-003' },
];

const Counters = () => {
  const [counters, setCounters] = useState(counterPurposes);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Simulate real-time counter updates (replace with real API later)
  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => prev.map(counter => ({
        ...counter,
        currentNumber: getNextNumber(counter.currentNumber)
      })));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getNextNumber = (currentNumber) => {
    const match = currentNumber.match(/(\\d+)$/);
    if (match) {
      const num = parseInt(match[1]) + 1;
      return currentNumber.replace(/\\d+$/, num.toString().padStart(3, '0'));
    }
    return currentNumber;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Users size={24} />
            Queue Management
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard" 
              className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
            >
              Generate Token
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-xl font-semibold transition-all shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - Padding kam ki */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section - Margin kam ki */}
        <div className="text-center mb-8">
          <ArrowLeft className="mx-auto h-8 w-8 text-gray-400 mb-3 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => navigate('/dashboard')} />
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Live Counters Status
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Check which counter is currently serving which number.
          </p>
        </div>

        {/* Counters Grid - Gap kam ki */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((counter) => {
            const Icon = counter.icon;
            return (
              <div 
                key={counter.id}
                className="group bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-blue-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${counter.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {counter.name}
                  </div>
                </div>

                {/* Purpose - Size kam ki */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Purpose</p>
                  <p className="text-base font-bold text-gray-900">{counter.purpose}</p>
                </div>

                {/* Current Number - Size kam ki */}
                <div className="text-center py-3">
                  <div className="inline-flex items-center gap-2 mb-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg">
                    <div className="text-2xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent tracking-widest">
                      {counter.currentNumber}
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Currently Serving</p>
                </div>

                {/* Status Badge - Size kam ki */}
                <div className={`text-center p-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-md ${
                  Math.random() > 0.5 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {Math.random() > 0.5 ? 'Next Number Loading...' : 'Serving Now'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Counters;
