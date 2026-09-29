import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1.5 p-1.5 bg-[#061F15] border border-emerald-500/16 rounded-2xl overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 focus:outline-none select-none ${
              isActive
                ? 'bg-[#123A29] text-[#34D399] border border-emerald-500/30 shadow-md shadow-[#031C12]'
                : 'text-[#71857A] hover:text-[#F8FAFC] hover:bg-[#0A261A]'
            }`}
          >
            {tab.icon && <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F4D06F]' : ''}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                isActive ? 'bg-amber-400/20 text-[#F4D06F]' : 'bg-[#0A261A] text-[#71857A]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
