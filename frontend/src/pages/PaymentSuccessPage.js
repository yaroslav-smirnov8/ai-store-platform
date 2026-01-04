import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentsAPI, analyticsAPI } from '../utils/api';
// Removed Telegram dependencies - now pure web app
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('loading');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    if (paymentId) {
      checkPaymentStatus(paymentId);
    } else {
      setPaymentStatus('error');
    }

    // Track page view
    analyticsAPI.trackClick({
      page: 'payment-success',
      action: 'page_view',
      meta_data: { payment_id: paymentId }
    }).catch(console.error);
  }, [searchParams]);

  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await paymentsAPI.getStatus(paymentId);
      setPaymentData(response.data);
      
      if (response.data.status === 'succeeded') {
        setPaymentStatus('success');
      } else if (response.data.status === 'pending') {
        setPaymentStatus('pending');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
    }
  };

  if (paymentStatus === 'loading') {
    return <LoadingSpinner text="Checking payment status..." />;
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pb-20">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your payment of {paymentData?.amount && `$${paymentData.amount}`} has been successfully processed
            </p>

            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Course access will open within 5 minutes</li>
                <li>• Check your email for confirmation</li>
                <li>• Save the receipt for your records</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                to="/courses"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Go to Courses
              </Link>
              
              <Link
                to="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pb-20">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processing Payment
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your payment is being processed. This may take a few minutes.
            </p>

            <button
              onClick={() => checkPaymentStatus(searchParams.get('payment_id'))}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3"
            >
              Check Status
            </button>
            
            <Link
              to="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pb-20">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Error
          </h1>
          
          <p className="text-gray-600 mb-6">
            Unfortunately, we couldn't process your payment. Please try again.
          </p>

          <div className="space-y-3">
            <Link
              to="/courses"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </Link>
            
            <Link
              to="/contact"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
