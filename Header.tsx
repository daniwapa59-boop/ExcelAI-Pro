import React from 'react';
import { 
  Sparkles, 
  FileSpreadsheet, 
  HelpCircle, 
  Wrench, 
  BookOpen, 
  MessageSquare, 
  Bookmark, 
  Crown,
  Globe2,
  Menu,
  X,
  History,
  Layers
} from 'lucide-react';
import { ExcelLanguage, ExcelVersion } from '../types';

export type ActiveTab = 'generator' | 'categories' | 'explainer' | 'troubleshooter' | 'examples' | 'assistant';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: ExcelLanguage;
  setLanguage: (lang: ExcelLanguage) => void;
  excelVersion: ExcelVersion;
  setExcelVersion: (v: ExcelVersion) => void;
  onOpenFavorites: () => void;
  onOpenHistory: () => void;
  onOpenProModal: () => void;
  favoritesCount: number;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  excelVersion,
  setExcelVersion,
  onOpenFavorites,
  onOpenHistory,
  onOpenProModal,
  favoritesCount,
  historyCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'generator', label: 'Générateur', icon: Sparkles, desc: 'Texte vers Formule' },
    { id: 'categories', label: 'Catégories', icon: Layers, desc: 'Calculs, Recherche, Texte...' },
    { id: 'explainer', label: 'Explicateur', icon: HelpCircle, desc: 'Comprendre un calcul' },
    { id: 'troubleshooter', label: 'Dépanneur', icon: Wrench, desc: 'Corriger #REF, #N/A...' },
    { id: 'examples', label: 'Exemples', icon: BookOpen, desc: 'Cas d\'usage concrets' },
    { id: 'assistant', label: 'Espace Libre', icon: MessageSquare, desc: 'Poser n\'importe quelle question' },
  ] as const;

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="border-b border-emerald-700/60 bg-emerald-900/40 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/20">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base text-white">ExcelAI Pro</span>
                <span className="text-[10px] font-semibold bg-emerald-700/80 text-emerald-100 px-1.5 py-0.5 rounded border border-emerald-600/50">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 hidden sm:block">
                L'assistant intelligent pour maîtriser Microsoft Excel
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Syntax selector (FR / EN) */}
            <div className="flex items-center bg-emerald-950/50 p-0.5 rounded-md border border-emerald-700/50 text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded transition font-medium ${
                  language === 'fr' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Syntaxe française (séparateur point-virgule ;)"
              >
                FR (;)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition font-medium ${
                  language === 'en' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-emerald-300 hover:text-white'
                }`}
                title="Syntaxe anglaise (séparateur virgule ,)"
              >
                EN (,)
              </button>
            </div>

            {/* Version picker */}
            <select
              value={excelVersion}
              onChange={(e) => setExcelVersion(e.target.value as ExcelVersion)}
              className="bg-emerald-950/50 text-emerald-200 hover:text-white text-xs border border-emerald-700/50 rounded-md px-2 py-1 outline-none cursor-pointer hidden md:block"
            >
              <option value="365" className="bg-slate-900 text-white">Excel 365 (XLOOKUP, LET)</option>
              <option value="2021" className="bg-slate-900 text-white">Excel 2021</option>
              <option value="2019" className="bg-slate-900 text-white">Excel 2019 / 2016</option>
              <option value="google-sheets" className="bg-slate-900 text-white">Google Sheets</option>
            </select>

            {/* Formula History Button */}
            <button
              type="button"
              onClick={onOpenHistory}
              className="relative p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-900/60 hover:bg-emerald-700 border border-emerald-700 text-emerald-200 hover:text-white flex items-center gap-1.5 transition text-xs cursor-pointer min-h-[34px]"
              title="Historique des formules générées"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Historique</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-emerald-400 text-slate-900 font-bold rounded-full">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Saved Formulas Button */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="relative p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-900/60 hover:bg-emerald-700 border border-emerald-700 text-emerald-200 hover:text-white flex items-center gap-1.5 transition text-xs cursor-pointer min-h-[34px]"
              title="Mes formules sauvegardées"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Favoris</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-900 font-bold rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Pro Upgrade Button */}
            <button
              type="button"
              onClick={onOpenProModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-400 hover:bg-amber-300 text-slate-900 shadow-sm transition"
            >
              <Crown className="w-3.5 h-3.5 text-slate-900" />
              <span>Pro</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Ribbon Navigation (Desktop) */}
      <nav className="max-w-7xl mx-auto px-4 hidden md:flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-lg transition border-b-2 ${
                  isActive
                    ? 'bg-slate-50 text-emerald-900 border-white shadow-xs font-semibold'
                    : 'text-emerald-100 hover:bg-emerald-700/60 hover:text-white border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-emerald-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-emerald-200 hidden lg:flex items-center gap-2">
          <span>Mode connecté</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-700 bg-emerald-900 px-4 py-3 space-y-2">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-300 shrink-0" />
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div className="text-[11px] text-emerald-300/80 font-normal">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800">
            <button
              type="button"
              onClick={() => {
                onOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-emerald-800 text-xs font-semibold text-emerald-100 hover:text-white min-h-[44px] cursor-pointer"
            >
              <History className="w-4 h-4 text-emerald-300" />
              <span>Historique ({historyCount})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-emerald-800 text-xs font-semibold text-emerald-100 hover:text-white min-h-[44px] cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span>Favoris ({favoritesCount})</span>
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-300">
            <span>Version ciblée :</span>
            <select
              value={excelVersion}
              onChange={(e) => setExcelVersion(e.target.value as ExcelVersion)}
              className="bg-emerald-950 text-white text-xs border border-emerald-700 rounded px-2 py-1 min-h-[38px]"
            >
              <option value="365">Excel 365</option>
              <option value="2021">Excel 2021</option>
              <option value="2019">Excel 2019/2016</option>
              <option value="google-sheets">Google Sheets</option>
            </select>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for Android & Smartphones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-between shadow-lg overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as ActiveTab)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 min-w-[52px] shrink-0 min-h-[48px] text-[10px] font-medium transition active:scale-95 cursor-pointer ${
                isActive ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-md transition ${isActive ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[54px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
