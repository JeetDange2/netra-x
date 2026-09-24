import React, { useState } from 'react';
import { useMission } from '../../context/MissionContext';
import { ScrollText, Search, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audioAlert';

export const MissionLog = () => {
  const { missionLogs } = useMission();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredLogs = missionLogs.filter(log => {
    const matchesSearch = log.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const exportLogs = () => {
    soundManager.playSuccess();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(missionLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NETRA_X_MISSION_LOG_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-mine-surface border border-mine-border rounded-xl p-3 sm:p-4 shadow-md flex flex-col h-full font-mono select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-mine-border">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Chronological Mission Event Stream
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3 h-3 text-mine-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-mine-darkest border border-mine-border rounded-lg px-2.5 py-1 pl-7 text-xs text-white placeholder-mine-muted focus:outline-none focus:border-cyan-500 w-32 sm:w-36 transition"
            />
          </div>

          {/* Export JSON Button */}
          <button
            onClick={exportLogs}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-mine-card hover:bg-mine-hover border border-mine-border text-mine-subtext hover:text-white transition shadow-sm"
            title="Download mission evidence telemetry"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1 py-2 text-[10px] overflow-x-auto">
        {['ALL', 'MISSION', 'SURVIVOR', 'HAZARD', 'NAVIGATION', 'ROBOTICS', 'SYSTEM'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundManager.playClick();
              setCategoryFilter(cat);
            }}
            className={`px-2 py-0.5 rounded-md transition whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold shadow-sm'
                : 'text-mine-muted hover:text-white bg-mine-darkest border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="flex-1 overflow-y-auto space-y-1.5 mt-1 pr-1 max-h-[380px]">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-mine-muted text-xs py-10">
            No events found matching filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            let catBadge = 'bg-cyan-950 text-cyan-400 border-cyan-800';
            if (log.category === 'SURVIVOR') catBadge = 'bg-orange-950 text-orange-400 border-orange-700 font-bold';
            else if (log.category === 'HAZARD') catBadge = 'bg-red-950 text-red-400 border-red-700 font-bold';
            else if (log.category === 'OBSTACLE') catBadge = 'bg-amber-950 text-amber-400 border-amber-700';

            return (
              <div 
                key={log.id} 
                className="flex items-start gap-2.5 p-2 rounded-lg bg-mine-card/60 hover:bg-mine-card border border-mine-border/50 text-xs transition"
              >
                <span className="text-mine-muted text-[11px] shrink-0">{log.time}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-bold shrink-0 ${catBadge}`}>
                  {log.category}
                </span>
                <span className="text-white/95 text-[11px] leading-snug">{log.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
