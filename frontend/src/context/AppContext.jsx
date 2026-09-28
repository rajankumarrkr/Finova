import React, { createContext, useContext, useState } from 'react';
import {
  initialUserData,
  activeInvestmentsList,
  initialTransactionsList,
  initialBankAccounts,
  initialNotificationsList,
  investmentPlansList
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // LocalStorage persistence helpers
  const getInitialUser = () => {
    try {
      const saved = localStorage.getItem('finova_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialUserData;
  };

  const getInitialRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('finova_registered_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        name: "Rajan Kumar",
        phone: "9876543210",
        email: "rajan@example.com",
        password: "password123",
        referralCode: "RAJAN50"
      }
    ];
  };

  const [user, setUser] = useState(getInitialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('finova_auth') === 'true' || !!localStorage.getItem('finova_token');
  });
  const [registeredUsers, setRegisteredUsers] = useState(getInitialRegisteredUsers);
  const [activeInvestments, setActiveInvestments] = useState(activeInvestmentsList);
  const [transactions, setTransactions] = useState(initialTransactionsList);
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
  const [notifications, setNotifications] = useState(initialNotificationsList);

  // Sync user profile from backend on reload if token exists
  React.useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('finova_token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.user) {
          const apiUser = data.data.user;
          const updatedUser = {
            ...initialUserData,
            id: apiUser.id || apiUser._id,
            name: apiUser.name,
            email: apiUser.email,
            phone: apiUser.phone,
            referralCode: apiUser.referralCode,
            balances: apiUser.balances || initialUserData.balances
          };
          setUser(updatedUser);
          setIsAuthenticated(true);
          localStorage.setItem('finova_user', JSON.stringify(updatedUser));
          localStorage.setItem('finova_auth', 'true');
        } else {
          // Token is invalid or expired, clear invalid token so it doesn't overwrite future logins
          localStorage.removeItem('finova_token');
        }
      } catch (err) {
        // Network error - keep local saved session intact
      }
    };
    fetchMe();
  }, []);

  // Authentication Handlers
  const login = async (mobile, password) => {
    // 1. Try Backend API first if backend is live
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: mobile, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.data?.accessToken) {
          localStorage.setItem('finova_token', data.data.accessToken);
        }
        const apiUser = data.data?.user;
        let updatedUser = user;
        if (apiUser) {
          updatedUser = {
            ...initialUserData,
            id: apiUser.id || apiUser._id,
            name: apiUser.name,
            email: apiUser.email,
            phone: apiUser.phone,
            referralCode: apiUser.referralCode,
            balances: apiUser.balances || initialUserData.balances
          };
          setUser(updatedUser);
          localStorage.setItem('finova_user', JSON.stringify(updatedUser));
          localStorage.setItem('finova_auth', 'true');
        }
        setIsAuthenticated(true);
        showToast(`Welcome back, ${apiUser?.name?.split(' ')[0] || 'User'}!`, 'success');
        return { success: true };
      } else if (response.status === 401 || response.status === 400 || response.status === 404) {
        return { success: false, message: data.message || 'Mobile number is not registered. Please register first.' };
      }
    } catch (err) {
      // Backend not reached or offline, fallback to frontend state verification
    }

    // 2. Local State Verification (Strict registration check)
    const cleanMobile = mobile.replace(/\D/g, '');
    const foundUser = registeredUsers.find(u => u.phone.replace(/\D/g, '') === cleanMobile);

    if (!foundUser) {
      return {
        success: false,
        message: `Mobile number (+91 ${cleanMobile}) is NOT registered. Please click 'Register Now' to create an account first.`
      };
    }

    if (foundUser.password !== password) {
      return {
        success: false,
        message: 'Incorrect password! Please check your password and try again.'
      };
    }

    const updatedUser = {
      ...initialUserData,
      id: foundUser.phone,
      name: foundUser.name,
      email: foundUser.email || `${cleanMobile}@example.com`,
      phone: `+91 ${cleanMobile}`,
      referralCode: foundUser.referralCode || 'REF' + Math.floor(10 + Math.random() * 89)
    };

    // Remove any stale backend token from previous session
    localStorage.removeItem('finova_token');
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('finova_user', JSON.stringify(updatedUser));
    localStorage.setItem('finova_auth', 'true');
    showToast(`Welcome back, ${foundUser.name.split(' ')[0]}!`, 'success');
    return { success: true };
  };

  const register = async (name, mobile, password, referralCode) => {
    const cleanMobile = mobile.replace(/\D/g, '');

    // 1. Try Backend API
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: `${cleanMobile}@finova.app`,
          phone: `+91 ${cleanMobile}`,
          password,
          referralCode
        })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.data?.accessToken) {
          localStorage.setItem('finova_token', data.data.accessToken);
        }
        const apiUser = data.data?.user;
        const updatedUser = {
          ...initialUserData,
          id: apiUser?.id || apiUser?._id,
          name: apiUser?.name || name,
          phone: apiUser?.phone || `+91 ${cleanMobile}`,
          email: apiUser?.email || `${cleanMobile}@finova.app`,
          referralCode: apiUser?.referralCode || (referralCode ? referralCode.toUpperCase() : "REG" + Math.floor(10 + Math.random() * 89))
        };
        setUser(updatedUser);
        setIsAuthenticated(true);
        localStorage.setItem('finova_user', JSON.stringify(updatedUser));
        localStorage.setItem('finova_auth', 'true');
        showToast(`Account created successfully! Welcome to Finova, ${name.split(' ')[0]}.`, 'success');
        return { success: true };
      } else if (!data.success && data.message) {
        return { success: false, message: data.message };
      }
    } catch (err) {
      // Fallback local registration
    }

    // 2. Check if mobile already exists locally
    const existing = registeredUsers.find(u => u.phone.replace(/\D/g, '') === cleanMobile);
    if (existing) {
      return {
        success: false,
        message: `Mobile number (+91 ${cleanMobile}) is already registered! Please sign in instead.`
      };
    }

    const newUserObj = {
      name,
      phone: cleanMobile,
      email: `${cleanMobile}@finova.app`,
      password,
      referralCode: referralCode ? referralCode.toUpperCase() : "REG" + Math.floor(10 + Math.random() * 89)
    };

    const newRegisteredList = [...registeredUsers, newUserObj];
    setRegisteredUsers(newRegisteredList);
    localStorage.setItem('finova_registered_users', JSON.stringify(newRegisteredList));

    const updatedUser = {
      ...initialUserData,
      id: cleanMobile,
      name,
      phone: `+91 ${cleanMobile}`,
      referralCode: newUserObj.referralCode
    };

    // Remove any stale backend token from previous session
    localStorage.removeItem('finova_token');
    setUser(updatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('finova_user', JSON.stringify(updatedUser));
    localStorage.setItem('finova_auth', 'true');
    showToast(`Account created successfully! Welcome to Finova, ${name.split(' ')[0]}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('finova_user');
    localStorage.removeItem('finova_token');
    localStorage.removeItem('finova_auth');
    setUser(initialUserData);
    setIsAuthenticated(false);
    showToast('Logged out of session', 'info');
  };



  
  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState(null);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  // Toast Notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'info' });
  };

  // Action: Open Invest Modal
  const openInvestModal = (plan) => {
    setSelectedPlanForInvest(plan || investmentPlansList[0]);
    setIsInvestOpen(true);
  };

  // Action: Confirm Investment
  const handleInvestSubmit = (plan, amount) => {
    if (user.balances.availableBalance < amount) {
      showToast(`Insufficient available balance! Please deposit funds first.`, 'error');
      return false;
    }

    // Update balances
    const newAvailable = user.balances.availableBalance - amount;
    const newTotalInvested = user.balances.totalInvested + amount;
    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        availableBalance: newAvailable,
        totalInvested: newTotalInvested,
        totalBalance: prev.balances.totalBalance // balance reallocated to active investment
      },
      stats: {
        ...prev.stats,
        activeInvestmentsCount: prev.stats.activeInvestmentsCount + 1,
        lifetimeInvested: prev.stats.lifetimeInvested + amount
      }
    }));

    // Add Active Investment
    const newInvestment = {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      planName: plan.name,
      badge: plan.badge,
      amount: amount,
      dailyEarning: plan.dailyEarning,
      durationDays: plan.durationDays,
      completedDays: 1,
      totalEarnedSoFar: plan.dailyEarning,
      nextEarning: "Tomorrow, 10:00 AM",
      startDate: "Today",
      color: plan.color
    };
    setActiveInvestments(prev => [newInvestment, ...prev]);

    // Add Transaction
    const newTxn = {
      id: `TXN-${Math.floor(9000 + Math.random() * 999)}`,
      type: "investment",
      title: `Investment — ${plan.name}`,
      amount: amount,
      isPositive: false,
      date: "Just now",
      rawDate: new Date().toISOString(),
      status: "Completed",
      category: "Investments",
      reference: `${newInvestment.id} Activation`
    };
    setTransactions(prev => [newTxn, ...prev]);

    // Add Notification
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: `${plan.name} Activated`,
      description: `₹${amount.toLocaleString()} has been invested in ${plan.name}. Daily earning ₹${plan.dailyEarning} scheduled!`,
      timestamp: "Just now",
      read: false,
      category: "Investment",
      iconType: "trending"
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Successfully invested ₹${amount.toLocaleString()} in ${plan.name}!`, 'success');
    setIsInvestOpen(false);
    return true;
  };

  // Action: Confirm Deposit
  const handleDepositSubmit = (amount, paymentMethod) => {
    const depAmount = parseFloat(amount);
    if (!depAmount || depAmount <= 0) {
      showToast('Please enter a valid deposit amount', 'error');
      return false;
    }

    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        totalBalance: prev.balances.totalBalance + depAmount,
        availableBalance: prev.balances.availableBalance + depAmount,
        withdrawableBalance: prev.balances.withdrawableBalance + depAmount
      }
    }));

    const newTxn = {
      id: `TXN-${Math.floor(9000 + Math.random() * 999)}`,
      type: "deposit",
      title: `${paymentMethod.toUpperCase()} Deposit`,
      amount: depAmount,
      isPositive: true,
      date: "Just now",
      rawDate: new Date().toISOString(),
      status: "Completed",
      category: "Investments",
      reference: `Ref: ${paymentMethod}-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setTransactions(prev => [newTxn, ...prev]);

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: "Deposit Successful",
      description: `₹${depAmount.toLocaleString()} added to your available balance via ${paymentMethod.toUpperCase()}.`,
      timestamp: "Just now",
      read: false,
      category: "Deposit",
      iconType: "dollar"
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Deposit of ₹${depAmount.toLocaleString()} completed successfully!`, 'success');
    setIsDepositOpen(false);
    return true;
  };

  // Action: Confirm Withdrawal
  const handleWithdrawSubmit = (amount, bankAccountId) => {
    const withAmount = parseFloat(amount);
    if (!withAmount || withAmount <= 0) {
      showToast('Please enter a valid withdrawal amount', 'error');
      return false;
    }

    if (withAmount > user.balances.availableBalance) {
      showToast('Withdrawal amount exceeds available balance', 'error');
      return false;
    }

    const targetBank = bankAccounts.find(b => b.id === bankAccountId) || bankAccounts[0];

    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        totalBalance: prev.balances.totalBalance - withAmount,
        availableBalance: prev.balances.availableBalance - withAmount,
        withdrawableBalance: prev.balances.withdrawableBalance - withAmount
      }
    }));

    const newTxn = {
      id: `TXN-${Math.floor(9000 + Math.random() * 999)}`,
      type: "withdrawal",
      title: `Withdrawal to ${targetBank?.bankName || 'Bank Account'}`,
      amount: withAmount,
      isPositive: false,
      date: "Just now",
      rawDate: new Date().toISOString(),
      status: "Processing",
      category: "Withdrawals",
      reference: `Payout Ref: IMPS${Math.floor(100000 + Math.random() * 900000)}`
    };
    setTransactions(prev => [newTxn, ...prev]);

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title: "Withdrawal Request Submitted",
      description: `₹${withAmount.toLocaleString()} withdrawal to ${targetBank?.bankName || 'Bank Account'} is under processing.`,
      timestamp: "Just now",
      read: false,
      category: "Withdrawal",
      iconType: "arrow-down"
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Withdrawal request for ₹${withAmount.toLocaleString()} submitted!`, 'success');
    setIsWithdrawOpen(false);
    return true;
  };

  // Action: Add Bank Account
  const handleAddBankAccount = (accountData) => {
    const newAccount = {
      id: `BANK-${Math.floor(10 + Math.random() * 90)}`,
      bankName: accountData.bankName,
      accountNumber: `XXXX XXXX ${accountData.accountNumber.slice(-4)}`,
      rawAccountNumber: accountData.accountNumber,
      holderName: accountData.holderName,
      ifscCode: accountData.ifscCode.toUpperCase(),
      branch: "Main Branch",
      status: "Verified",
      isDefault: bankAccounts.length === 0
    };

    setBankAccounts(prev => [...prev, newAccount]);
    showToast(`${accountData.bankName} account added successfully!`, 'success');
    setIsAddBankOpen(false);
    return true;
  };

  // Action: Mark all notifications as read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Action: Mark single notification read
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        register,
        logout,
        activeInvestments,
        transactions,
        bankAccounts,
        notifications,
        unreadCount,
        toast,
        showToast,
        closeToast,
        // Modals

        isDepositOpen,
        setIsDepositOpen,
        isWithdrawOpen,
        setIsWithdrawOpen,
        isInvestOpen,
        setIsInvestOpen,
        selectedPlanForInvest,
        openInvestModal,
        isAddBankOpen,
        setIsAddBankOpen,
        isSupportOpen,
        setIsSupportOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        // Handlers
        handleInvestSubmit,
        handleDepositSubmit,
        handleWithdrawSubmit,
        handleAddBankAccount,
        markAllNotificationsRead,
        markNotificationRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
