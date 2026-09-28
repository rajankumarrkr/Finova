export const initialUserData = {
  name: "Rajan Kumar",
  email: "rajan@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  referralCode: "RAJAN50",
  memberSince: "12 Aug 2026",
  kycStatus: "Verified",
  balances: {
    totalBalance: 12850.00,
    availableBalance: 4850.00,
    totalInvested: 8000.00,
    totalEarnings: 4850.00,
    todayEarnings: 50.00,
    referralEarnings: 2450.00,
    withdrawableBalance: 4850.00
  },
  stats: {
    activeInvestmentsCount: 2,
    completedPlansCount: 2,
    lifetimeInvested: 25000.00
  }
};

export const chartTimeframeData = {
  "1D": [
    { time: "09:00 AM", value: 12800 },
    { time: "11:00 AM", value: 12815 },
    { time: "01:00 PM", value: 12810 },
    { time: "03:00 PM", value: 12835 },
    { time: "05:00 PM", value: 12850 }
  ],
  "1W": [
    { time: "Mon", value: 12200 },
    { time: "Tue", value: 12350 },
    { time: "Wed", value: 12480 },
    { time: "Thu", value: 12600 },
    { time: "Fri", value: 12720 },
    { time: "Sat", value: 12800 },
    { time: "Sun", value: 12850 }
  ],
  "1M": [
    { time: "1 Sep", value: 10500 },
    { time: "7 Sep", value: 11100 },
    { time: "14 Sep", value: 11650 },
    { time: "21 Sep", value: 12300 },
    { time: "28 Sep", value: 12850 }
  ],
  "3M": [
    { time: "Jul", value: 8200 },
    { time: "Aug", value: 10100 },
    { time: "Sep", value: 12850 }
  ],
  "1Y": [
    { time: "Oct 25", value: 4000 },
    { time: "Dec 25", value: 5800 },
    { time: "Feb 26", value: 7200 },
    { time: "Apr 26", value: 8900 },
    { time: "Jun 26", value: 10400 },
    { time: "Aug 26", value: 11800 },
    { time: "Sep 26", value: 12850 }
  ]
};

export const activeInvestmentsList = [
  {
    id: "INV-101",
    planName: "Starter Plan",
    badge: "STARTER",
    amount: 5000,
    dailyEarning: 50,
    durationDays: 99,
    completedDays: 37,
    totalEarnedSoFar: 1850,
    nextEarning: "Tomorrow, 10:00 AM",
    startDate: "22 Aug 2026",
    color: "emerald"
  },
  {
    id: "INV-102",
    planName: "Growth Mini Plan",
    badge: "GROWTH",
    amount: 3000,
    dailyEarning: 30,
    durationDays: 99,
    completedDays: 15,
    totalEarnedSoFar: 450,
    nextEarning: "Tomorrow, 10:00 AM",
    startDate: "13 Sep 2026",
    color: "blue"
  }
];

export const investmentPlansList = [
  {
    id: "plan-starter",
    badge: "STARTER",
    name: "Starter Plan",
    investmentAmount: 5000,
    dailyEarning: 50,
    durationDays: 99,
    scheduledEarnings: 4950,
    roi: "99%",
    popular: false,
    color: "emerald",
    features: [
      "Daily automated payout",
      "Instant withdrawal eligible",
      "Standard priority support",
      "0% platform fees"
    ]
  },
  {
    id: "plan-growth",
    badge: "GROWTH",
    name: "Growth Plan",
    investmentAmount: 10000,
    dailyEarning: 100,
    durationDays: 99,
    scheduledEarnings: 9900,
    roi: "99%",
    popular: true,
    color: "blue",
    features: [
      "2x Higher Daily Yield",
      "Priority withdrawal processing",
      "Dedicated relationship manager",
      "Referral bonus boost eligible"
    ]
  },
  {
    id: "plan-premium",
    badge: "PREMIUM",
    name: "Premium Plan",
    investmentAmount: 25000,
    dailyEarning: 250,
    durationDays: 99,
    scheduledEarnings: 24750,
    roi: "99%",
    popular: false,
    color: "purple",
    features: [
      "Maximum Daily Return tier",
      "VIP Fast-track withdrawals",
      "1-on-1 Portfolio Advisor",
      "Exclusive quarterly dividend pool"
    ]
  },
  {
    id: "plan-elite",
    badge: "VIP ELITE",
    name: "Elite VIP Plan",
    investmentAmount: 50000,
    dailyEarning: 550,
    durationDays: 99,
    scheduledEarnings: 54450,
    roi: "108.9%",
    popular: false,
    color: "amber",
    features: [
      "Highest yield potential",
      "Instant 24/7 VIP desk support",
      "Custom payout schedule options",
      "Private investor club access"
    ]
  }
];

