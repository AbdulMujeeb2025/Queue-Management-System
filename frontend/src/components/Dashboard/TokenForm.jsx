import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { LogOut, Ticket, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TokenForm = () => {
  const [formData, setFormData] = useState({ phone: '', purpose: '', urgent: false });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const purposeCounters = {
    'ID Creation': 1,
    FIR: 2,
    Passport: 3,
    Complaint: 4,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/tokens/generate', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Queue Management
            </h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Token Form */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <Ticket className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Generate Queue Token</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-2xl mb-6 flex items-center gap-3">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 shadow-lg"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 shadow-lg"
                required
              >
                <option value="">Select purpose</option>
                <option value="ID Creation">ID Creation</option>
                <option value="FIR">FIR</option>
                <option value="Passport">Passport</option>
                <option value="Complaint">Complaint</option>
              </select>
            </div>

            <div className="flex items-center p-4 border border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <input
                type="checkbox"
                id="urgent"
                checked={formData.urgent}
                onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
              />
              <label htmlFor="urgent" className="ml-3 block text-sm font-semibold text-gray-900 cursor-pointer">
                Urgent Request <AlertCircle className="inline h-4 w-4 text-red-500 ml-1" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {loading ? 'Generating...' : 'Generate Token'}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-8 text-center shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
            <Ticket className="mx-auto h-20 w-20 mb-6 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">Token Generated Successfully!</h3>
            <div className="space-y-2 mb-6">
              <p><span className="font-semibold">Token Number:</span> {result.tokenNumber}</p>
              <p><span className="font-semibold">Assigned Counter:</span> Counter {result.counter}</p>
              {result.urgent && <p className="font-semibold text-yellow-200 flex items-center justify-center gap-2"><AlertCircle size={20} /> Urgent Priority</p>}
              <p><span className="font-semibold">Phone:</span> {result.phone}</p>
            </div>
            <button
              onClick={() => setResult(null)}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Generate New Token
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenForm;
