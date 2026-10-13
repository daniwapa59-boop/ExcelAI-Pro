import React from 'react';
import { X, Bookmark, Trash2, Copy, Check, ExternalLink } from 'lucide-react';
import { SavedFormula } from '../types';
import { copyFormulaToClipboard } from '../utils/clipboard';

interface FavoritesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SavedFormula[];
  onRemoveFavorite: (id: string) => void;
  onSelectFormula: (formula: string) => void;
}

export const FavoritesHistoryModal: React.FC<FavoritesHistoryModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectFormula,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (id: string, formula: string) => {
    const ok = await copyFormulaToClipboard(formula);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-slate-900">
              Mes Formules Sauvegardées ({favorites.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">Aucune formule sauvegardée</p>
              <p className="mt-1">
                Cliquez sur le bouton "Sauvegarder" dans le Générateur pour conserver vos formules préférées.
              </p>
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 line-clamp-1">{fav.title}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(fav.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2 rounded break-all">
                  {fav.formula}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-medium">
                    {fav.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(fav.id, fav.formula)}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                    >
                      {copiedId === fav.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === fav.id ? 'Copié' : 'Copier'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectFormula(fav.formula);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Expliquer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