export const initialTransactionsList = [
  {
    id: "TXN-9081",
    type: "earning",
    title: "Daily Earnings",
    amount: 50.00,
    isPositive: true,
    date: "Today, 10:30 AM",
    rawDate: "2026-09-28T10:30:00",
    status: "Completed",
    category: "Earnings",
    reference: "Starter Plan payout #37"
  },
  {
    id: "TXN-9075",
    type: "investment",
    title: "Investment — Starter Plan",
    amount: 5000.00,
    isPositive: false,
    date: "27 Sep 2026",
    rawDate: "2026-09-27T14:15:00",
    status: "Completed",
    category: "Investments",
    reference: "INV-101 Activation"
  },
  {
    id: "TXN-9062",
    type: "referral",
    title: "Referral Bonus — Rahul Kumar",
    amount: 500.00,
    isPositive: true,
    date: "26 Sep 2026",
    rawDate: "2026-09-26T18:45:00",
    status: "Completed",
    category: "Referrals",
    reference: "10% reward on ₹5,000 deposit"
  },
  {
    id: "TXN-9040",
    type: "withdrawal",
    title: "Withdrawal to HDFC Bank",
    amount: 1000.00,
    isPositive: false,
    date: "25 Sep 2026",
    rawDate: "2026-09-25T11:20:00",
    status: "Processing",
    category: "Withdrawals",
    reference: "IMPS Ref: HDFC998271"
  },
  {
    id: "TXN-9022",
    type: "earning",
    title: "Daily Earnings",
    amount: 50.00,
    isPositive: true,
    date: "25 Sep 2026",
    rawDate: "2026-09-25T10:30:00",
    status: "Completed",
    category: "Earnings",
    reference: "Starter Plan payout #35"
  },
  {
    id: "TXN-9010",
    type: "deposit",
    title: "UPI Deposit",
    amount: 3000.00,
    isPositive: true,
    date: "22 Sep 2026",
    rawDate: "2026-09-22T16:10:00",
    status: "Completed",
    category: "Investments",
    reference: "UPI / PhonePe / 991823"
  },
  {
    id: "TXN-8994",
    type: "referral",
    title: "Referral Bonus — Priya Sharma",
    amount: 1000.00,
    isPositive: true,
    date: "15 Sep 2026",
    rawDate: "2026-09-15T19:00:00",
    status: "Completed",
    category: "Referrals",
    reference: "10% reward on ₹10,000 deposit"
  }
];

export const teamStatsData = {
  totalTeam: 25,
  activeTeam: 18,
  inactiveTeam: 7,
  totalReferralEarnings: 2450.00,
  referralRewardPercentage: "10%"
};

export const teamMembersList = [
  {
    id: "user-1",
    name: "Rahul Kumar",
    email: "rahul.k@example.com",
    status: "Active",
    investment: "₹5,000",
    joinedDate: "20 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80",
    rewardEarned: "₹500"
  },
  {
    id: "user-2",
    name: "Amit Kumar",
    email: "amit.k@example.com",
    status: "Inactive",
    investment: "—",
    joinedDate: "18 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80",
    rewardEarned: "₹0"
  },
  {
    id: "user-3",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    status: "Active",
    investment: "₹10,000",
    joinedDate: "15 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80",
    rewardEarned: "₹1,000"
  },
  {
    id: "user-4",
    name: "Vikram Singh",
    email: "vikram.s@example.com",
    status: "Active",
    investment: "₹25,000",
    joinedDate: "10 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=128&q=80",
    rewardEarned: "₹2,500"
  },
  {
    id: "user-5",
    name: "Neha Patel",
    email: "neha.p@example.com",
    status: "Inactive",
    investment: "—",
    joinedDate: "05 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=128&q=80",
    rewardEarned: "₹0"
  },
  {
    id: "user-6",
    name: "Suresh Verma",
    email: "suresh.v@example.com",
    status: "Active",
    investment: "₹5,000",
    joinedDate: "01 Sep 2026",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=128&q=80",
    rewardEarned: "₹500"
  }
];

export const referralHistoryList = [
  {
    id: "REF-101",
    memberName: "Rahul Kumar",
    action: "Deposit ₹5,000",
    reward: "+₹500",
    status: "Credited",
    date: "20 Sep 2026"
  },
  {
    id: "REF-102",
    memberName: "Priya Sharma",
    action: "Deposit ₹10,000",
    reward: "+₹1,000",
    status: "Credited",
    date: "15 Sep 2026"
  },
  {
    id: "REF-103",
    memberName: "Vikram Singh",
    action: "Deposit ₹25,000",
    reward: "+₹2,500",
    status: "Credited",
    date: "10 Sep 2026"
  }
];

export const initialBankAccounts = [
  {
    id: "BANK-01",
    bankName: "HDFC Bank",
    accountNumber: "XXXX XXXX 4521",
    rawAccountNumber: "50100452189912",
    holderName: "Rajan Kumar",
    ifscCode: "HDFC0004521",
    branch: "Connaught Place, New Delhi",
    status: "Verified",
    isDefault: true
  }
];

export const initialNotificationsList = [
  {
    id: "NOTIF-01",
    title: "Daily Earning Credited",
    description: "₹50.00 daily return from Starter Plan was successfully added to your balance.",
    timestamp: "Today, 10:30 AM",
    read: false,
    category: "Earnings",
    iconType: "dollar"
  },
  {
    id: "NOTIF-02",
    title: "Referral Reward Received",
    description: "You received +₹500 referral bonus for Rahul Kumar's new plan activation.",
    timestamp: "26 Sep 2026, 06:45 PM",
    read: false,
    category: "Referral",
    iconType: "users"
  },
  {
    id: "NOTIF-03",
    title: "Investment Activated",
    description: "Starter Plan (₹5,000) is now live and actively generating returns.",
    timestamp: "22 Aug 2026, 11:00 AM",
    read: true,
    category: "Investment",
    iconType: "trending"
  },
  {
    id: "NOTIF-04",
    title: "Withdrawal Processed",
    description: "Your withdrawal request of ₹1,000 to HDFC Bank has been submitted and is processing.",
    timestamp: "25 Sep 2026, 11:20 AM",
    read: true,
    category: "Withdrawal",
    iconType: "arrow-down"
  },
  {
    id: "NOTIF-05",
    title: "Bank Account Verified",
    description: "HDFC Bank (XXXX 4521) verification successfully completed by system.",
    timestamp: "18 Aug 2026, 04:15 PM",
    read: true,
    category: "Security",
    iconType: "check"
  }
];
