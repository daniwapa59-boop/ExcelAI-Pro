import React, { useState, useMemo } from 'react';
import { 
  X, 
  History, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileQuestion,
  Filter,
  HelpCircle
} from 'lucide-react';
import { FormulaHistoryItem } from '../types';
import { copyFormulaToClipboard } from '../utils/clipboard';

interface FormulaHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: FormulaHistoryItem[];
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
  onSelectFormula: (formula: string, prompt?: string) => void;
}

// Accent-tolerant text normalization for smart French searching
const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export const FormulaHistoryModal: React.FC<FormulaHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRemoveItem,
  onSelectFormula,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Instant live filtering on keystroke, matching formula name, prompt words, or English equivalent
  // Must be called unconditionally before any early returns to respect the Rules of Hooks
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = normalizeText(searchQuery);

    return history.filter((item) => {
      const normFormula = normalizeText(item.formula);
      const normPrompt = normalizeText(item.prompt);
      const normEnglish = item.formulaEnglish ? normalizeText(item.formulaEnglish) : '';
      return (
        normFormula.includes(query) ||
        normPrompt.includes(query) ||
        normEnglish.includes(query)
      );
    });
  }, [history, searchQuery]);

  if (!isOpen) return null;

  const handleCopy = async (id: string, formula: string) => {
    const ok = await copyFormulaToClipboard(formula);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const dateStr = d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateStr} à ${timeStr}`;
  };

  // Quick search keywords for mobile one-tap filtering
  const QUICK_SEARCH_FILTERS = ['SOMME', 'SI', 'RECHERCHEV', 'NB.SI', 'SOMME.SI'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <History className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Historique des formules
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {history.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Enregistrées automatiquement sur votre appareil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search bar & Actions bar */}
        {history.length > 0 && (
          <div className="p-3 sm:p-4 bg-white border-b border-slate-200 space-y-2.5">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Search input with live automatic filtering */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par formule (SOMME, SI...) ou mots de la demande..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none bg-slate-50/70 focus:bg-white transition min-h-[44px]"
                  autoComplete="off"
                  spellCheck="false"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition cursor-pointer"
                    title="Effacer la recherche"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Clear full history button */}
              <button
                type="button"
                onClick={() => setShowConfirmClear(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition min-h-[44px] cursor-pointer shrink-0 active:scale-95"
                title="Supprimer toutes les formules enregistrées"
              >
                <Trash2 className="w-4 h-4" />
                <span>Effacer l'historique</span>
              </button>
            </div>

            {/* Quick 1-tap search filters for mobile & desktop */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" />
                Filtre rapide :
              </span>
              {QUICK_SEARCH_FILTERS.map((fnName) => {
                const isActive = searchQuery.toLowerCase().includes(fnName.toLowerCase());
                return (
                  <button
                    key={fnName}
                    type="button"
                    onClick={() => setSearchQuery(isActive ? '' : fnName)}
                    className={`text-[11px] font-mono px-2 py-1 rounded-md border transition cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
                    }`}
                  >
                    {fnName}
                  </button>
                );
              })}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-auto cursor-pointer"
                >
                  Tout réinitialiser
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content list */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
          {history.length === 0 ? (
            /* Empty history initial state */
            <div className="py-16 text-center text-slate-500 text-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">
                Aucune formule dans l'historique
              </p>
              <p className="mt-1 text-slate-500 max-w-sm mx-auto">
                Chaque fois que vous concevez une formule dans le Générateur, elle sera automatiquement mémorisée ici avec sa date et son heure.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            /* Clear message when search has zero matches */
            <div className="py-12 px-4 text-center bg-white border border-slate-200 rounded-xl my-2 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Aucune formule ne correspond à votre recherche
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  Aucun résultat trouvé pour <strong className="text-slate-800">« {searchQuery} »</strong>. Essayez avec le nom d'une fonction (ex : <em>SOMME, SI, RECHERCHEV, NB.SI</em>) ou un mot-clé de votre demande initiale (ex : <em>ventes, prime, montant</em>).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer min-h-[40px] active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Effacer la recherche</span>
              </button>
            </div>
          ) : (
            /* Filtered results list */
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs hover:border-emerald-300 transition"
              >
                {/* Header row: Prompt & Date/Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-semibold text-slate-800 line-clamp-2">
                    « {item.prompt} »
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                {/* Formula box */}
                <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm rounded-lg overflow-x-auto break-all selection:bg-emerald-700 selection:text-white">
                  <code>{item.formula}</code>
                </div>

                {/* Footer row: Actions & copy */}
                <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">
                    Syntaxe : <strong className="text-slate-700">{item.language === 'fr' ? 'FR (;)' : 'EN (,)'}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Copy formula button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.formula)}
                      className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition active:scale-95 cursor-pointer shadow-2xs"
                      title="Copier la formule dans le presse-papier"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>

                    {/* Reuse in generator */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectFormula(item.formula, item.prompt);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 min-h-[40px] px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg transition active:scale-95 cursor-pointer"
                      title="Réutiliser dans le générateur"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Réutiliser</span>
                    </button>

                    {/* Explain formula */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectFormula(item.formula);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 min-h-[40px] px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition active:scale-95 cursor-pointer"
                      title="Expliquer cette formule"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Expliquer</span>
                    </button>

                    {/* Single delete button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                      title="Supprimer cette formule de l'historique"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {searchQuery
              ? `${filteredHistory.length} sur ${history.length} formule${history.length > 1 ? 's' : ''}`
              : `${history.length} formule${history.length > 1 ? 's' : ''} mémorisée${history.length > 1 ? 's' : ''}`}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 min-h-[44px] text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition cursor-pointer active:scale-95 shadow-2xs"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* Confirmation Modal before clearing full history */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Effacer tout l'historique ?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer les {history.length} formules enregistrées ? Cette action est irréversible.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 min-h-[44px] py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer active:scale-95"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="flex-1 min-h-[44px] py-2 px-3 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer active:scale-95 shadow-xs"
              >
                Oui, effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
