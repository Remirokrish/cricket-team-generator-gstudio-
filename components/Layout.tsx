import React, { useState } from 'react';
import { Menu, UserPlus, Users, Trophy, RotateCcw, X, Plus } from 'lucide-react';

type View = 'create-match' | 'add-player' | 'player-list';

interface LayoutProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onReset: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, onReset, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNav = (view: View) => {
    onChangeView(view);
    setIsSidebarOpen(false);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This will delete all players and match history.")) {
      onReset();
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-blue-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-blue-500/20 shadow-lg shadow-blue-900/10 z-30 flex-none h-16">
        <div className="flex items-center justify-between px-4 h-full max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-blue-400 hover:bg-slate-800 hover:text-blue-300 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-white tracking-wider truncate flex items-center gap-2">
              <span className="text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">⚡</span>
              CRICKET GEN
            </h1>
          </div>
          {currentView !== 'add-player' && (
             <button 
             onClick={() => onChangeView('add-player')}
             className="p-2 text-cyan-400 hover:bg-cyan-950/30 hover:shadow-neon-cyan rounded-full transition-all border border-transparent hover:border-cyan-500/50"
             title="Quick Add Player"
           >
             <Plus className="w-6 h-6" />
           </button>
          )}
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
          <h2 className="font-bold text-lg text-blue-400 tracking-wider">MENU</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-3">
          <button 
            onClick={() => handleNav('create-match')}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all border ${currentView === 'create-match' ? 'bg-blue-900/20 text-blue-400 border-blue-500/50 shadow-neon-blue' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-blue-300'}`}
          >
            <Trophy className="w-5 h-5 mr-3" />
            Create Match
          </button>
          
          <button 
            onClick={() => handleNav('add-player')}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all border ${currentView === 'add-player' ? 'bg-blue-900/20 text-blue-400 border-blue-500/50 shadow-neon-blue' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-blue-300'}`}
          >
            <UserPlus className="w-5 h-5 mr-3" />
            Add New Player
          </button>

          <button 
            onClick={() => handleNav('player-list')}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all border ${currentView === 'player-list' ? 'bg-blue-900/20 text-blue-400 border-blue-500/50 shadow-neon-blue' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-blue-300'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Player List
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button 
              onClick={handleReset}
              className="flex items-center w-full px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all"
            >
              <RotateCcw className="w-5 h-5 mr-3" />
              Reset All Data
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <div className="h-full w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};