import React from 'react';
import { CheckCircle, Copy, Printer, X } from 'lucide-react';

const TokenModal = ({ tokenData, onClose, onPrint }) => {
  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; max-width: 400px; margin: 0 auto;">
        <div style="width: 80px; height: 80px; background: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 40px; height: 40px; color: white;" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 style="font-size: 28px; font-weight: bold; color: #1f2937; margin: 20px 0;">Queue Token</h1>
        <div style="background: #f9fafb; border: 3px solid #10b981; border-radius: 16px; padding: 24px; margin: 20px 0;">
          <div style="font-size: 48px; font-weight: bold; color: #059669; letter-spacing: 4px;">${tokenData.tokenNumber}</div>
        </div>
        <p style="font-size: 18px; color: #6b7280; margin: 20px 0;">Counter ${tokenData.counter}</p>
        <p style="font-size: 16px; color: #374151;">Phone: ${tokenData.phone}</p>
        ${tokenData.urgent ? '<p style="font-size: 16px; color: #dc2626; font-weight: bold;">URGENT</p>' : ''}
      </div>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Queue Token</title></head>
        <body style="margin: 0;">${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* max-h aur overflow-y-auto hata diya, padding kam ki */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        
        {/* Header - Size kam kiya */}
        <div className="p-5 text-center border-b border-gray-100">
          <div className="w-14 h-14 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Generated Successful!</h2>
          <p className="text-sm text-gray-600">Your queue token has been generated</p>
        </div>

        {/* Token Content - Spacing kam ki */}
        <div className="p-5 space-y-4">
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {/* Token number font size kam kiya */}
              <div className="text-3xl font-black tracking-wider mb-1">{tokenData.tokenNumber}</div>
            </div>
            {/* Box padding kam kiya */}
            <div className="bg-white border-4 border-green-200 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-base font-semibold text-gray-900">Counter {tokenData.counter}</div>
              </div>
              <p className="text-sm text-gray-600">Phone: {tokenData.phone}</p>
              {tokenData.urgent && (
                <div className="mt-2 p-1.5 bg-red-100 border border-red-200 rounded-xl">
                  <span className="font-semibold text-red-800 text-xs">⚡ URGENT PRIORITY</span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons - Padding kam kiya */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Printer size={18} />
              Print Token
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;