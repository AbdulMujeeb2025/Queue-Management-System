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
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Users size={32} />
            Queue Management
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Generate Token
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <ArrowLeft className="mx-auto h-12 w-12 text-gray-400 mb-6 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => navigate('/dashboard')} />
          <h1 className="text-5xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
            Live Counters Status
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check which counter is currently serving which number. Your turn is next!
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {counters.map((counter) => {
            const Icon = counter.icon;
            return (
              <div 
                key={counter.id}
                className="group bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/50 hover:border-blue-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${counter.color} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {counter.name}
                  </div>
                </div>

                {/* Purpose */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Purpose</p>
                  <p className="text-xl font-bold text-gray-900">{counter.purpose}</p>
                </div>

                {/* Current Number - Large & Prominent */}
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 mb-4 px-8 py-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-200 shadow-xl">
                    <div className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent tracking-widest">
                      {counter.currentNumber}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-700 uppercase tracking-wide">Currently Serving</p>
                </div>

                {/* Status Badge */}
                <div className={`text-center p-3 rounded-xl font-bold text-sm uppercase tracking-wide shadow-md ${
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

        {/* Legend */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">How to Read Counter Status</h3>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-black text-blue-600 mb-2">ID-012</div>
              <p>Your token number</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-black text-green-600 mb-2">FIR-008</div>
              <p>Counter showing this number = your turn!</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-3xl font-black text-orange-600 mb-2">FIR-005</div>
              <p>Counter showing lower = wait please</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold mb-2 inline-block">Proceed ➜</div>
              <p>Go to counter now!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counters;
