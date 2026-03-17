import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { LogOut, Ticket, Phone, AlertCircle, CheckCircle, Printer, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TokenModal from '../Auth/TokenModal';

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

  const handlePrintToken = () => {
    if (!result) return;
    const printContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; max-width: 400px; margin: 0 auto; background: white;">
        <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 40px; height: 40px; color: white;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 20px 0;">Queue Token</h1>
        <div style="background: #f9fafb; border: 3px solid #10b981; border-radius: 16px; padding: 24px; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #059669; letter-spacing: 4px;">${result.tokenNumber}</div>
        </div>
        <p style="font-size: 18px; color: #6b7280; margin: 20px 0;">Counter ${result.counter}</p>
        <p style="font-size: 16px; color: #374151;">Phone: ${result.phone}</p>
        ${result.urgent ? '<p style="font-size: 16px; color: #dc2626; font-weight: bold;">URGENT PRIORITY</p>' : ''}
      </div>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Queue Token - ${result.tokenNumber}</title></head>
        <body style="margin: 0;">${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      {/* Main container padding kam ki */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header - Padding aur margin kam kiya */}
          <nav className="bg-white/80 backdrop-blur-xl shadow-lg rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              {/* Title size kam kiya */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Generate Token
              </h1>
              <div className="flex items-center gap-3">
                {/* Button size kam kiya */}
                <Link to="/counters" className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                  Counters Status
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </nav>

          {/* Token Form - Padding kam kiya */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-5">
              {/* Icon size kam kiya */}
              <Ticket className="mx-auto h-12 w-12 text-green-500 mb-2" />
              {/* Title size kam kiya */}
              <h2 className="text-2xl font-bold text-gray-900">Generate Queue Token</h2>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl mb-4 flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    // Input padding kam ki
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 shadow-lg text-sm"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  // Select padding kam ki
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white/50 shadow-lg text-sm"
                  required
                >
                  <option value="">Select purpose</option>
                  <option value="ID Creation">ID Creation</option>
                  <option value="FIR">FIR</option>
                  <option value="Passport">Passport</option>
                  <option value="Complaint">Complaint</option>
                </select>
              </div>

              <div className="flex items-center p-3 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={formData.urgent}
                  onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                  className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                />
                <label htmlFor="urgent" className="ml-3 block text-sm font-semibold text-gray-900 cursor-pointer">
                  Urgent Request <AlertCircle className="inline h-4 w-4 text-red-500 ml-1" />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                // Button padding kam ki
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-sm"
              >
                {loading ? 'Generating...' : 'Generate Token'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Token Success Modal */}
      {result && (
        <TokenModal
          tokenData={result}
          onClose={() => setResult(null)}
          onPrint={handlePrintToken}
        />
      )}
    </>
  );
};

export default TokenForm;