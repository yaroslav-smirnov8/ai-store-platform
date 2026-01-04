import React, { useState, useEffect } from 'react';
import { adminAPI, analyticsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
// Removed Telegram dependencies - now pure web app

// Admin section components
const ProductsSection = () => (
  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-slate-800">Products Management</h2>
      <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-xl transition-all transform hover:scale-105 shadow-md">
        + Add Product
      </button>
    </div>
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                AI
              </div>
              <h3 className="font-semibold text-slate-900">AI Neural Networks Course</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">Complete course on neural networks and deep learning</p>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-blue-700">$350</span>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                ML
              </div>
              <h3 className="font-semibold text-slate-900">Machine Learning Intensive</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">Intensive workshop on ML algorithms and applications</p>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-blue-700">$310</span>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                DS
              </div>
              <h3 className="font-semibold text-slate-900">Data Science Community</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">Monthly subscription to data science community</p>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-blue-700">$285</span>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UsersSection = () => (
  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
    <h2 className="text-xl font-bold text-slate-800 mb-6">Customer List</h2>
    <div className="space-y-3">
      {[
        { name: 'John Smith', email: 'john.smith@email.com', orders: 3, totalSpent: 1010, avatar: 'JS' },
        { name: 'Sarah Johnson', email: 'sarah.j@email.com', orders: 2, totalSpent: 595, avatar: 'SJ' },
        { name: 'Michael Brown', email: 'm.brown@email.com', orders: 1, totalSpent: 285, avatar: 'MB' },
        { name: 'Emily Davis', email: 'emily.d@email.com', orders: 4, totalSpent: 1295, avatar: 'ED' },
        { name: 'David Wilson', email: 'd.wilson@email.com', orders: 2, totalSpent: 660, avatar: 'DW' }
      ].map((user, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-blue-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
              {user.avatar}
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="text-sm text-slate-500">{user.email}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">{user.orders} orders</div>
              <div className="text-sm font-semibold text-blue-700">${user.totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaymentsSection = () => (
  <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
    <h2 className="text-xl font-bold text-slate-800 mb-6">Transaction History</h2>
    <div className="space-y-3">
      {[
        { id: 'PAY-001', user: 'John Smith', amount: 350, status: 'completed', date: '2024-01-15', icon: '✓' },
        { id: 'PAY-002', user: 'Sarah Johnson', amount: 310, status: 'pending', date: '2024-01-14', icon: '⏱' },
        { id: 'PAY-003', user: 'Michael Brown', amount: 285, status: 'completed', date: '2024-01-13', icon: '✓' },
        { id: 'PAY-004', user: 'Emily Davis', amount: 350, status: 'completed', date: '2024-01-12', icon: '✓' },
        { id: 'PAY-005', user: 'David Wilson', amount: 310, status: 'failed', date: '2024-01-11', icon: '✗' }
      ].map((payment) => (
        <div key={payment.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                payment.status === 'completed'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                  : payment.status === 'pending'
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {payment.icon}
              </div>
              <div>
                <div className="font-medium text-slate-900">{payment.id}</div>
                <div className="text-sm text-slate-500">{payment.user} • {payment.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">${payment.amount.toLocaleString()}</div>
              <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                payment.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : payment.status === 'pending'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {payment.status}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsSection = () => {
  const chartData = [
    { name: 'Jan', visitors: 1200, orders: 45, revenue: 12500 },
    { name: 'Feb', visitors: 1450, orders: 52, revenue: 14500 },
    { name: 'Mar', visitors: 1680, orders: 67, revenue: 18500 },
    { name: 'Apr', visitors: 1890, orders: 78, revenue: 21500 },
    { name: 'May', visitors: 2100, orders: 89, revenue: 28475 },
    { name: 'Jun', visitors: 1247, orders: 35, revenue: 9500 }
  ];

  const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Reports and Statistics</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Overview</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Total Visitors</span>
              <span className="text-2xl font-bold text-blue-700">{totalVisitors.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Total Orders</span>
              <span className="text-2xl font-bold text-blue-700">{totalOrders}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Total Revenue</span>
              <span className="text-2xl font-bold text-blue-700">${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Performance</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="grid grid-cols-6 gap-2 mb-4">
            {chartData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-slate-500 mb-1">{item.name}</div>
                <div className="relative h-24">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                    style={{ height: `${(item.visitors / 2100) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium mt-1">{item.visitors}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-slate-600">Visitors by Month</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Performing Products</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-blue-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                1
              </div>
              <span className="font-medium text-slate-900">AI Neural Networks Course</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-blue-700">42 orders</div>
              <div className="text-xs text-slate-500">$14,250 revenue</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-blue-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                2
              </div>
              <span className="font-medium text-slate-900">Machine Learning Intensive</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-blue-700">31 orders</div>
              <div className="text-xs text-slate-500">$9,650 revenue</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between border border-blue-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                3
              </div>
              <span className="font-medium text-slate-900">Data Science Community</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-blue-700">16 orders</div>
              <div className="text-xs text-slate-500">$4,575 revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }

    // Track page view
    analyticsAPI.trackClick({
      page: 'admin',
      action: 'page_view',
      meta_data: {}
    }).catch(console.error);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try to authenticate via backend API using the proper API function
      const response = await adminAPI.login({
        email: credentials.email,
        password: credentials.password
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('admin_token', data.access_token);
        setIsAuthenticated(true);
        await loadDashboardData();
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    } catch (err) {
      // Check if it's a network error or authentication error
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else {
        // Fallback to hardcoded credentials if backend is not available
        const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'admin@aistore.com';
        const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          // Generate a simple token (in production, use proper JWT)
          const token = btoa(`${adminEmail}:${Date.now()}`);
          localStorage.setItem('admin_token', token);
          setIsAuthenticated(true);
          await loadDashboardData();
        } else {
          setError('Invalid email or password or backend server not available');
        }
      }
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      // Try to load data from backend
      try {
        const [dashboardResponse, notificationsResponse] = await Promise.all([
          adminAPI.getDashboard(),
          adminAPI.getNotifications()
        ]);

        setDashboardData(dashboardResponse.data);
        setNotifications(notificationsResponse.data);
      } catch (apiErr) {
        // If backend not available, show mock data
        console.log('Backend not available, showing mock data');
        setDashboardData({
          unique_visitors: 1247,
          total_page_views: 3842,
          total_orders: 89,
          total_revenue: 28475,
          total_clicks: 1245,
          conversion_rate: 7.15,
          top_products: [
            { name: 'AI Neural Networks Course', order_count: 42, revenue: 14250 },
            { name: 'Machine Learning Intensive', order_count: 31, revenue: 9650 },
            { name: 'Data Science Community', order_count: 16, revenue: 4575 }
          ],
          recent_orders: [
            {
              id: 1,
              user: { first_name: 'John', last_name: 'Smith' },
              product: { name: 'AI Neural Networks Course' },
              total_amount: 350,
              status: 'paid'
            },
            {
              id: 2,
              user: { first_name: 'Sarah', last_name: 'Johnson' },
              product: { name: 'Machine Learning Intensive' },
              total_amount: 310,
              status: 'pending'
            },
            {
              id: 3,
              user: { first_name: 'Michael', last_name: 'Brown' },
              product: { name: 'Data Science Community' },
              total_amount: 285,
              status: 'paid'
            },
            {
              id: 4,
              user: { first_name: 'Emily', last_name: 'Davis' },
              product: { name: 'AI Neural Networks Course' },
              total_amount: 350,
              status: 'paid'
            },
            {
              id: 5,
              user: { first_name: 'David', last_name: 'Wilson' },
              product: { name: 'Machine Learning Intensive' },
              total_amount: 310,
              status: 'cancelled'
            }
          ]
        });
        setNotifications([
          {
            id: 1,
            type: 'order',
            title: 'New Order',
            message: 'John Smith placed an order for "AI Neural Networks Course"',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
          },
          {
            id: 2,
            type: 'payment',
            title: 'Payment Received',
            message: 'Sarah Johnson paid for order #2',
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          },
          {
            id: 3,
            type: 'system',
            title: 'System Update',
            message: 'System successfully updated to version 2.1.0',
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          }
        ]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setDashboardData(null);
    setNotifications([]);
    setActiveSection('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🔐</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-600 text-sm">
                Login to access the control panel
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <LoadingSpinner text="Loading data..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-600 text-sm">Store Management</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-md border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {dashboardData.unique_visitors || 1247}
            </div>
            <div className="text-xs text-blue-600 font-medium">Unique Visitors</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-md border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {dashboardData.total_page_views || 3842}
            </div>
            <div className="text-xs text-blue-600 font-medium">Page Views</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-md border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {dashboardData.total_orders || 89}
            </div>
            <div className="text-xs text-blue-600 font-medium">Orders</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-md border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {dashboardData.total_revenue ? `$${dashboardData.total_revenue.toLocaleString()}` : '$284,750'}
            </div>
            <div className="text-xs text-blue-600 font-medium">Revenue</div>
          </div>
        </div>

        {/* Recent Orders */}
        {dashboardData.recent_orders && dashboardData.recent_orders.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Orders
            </h2>
            <div className="space-y-3">
              {dashboardData.recent_orders.slice(0, 5).map((order) => (
                <div key={order.id} className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">
                        {order.product?.name || 'Product'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.user?.first_name} {order.user?.last_name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        ${order.total_amount.toLocaleString()}
                      </div>
                      <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                        order.status === 'paid'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'pending'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div key={notification.id} className={`p-4 rounded-xl transition-all ${
                  notification.is_read ? 'bg-blue-50' : 'bg-blue-100 border border-blue-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm flex items-center">
                        {notification.type === 'order' && (
                          <span className="w-5 h-5 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">📦</span>
                        )}
                        {notification.type === 'payment' && (
                          <span className="w-5 h-5 bg-teal-200 text-teal-600 rounded-full flex items-center justify-center mr-2 text-xs">💰</span>
                        )}
                        {notification.type === 'system' && (
                          <span className="w-5 h-5 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">⚙️</span>
                        )}
                        {notification.title}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 ml-7">
                        {notification.message}
                      </div>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveSection('products')}
              className={`p-4 text-left rounded-xl border transition-all transform hover:scale-105 ${
                activeSection === 'products'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md'
                  : 'border-blue-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-900">Products</div>
              <div className="text-xs text-slate-600">Catalog Management</div>
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`p-4 text-left rounded-xl border transition-all transform hover:scale-105 ${
                activeSection === 'users'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md'
                  : 'border-blue-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-900">Users</div>
              <div className="text-xs text-slate-600">Customer List</div>
            </button>
            <button
              onClick={() => setActiveSection('payments')}
              className={`p-4 text-left rounded-xl border transition-all transform hover:scale-105 ${
                activeSection === 'payments'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md'
                  : 'border-blue-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-900">Payments</div>
              <div className="text-xs text-slate-600">Transaction History</div>
            </button>
            <button
              onClick={() => setActiveSection('analytics')}
              className={`p-4 text-left rounded-xl border transition-all transform hover:scale-105 ${
                activeSection === 'analytics'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300 shadow-md'
                  : 'border-blue-200 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-900">Analytics</div>
              <div className="text-xs text-slate-600">Reports and Statistics</div>
            </button>
          </div>
        </div>
        
        {/* Section Content */}
        {activeSection === 'products' && <ProductsSection />}
        {activeSection === 'users' && <UsersSection />}
        {activeSection === 'payments' && <PaymentsSection />}
        {activeSection === 'analytics' && <AnalyticsSection />}
      </div>
    </div>
  );
};

export default AdminPage;
