"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { adminAPI, User, AdminAccount, AdminStats } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import {
  Users,
  CreditCard,
  DollarSign,
  Receipt,
  Edit,
  Send,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'accounts' | 'bills' | 'notifications'>('overview');
  const [showCreateBillModal, setShowCreateBillModal] = useState(false);
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [billForm, setBillForm] = useState({
    payee_name: '',
    account_number: '',
    bill_type: 'utility',
    amount: '',
    due_date: '',
    auto_pay: false,
  });
  const [notificationForm, setNotificationForm] = useState({
    message: '',
    type: 'admin_message',
    send_email: false,
  });

  const loadData = useCallback(async () => {
    try {
      const [statsRes, usersRes, accountsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getAccounts(),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (accountsRes.data) setAccounts(accountsRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      showNotification('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      showNotification('Access denied. Admin privileges required.', 'error');
    }
  }, [user, router, showNotification]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user, loadData]);

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const response = await adminAPI.updateUser(userId, { role: newRole });
      if (response.data) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showNotification(`User role updated to ${newRole}`, 'success');
      }
    } catch (error) {
      showNotification('Failed to update user role', 'error');
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      const response = await adminAPI.blockUser(userId);
      if (response.data) {
        setUsers(users.map(u => u.id === userId ? { ...u, account_status: 'blocked' } : u));
        showNotification('User blocked successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to block user', 'error');
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await adminAPI.unblockUser(userId);
      if (response.data) {
        setUsers(users.map(u => u.id === userId ? { ...u, account_status: 'active' } : u));
        showNotification('User unblocked successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to unblock user', 'error');
    }
  };

  const handleBlockUserTransactions = async (userId: string) => {
    try {
      const response = await adminAPI.blockUserTransactions(userId);
      if (response.data) {
        setUsers(users.map(u => u.id === userId ? { ...u, transactions_blocked: true } : u));
        showNotification('User transactions blocked successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to block user transactions', 'error');
    }
  };

  const handleUnblockUserTransactions = async (userId: string) => {
    try {
      const response = await adminAPI.unblockUserTransactions(userId);
      if (response.data) {
        setUsers(users.map(u => u.id === userId ? { ...u, transactions_blocked: false } : u));
        showNotification('User transactions unblocked successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to unblock user transactions', 'error');
    }
  };

  const handleUpdateBalance = async (accountId: string, newBalance: number) => {
    try {
      const response = await adminAPI.updateAccountBalance(accountId, newBalance);
      if (response.data) {
        setAccounts(accounts.map(a => a.id === accountId ? { ...a, balance: newBalance } : a));
        showNotification('Account balance updated successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to update account balance', 'error');
    }
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      showNotification('Please select a user', 'error');
      return;
    }

    try {
      const response = await adminAPI.createBillForUser({
        user_id: selectedUser,
        payee_name: billForm.payee_name,
        account_number: billForm.account_number,
        bill_type: billForm.bill_type,
        amount: parseFloat(billForm.amount),
        due_date: billForm.due_date,
        auto_pay: billForm.auto_pay,
      });

      if (response.data) {
        showNotification('Bill created successfully', 'success');
        setShowCreateBillModal(false);
        setBillForm({
          payee_name: '',
          account_number: '',
          bill_type: 'utility',
          amount: '',
          due_date: '',
          auto_pay: false,
        });
        setSelectedUser('');
      }
    } catch (error) {
      showNotification('Failed to create bill', 'error');
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      showNotification('Please select a user', 'error');
      return;
    }

    if (!notificationForm.message.trim()) {
      showNotification('Message cannot be empty', 'error');
      return;
    }

    try {
      console.log('Sending notification:', {
        user_id: selectedUser,
        message: notificationForm.message,
        type: notificationForm.type,
        send_email: notificationForm.send_email,
      });

      const response = await adminAPI.sendNotification({
        user_id: selectedUser,
        message: notificationForm.message,
        type: notificationForm.type,
        send_email: notificationForm.send_email,
      });

      console.log('Notification response:', response);

      if (response.data) {
        const emailStatus = notificationForm.send_email ? ' and email sent' : '';
        showNotification(`Notification sent successfully${emailStatus}!`, 'success');
        setShowSendNotificationModal(false);
        setNotificationForm({
          message: '',
          type: 'admin_message',
          send_email: false,
        });
        setSelectedUser('');
      } else if (response.error) {
        showNotification(`Failed to send notification: ${response.error}`, 'error');
      }
    } catch (error) {
      console.error('Notification error:', error);
      showNotification('Failed to send notification', 'error');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (user?.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2 text-white">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-300">Superuser controls for Concierge Bank</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Admin Access</span>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-gold border border-gold-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-gold-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_users.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="glass-gold border border-gold-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-gold-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Accounts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_accounts.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="glass-gold border border-gold-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-8 h-8 text-gold-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Balance</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.total_balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="glass-gold border border-gold-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <Receipt className="w-8 h-8 text-gold-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Total Bills</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_bills.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 bg-dark-800/50 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'accounts', label: 'Accounts', icon: CreditCard },
              { id: 'bills', label: 'Bills', icon: Receipt },
              { id: 'notifications', label: 'Notifications', icon: Send },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold-500 text-dark-900 shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800/70'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="glass border border-gold-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">System Overview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-white text-base">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setActiveTab('users')}
                        className="w-full text-left p-3 glass hover:glass-gold rounded-lg transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-gold-500" />
                          <span className="text-white">Manage Users</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('accounts')}
                        className="w-full text-left p-3 glass hover:glass-gold rounded-lg transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-gold-500" />
                          <span className="text-white">Manage Accounts</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('bills')}
                        className="w-full text-left p-3 glass hover:glass-gold rounded-lg transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <Receipt className="w-5 h-5 text-gold-500" />
                          <span className="text-white">Create Bills</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-white text-base">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-200">Admin dashboard accessed</p>
                          <p className="text-xs text-gray-400">Just now</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-200">System stats loaded</p>
                          <p className="text-xs text-gray-400">Just now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="glass border border-gold-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/30">
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Name</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Email</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Role</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Account Status</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Transactions</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gold-500/10 hover:bg-dark-800/30 transition-colors">
                          <td className="p-3 text-gray-100 font-medium">{u.full_name}</td>
                          <td className="p-3 text-gray-300">{u.email}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              u.role === 'admin' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-gray-500/30 text-gray-300 border border-gray-500/40'
                            }`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              u.account_status === 'blocked' ? 'bg-red-500/30 text-red-300 border border-red-500/40' :
                              u.account_status === 'suspended' ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/40' :
                              'bg-green-500/30 text-green-300 border border-green-500/40'
                            }`}>
                              {u.account_status || 'active'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              u.transactions_blocked ? 'bg-orange-500/30 text-orange-300 border border-orange-500/40' : 'bg-green-500/30 text-green-300 border border-green-500/40'
                            }`}>
                              {u.transactions_blocked ? 'blocked' : 'enabled'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <select
                                  value={u.role || 'user'}
                                  onChange={(e) => handleUpdateUserRole(u.id, e.target.value as 'admin' | 'user')}
                                  className="px-3 py-1.5 bg-dark-800 border border-gold-500/40 rounded-md text-sm text-gray-100 font-medium focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all"
                                >
                                  <option value="user">User</option>
                                  <option value="admin">Admin</option>
                                </select>
                                {u.account_status === 'blocked' ? (
                                  <button
                                    onClick={() => handleUnblockUser(u.id)}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-500 whitespace-nowrap transition-colors shadow-sm"
                                  >
                                    Unblock Account
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBlockUser(u.id)}
                                    className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors shadow-sm"
                                    disabled={u.id === user?.id}
                                  >
                                    Block Account
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {u.transactions_blocked ? (
                                  <button
                                    onClick={() => handleUnblockUserTransactions(u.id)}
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-500 whitespace-nowrap transition-colors shadow-sm"
                                  >
                                    Enable Transactions
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBlockUserTransactions(u.id)}
                                    className="px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors shadow-sm"
                                    disabled={u.id === user?.id}
                                  >
                                    Block Transactions
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="glass border border-gold-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Account Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/30">
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Account #</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Owner</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Type</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Balance</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Status</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-200 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account) => (
                        <tr key={account.id} className="border-b border-gold-500/10 hover:bg-dark-800/30 transition-colors">
                          <td className="p-3">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(account.account_number);
                                showNotification('Account number copied to clipboard', 'success');
                              }}
                              className="text-left text-gray-100 hover:text-gold-400 transition-colors group"
                              title="Click to copy full account number"
                            >
                              <span className="font-mono font-medium">••••{account.account_number?.slice(-4)}</span>
                              <span className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">📋</span>
                            </button>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-100">{account.users?.full_name || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">{account.users?.email || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="p-3 text-gray-200">{account.account_type}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={account.balance}
                              onChange={(e) => {
                                const newBalance = parseFloat(e.target.value);
                                if (!isNaN(newBalance)) {
                                  handleUpdateBalance(account.id, newBalance);
                                }
                              }}
                              className="px-3 py-1.5 bg-dark-800 border border-gold-500/40 rounded-md text-sm text-gray-100 font-medium w-28 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all"
                              step="0.01"
                            />
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              account.status === 'active' ? 'bg-green-500/30 text-green-300 border border-green-500/40' : 'bg-red-500/30 text-red-300 border border-red-500/40'
                            }`}>
                              {account.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button className="px-3 py-1.5 bg-gold-600 text-white rounded-md text-sm font-medium hover:bg-gold-500 transition-colors shadow-sm">
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'bills' && (
              <div className="glass border border-gold-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Create Bills for Users</h3>
                <div className="max-w-md">
                  <p className="text-gray-300 mb-4">Select a user and create a bill that will appear in their account.</p>
                  <button
                    onClick={() => setShowCreateBillModal(true)}
                    className="px-6 py-3 bg-gold-600 text-white rounded-lg font-semibold hover:bg-gold-500 transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create New Bill
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="glass border border-gold-500/20 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Send Notifications</h3>
                <div className="max-w-md">
                  <p className="text-gray-300 mb-4">Send custom notifications to users.</p>
                  <button
                    onClick={() => setShowSendNotificationModal(true)}
                    className="px-6 py-3 bg-gold-600 text-white rounded-lg font-semibold hover:bg-gold-500 transition-colors shadow-md"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Send Notification
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Create Bill Modal */}
          {showCreateBillModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md glass-gold border border-gold-500/30 rounded-2xl p-8 shadow-2xl animate-scale-in">
                <h2 className="text-2xl font-work-sans font-bold mb-6 text-neutral-900">Create Bill for User</h2>
                <form onSubmit={handleCreateBill} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Select User</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900"
                    >
                      <option value="">Choose a user...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Payee Name</label>
                    <input
                      type="text"
                      value={billForm.payee_name}
                      onChange={(e) => setBillForm({ ...billForm, payee_name: e.target.value })}
                      required
                      placeholder="e.g., Electric Company"
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Bill Type</label>
                    <select
                      value={billForm.bill_type}
                      onChange={(e) => setBillForm({ ...billForm, bill_type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900"
                    >
                      <option value="utility">Utility</option>
                      <option value="telecom">Telecom</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="insurance">Insurance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Amount</label>
                    <input
                      type="number"
                      value={billForm.amount}
                      onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                      required
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Due Date</label>
                    <input
                      type="date"
                      value={billForm.due_date}
                      onChange={(e) => setBillForm({ ...billForm, due_date: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto_pay"
                      checked={billForm.auto_pay}
                      onChange={(e) => setBillForm({ ...billForm, auto_pay: e.target.checked })}
                      className="w-4 h-4 text-gold-600 bg-gray-100 border-gray-300 rounded focus:ring-gold-500"
                    />
                    <label htmlFor="auto_pay" className="text-sm text-neutral-900">Enable Auto Pay</label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateBillModal(false)}
                      className="flex-1 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth"
                    >
                      Create Bill
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Send Notification Modal */}
          {showSendNotificationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md glass-gold border border-gold-500/30 rounded-2xl p-8 shadow-2xl animate-scale-in">
                <h2 className="text-2xl font-work-sans font-bold mb-6 text-neutral-900">Send Notification</h2>
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Select User</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900"
                    >
                      <option value="">Choose a user...</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.full_name} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Message</label>
                    <textarea
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                      required
                      rows={3}
                      placeholder="Notification message"
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900 placeholder:text-neutral-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-neutral-900">Type</label>
                    <select
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/90 border border-gold-500/30 rounded-lg focus:outline-none focus:border-gold-500 transition-smooth text-neutral-900"
                    >
                      <option value="admin_message">Admin Message</option>
                      <option value="account_alert">Account Alert</option>
                      <option value="security">Security</option>
                      <option value="transaction">Transaction</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="send_email"
                      checked={notificationForm.send_email}
                      onChange={(e) => setNotificationForm({ ...notificationForm, send_email: e.target.checked })}
                      className="w-4 h-4 text-gold-600 bg-gray-100 border-gray-300 rounded focus:ring-gold-500"
                    />
                    <label htmlFor="send_email" className="text-sm text-neutral-900">Also send via email</label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowSendNotificationModal(false)}
                      className="flex-1 px-6 py-3 glass text-neutral-700 rounded-lg font-work-sans font-semibold hover:glass-gold transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-700 text-white rounded-lg font-work-sans font-semibold hover:from-gold-500 hover:to-gold-600 transition-smooth"
                    >
                      Send Notification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
