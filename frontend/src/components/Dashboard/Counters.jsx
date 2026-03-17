import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  FileText, 
  Globe, 
  AlertTriangle,
  Users, 
  ArrowLeft,
  LogOut,
  Play,
  Clock
} from 'lucide-react';
import api from '../../services/api';

const countersConfig = [
  { id: 1, name: 'Counter 1', purpose: 'FIR', icon: FileText, color: 'from-red-400 to-red-500' },
  { id: 2, name: 'Counter 2', purpose: 'ID Creation', icon: Shield, color: 'from-blue-400 to-blue-500' },
  { id: 3, name: 'Counter 3', purpose: 'Passport', icon: Globe, color: 'from-green-400 to-green-500' },
  { id: 4, name: 'Counter 4', purpose: 'Complaint', icon: AlertTriangle, color: 'from-orange-400 to-orange-500' },
];

const Counters = () => {
  const [counters, setCounters] = useState(countersConfig.map(c => ({
    ...c, 
    currentServing: null, 
    waiting: 0, 
    urgentWaiting: 0 
  })));
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchStatus = useCallback(async (counterId) => {
    try {
      const res = await api.get(`/tokens/counter/${counterId}/status`);
      setCounters(prev => prev.map(c => 
        c.id === counterId ? {
          ...c,
          waiting: res.data.pendingCount,
          urgentWaiting: res.data.urgentCount
        } : c
      ));
    } catch (error) {
      console.log('Status fetch error:', error);
    }
  }, []);

  const handleNext = async (counterId) => {
    try {
      const res = await api.get(`/tokens/counter/${counterId}/next`);
      if (res.data.token) {
        setCounters(prev => prev.map(c => 
          c.id === counterId 
            ? { ...c, currentServing: res.data.token.tokenNumber }
            : c
        ));
      }
      // Re-fetch status to update waiting count
      await fetchStatus(counterId);
    } catch (error) {
      console.log('Next token error:', error);
    }
  };

  // Initial load and polling
  useEffect(() => {
    countersConfig.forEach(config => fetchStatus(config.id));

    const interval = setInterval(() => {
      countersConfig.forEach(config => fetchStatus(config.id));
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-4">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-40 p-4 rounded-xl mb-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Users size={24} />
            Queue Management
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg transition-all">
              Generate Token
            </Link>
            <button onClick={logout} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center mb-6">
        <ArrowLeft className="mx-auto h-8 w-8 text-gray-400 mb-2 cursor-pointer hover:text-gray-600" onClick={() => navigate('/dashboard')} />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Live Counters
        </h1>
        <p className="text-gray-600">Real-time queue management</p>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {counters.map((counter) => {
          const Icon = counter.icon;
          return (
            <div key={counter.id} className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-white/50">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${counter.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900">{counter.name}</div>
              </div>

              {/* Purpose */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  {counter.purpose}
                </p>
              </div>

              {/* Current Serving */}
              <div className="text-center py-4 mb-4">
                {counter.currentServing ? (
                  <div className="bg-green-100 border-4 border-green-300 rounded-2xl p-4 mb-2">
                    <div className="text-3xl font-black text-green-800 tracking-wide">
                      {counter.currentServing}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-6 mb-2">
                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">Waiting for token</p>
                  </div>
                )}
              </div>

              {/* Waiting Badge */}
              {(counter.waiting > 0) && (
                <div className="flex gap-2 mb-4">
                  <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    {counter.waiting} Waiting
                    {counter.urgentWaiting > 0 && (
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded-full text-xs font-bold">
                        {counter.urgentWaiting}⚡
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleNext(counter.id)}
                  disabled={counter.waiting === 0}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                    counter.waiting === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5'
                  }`}
                >
                  <Play size={18} />
                  {counter.waiting === 0 ? 'Queue Empty' : 'Call Next'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Counters;
