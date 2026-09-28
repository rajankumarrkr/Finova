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
  const [user, setUser] = useState(initialUserData);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeInvestments, setActiveInvestments] = useState(activeInvestmentsList);
  const [transactions, setTransactions] = useState(initialTransactionsList);
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
  const [notifications, setNotifications] = useState(initialNotificationsList);

  // Authentication Handlers
  const login = (mobile, password) => {
    setUser(prev => ({
      ...prev,
      phone: `+91 ${mobile}`
    }));
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
  };

  const register = (name, mobile, password, referralCode) => {
    const newUser = {
      ...initialUserData,
      name: name,
      phone: `+91 ${mobile}`,
      referralCode: referralCode ? referralCode.toUpperCase() : "REG" + Math.floor(10 + Math.random() * 89)
    };
    setUser(newUser);
    setIsAuthenticated(true);
    showToast(`Account created successfully! Welcome to Finova, ${name.split(' ')[0]}.`, 'success');
  };

  const logout = () => {
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
