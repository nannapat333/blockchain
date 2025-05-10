import React, { useState } from 'react';

export function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].label);

  return (
    <div>
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`px-4 py-2 -mb-px ${active === tab.label ? 'border-b-2 border-yellow-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActive(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.find((tab) => tab.label === active)?.content}
      </div>
    </div>
  );
}