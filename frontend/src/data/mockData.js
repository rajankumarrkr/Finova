export const initialUserData = {
  name: "User",
  email: "user@finova.app",
  phone: "+91 00000 00000",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
  referralCode: "FINOVA50",
  memberSince: "Today",
  kycStatus: "Verified",
  balances: {
    totalBalance: 0.00,
    availableBalance: 0.00,
    totalInvested: 0.00,
    totalEarnings: 0.00,
    todayEarnings: 0.00,
    referralEarnings: 0.00,
    withdrawableBalance: 0.00
  },
  stats: {
    activeInvestmentsCount: 0,
    completedPlansCount: 0,
    lifetimeInvested: 0.00
  }
};

export const chartTimeframeData = {
  "1D": [
    { time: "09:00 AM", value: 0 },
    { time: "11:00 AM", value: 0 },
    { time: "01:00 PM", value: 0 },
    { time: "03:00 PM", value: 0 },
    { time: "05:00 PM", value: 0 }
  ],
  "1W": [
    { time: "Mon", value: 0 },
    { time: "Tue", value: 0 },
    { time: "Wed", value: 0 },
    { time: "Thu", value: 0 },
    { time: "Fri", value: 0 },
    { time: "Sat", value: 0 },
    { time: "Sun", value: 0 }
  ],
  "1M": [
    { time: "1 Sep", value: 0 },
    { time: "7 Sep", value: 0 },
    { time: "14 Sep", value: 0 },
    { time: "21 Sep", value: 0 },
    { time: "28 Sep", value: 0 }
  ],
  "3M": [
    { time: "Jul", value: 0 },
    { time: "Aug", value: 0 },
    { time: "Sep", value: 0 }
  ],
  "1Y": [
    { time: "Oct 25", value: 0 },
    { time: "Dec 25", value: 0 },
    { time: "Feb 26", value: 0 },
    { time: "Apr 26", value: 0 },
    { time: "Jun 26", value: 0 },
    { time: "Aug 26", value: 0 },
    { time: "Sep 26", value: 0 }
  ]
};

export const activeInvestmentsList = [];

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

export const initialTransactionsList = [];

export const teamStatsData = {
  totalTeam: 0,
  activeTeam: 0,
  inactiveTeam: 0,
  totalReferralEarnings: 0.00,
  referralRewardPercentage: "10%"
};

export const teamMembersList = [];

export const referralHistoryList = [];

export const initialBankAccounts = [];

export const initialNotificationsList = [];
