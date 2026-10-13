import React, { useState } from 'react';
import { 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  Sparkles,
  RotateCcw 
} from 'lucide-react';
import { FormulaExplanationResult, ExcelLanguage } from '../types';
import { InteractiveSpreadsheet } from './InteractiveSpreadsheet';
import { copyFormulaToClipboard } from '../utils/clipboard';

interface FormulaExplainerProps {
  language: ExcelLanguage;
  initialFormula?: string;
}

export const FormulaExplainer: React.FC<FormulaExplainerProps> = ({ 
  language,
  initialFormula = ''
}) => {
  const [formulaInput, setFormulaInput] = useState(initialFormula);

  React.useEffect(() => {
    if (initialFormula) {
      setFormulaInput(initialFormula);
    }
  }, [initialFormula]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormulaExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTrans, setCopiedTrans] = useState(false);

  // Ready to test formulas including the 5 French essential functions
  const SAMPLE_FORMULAS = [
    {
      title: 'SOMME (Total)',
      code: '=SOMME(B2:B10)'
    },
    {
      title: 'SI (Condition)',
      code: '=SI(B2>=10; "Admis"; "Recalé")'
    },
    {
      title: 'RECHERCHEV (Catalogue)',
      code: '=RECHERCHEV(D2; A2:B10; 2; FAUX)'
    },
    {
      title: 'NB.SI (Comptage)',
      code: '=NB.SI(B2:B10; "Validé")'
    },
    {
      title: 'SOMME.SI (Filtre + Somme)',
      code: '=SOMME.SI(B2:B10; "Paris"; C2:C10)'
    },
    {
      title: 'Conditions multiples SI + ET',
      code: '=SI(ET(B2>=1000; C2="Validé"); B2*0,15; 0)'
    }
  ];

  const handleExplain = async (e?: React.FormEvent, customFormula?: string) => {
    if (e) e.preventDefault();
    const activeFormula = customFormula || formulaInput;
    if (!activeFormula.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/explain-formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formula: activeFormula,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'explication');
      }

      const data: FormulaExplanationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Impossible d\'expliquer la formule pour le moment. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const copyTranslated = async () => {
    if (!result?.translatedFormula) return;
    const ok = await copyFormulaToClipboard(result.translatedFormula);
    if (ok) {
      setCopiedTrans(true);
      setTimeout(() => setCopiedTrans(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Explicateur Pédagogique de Formules</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Collez une formule complexe, nous la traduisons en français simple
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Idéal pour déchiffrer les fichiers de vos collègues, comprendre les calculs imbriqués et apprendre le rôle de chaque fonction.
          </p>
        </div>

        <form onSubmit={handleExplain} className="mt-5 space-y-4">
          <div>
            <label htmlFor="formula-paste" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Formule Excel à expliquer :
            </label>
            <div className="relative">
              <input
                id="formula-paste"
                type="text"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                placeholder="Ex : =SI.NON.DISP(RECHERCHEX(A2; Données!A:A; Données!C:C); &quot;Client absent&quot;)"
                className="w-full px-3.5 py-3 text-sm font-mono rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition"
              />
            </div>
          </div>

          {/* Quick test formulas */}
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1.5">
              Formules courantes à tester en 1 clic :
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_FORMULAS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormulaInput(sample.code);
                    handleExplain(undefined, sample.code);
                  }}
                  className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-3 py-1.5 rounded-lg transition text-slate-700 cursor-pointer active:scale-95"
                >
                  <span className="font-semibold">{sample.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            {(formulaInput || result) && (
              <button
                type="button"
                onClick={() => {
                  setFormulaInput('');
                  setResult(null);
                  setError(null);
                }}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition cursor-pointer active:scale-95 border border-slate-200 shadow-2xs"
                title="Effacer la formule et réinitialiser l'écran"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Réinitialiser</span>
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !formulaInput.trim()}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:cursor-not-allowed active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyse pédagogique en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Expliquer cette formule</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Explanation Result */}
      {result && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Summary banner */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white">
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold block mb-1">
                Ce que fait cette formule :
              </span>
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                "{result.summary}"
              </p>
            </div>

            {/* Translation block */}
            {result.translatedFormula && (
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Traduction de la formule (FR ↔ EN) :</span>
                  <div className="font-mono font-semibold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 mt-1 inline-block">
                    {result.translatedFormula}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={copyTranslated}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md transition shadow-2xs font-medium"
                >
                  {copiedTrans ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTrans ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            )}

            <div className="p-5 space-y-6">
              {/* Step by step breakdown */}
              <div>
                <h2 className="text-xs uppercase font-semibold text-slate-500 tracking-wider flex items-center gap-1.5 mb-3">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Ordre d'exécution logique par Excel</span>
                </h2>
                <div className="space-y-2">
                  {result.breakdown.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functions Glossary */}
              {result.functionsUsed && result.functionsUsed.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase font-semibold text-slate-500 tracking-wider flex items-center gap-1.5 mb-3">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Fonctions utilisées dans ce calcul</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.functionsUsed.map((fn, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {fn.name}
                          </span>
                          {fn.englishName && (
                            <span className="text-[11px] text-slate-500">
                              Anglais : {fn.englishName}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-1.5 leading-normal">{fn.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Edge Cases & Pitfalls */}
              {result.edgeCases && result.edgeCases.length > 0 && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Pièges fréquents à surveiller pour cette formule :</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1">
                    {result.edgeCases.map((trap, idx) => (
                      <li key={idx}>{trap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Spreadsheet preview */}
          {result.sampleData && (
            <InteractiveSpreadsheet
              data={result.sampleData}
              formula={formulaInput}
              title="Simulation interactive de la formule"
              subtitle="Voici comment Excel traite les données avec ce calcul"
            />
          )}
        </div>
      )}
    </div>
  );
};
