import React, { useState } from 'react';
import { 
  Wrench, 
  AlertOctagon, 
  Copy, 
  Check, 
  ShieldCheck, 
  Loader2, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  ListOrdered
} from 'lucide-react';
import { EXCEL_ERRORS_CATALOG, ExcelErrorInfo } from '../data/excelErrors';
import { ErrorDiagnosisResult, ExcelLanguage } from '../types';
import { copyFormulaToClipboard } from '../utils/clipboard';

interface ErrorTroubleshooterProps {
  language: ExcelLanguage;
}

export const ErrorTroubleshooter: React.FC<ErrorTroubleshooterProps> = ({ language }) => {
  const [selectedErrorTab, setSelectedErrorTab] = useState<string>('#REF!');
  const [userFormula, setUserFormula] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<ErrorDiagnosisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedFixed, setCopiedFixed] = useState(false);
  const [copiedSafe, setCopiedSafe] = useState(false);

  const activeCatalogItem = EXCEL_ERRORS_CATALOG.find(e => e.code === selectedErrorTab) || EXCEL_ERRORS_CATALOG[0];

  const handleDiagnose = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/fix-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorCode: selectedErrorTab,
          formula: userFormula,
          description: userDescription,
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du diagnostic');
      }

      const data: ErrorDiagnosisResult = await response.json();
      setDiagnosis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Impossible de diagnostiquer l\'erreur pour le moment. Consultez le guide ci-dessous.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string, type: 'fixed' | 'safe') => {
    const ok = await copyFormulaToClipboard(text);
    if (ok) {
      if (type === 'fixed') {
        setCopiedFixed(true);
        setTimeout(() => setCopiedFixed(false), 2000);
      } else {
        setCopiedSafe(true);
        setTimeout(() => setCopiedSafe(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold tracking-wide uppercase mb-1">
            <AlertOctagon className="w-4 h-4" />
            <span>Centre de Dépannage & Correction d'Erreurs Excel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Résolvez les erreurs #REF!, #N/A, #VALEUR! en quelques secondes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Comprenez d'où vient l'anomalie et obtenez une formule corrigée et blindée avec protection automatique contre les erreurs.
          </p>
        </div>

        {/* Quick error selector buttons */}
        <div className="mt-5">
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            1. Choisissez le code d'erreur affiché dans votre cellule :
          </span>
          <div className="flex flex-wrap gap-2">
            {EXCEL_ERRORS_CATALOG.map((err) => {
              const isSelected = selectedErrorTab === err.code;
              return (
                <button
                  key={err.code}
                  type="button"
                  onClick={() => {
                    setSelectedErrorTab(err.code);
                    setDiagnosis(null);
                  }}
                  className={`px-3 py-2 text-xs font-mono font-bold rounded-lg border transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{err.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional customized inputs */}
        <form onSubmit={handleDiagnose} className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <span className="text-xs font-semibold text-slate-800 block">
            2. (Optionnel) Décrivez votre situation pour un diagnostic sur-mesure par l'IA :
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label htmlFor="user-formula-err" className="block text-xs font-medium text-slate-700 mb-1">
                Votre formule actuelle (celle qui affiche l'erreur) :
              </label>
              <input
                id="user-formula-err"
                type="text"
                value={userFormula}
                onChange={(e) => setUserFormula(e.target.value)}
                placeholder="Ex : =RECHERCHEV(A2; Clients!A:E; 4; FAUX)"
                className="w-full px-3 py-2 text-xs font-mono rounded border border-slate-300 bg-white focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label htmlFor="user-desc-err" className="block text-xs font-medium text-slate-700 mb-1">
                Ce qui s'est passé (action récente) :
              </label>
              <input
                id="user-desc-err"
                type="text"
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Ex : J'ai supprimé la colonne C et la référence est devenue cassée..."
                className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyse du problème...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Diagnostiquer avec l'IA</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* AI Custom Diagnosis Result */}
      {diagnosis && (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-emerald-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-sm">Diagnostic Personnalisé & Solutions Recommandées</span>
            </div>
            <span className="font-mono text-xs bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
              {diagnosis.errorType}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider block mb-1">
                Pourquoi cela arrive :
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {diagnosis.diagnosis}
              </p>
            </div>

            {/* Formulas Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* Corrected Formula */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Formule corrigée :</span>
                  <button
                    type="button"
                    onClick={() => copyText(diagnosis.solutionFormula, 'fixed')}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-100"
                  >
                    {copiedFixed ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFixed ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-900 bg-white p-2 rounded border border-slate-200 break-all">
                  {diagnosis.solutionFormula}
                </div>
              </div>

              {/* Safe Formula */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Formule sécurisée (Anti-Erreurs) :
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(diagnosis.safeFormula, 'safe')}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-1 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                  >
                    {copiedSafe ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSafe ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-emerald-950 bg-white p-2 rounded border border-emerald-300 break-all">
                  {diagnosis.safeFormula}
                </div>
              </div>
            </div>

            {/* Action Checklist */}
            {diagnosis.actionSteps && diagnosis.actionSteps.length > 0 && (
              <div className="pt-2">
                <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider flex items-center gap-1.5 mb-2">
                  <ListOrdered className="w-4 h-4 text-emerald-600" />
                  Étapes concrètes pour régler le problème dans Excel
                </span>
                <div className="space-y-1.5">
                  {diagnosis.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comprehensive Catalog Card for the Selected Error */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                {activeCatalogItem.code}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {activeCatalogItem.name}
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Guide officiel de résolution
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            {activeCatalogItem.shortDesc}
          </p>
        </div>

        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Main cause */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">
              Cause principale :
            </h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
              {activeCatalogItem.mainCause}
            </p>
          </div>

          {/* Common scenarios */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-1.5">
              Scénarios les plus fréquents :
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              {activeCatalogItem.commonScenarios.map((scen, idx) => (
                <li key={idx}>{scen}</li>
              ))}
            </ul>
          </div>

          {/* Solution & Examples */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-3">
            <div>
              <span className="font-semibold text-emerald-900 block mb-1">
                Solution immédiate :
              </span>
              <p className="text-emerald-950 text-xs sm:text-sm">
                {activeCatalogItem.quickFix}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs pt-1">
              <div className="bg-rose-50 border border-rose-200 p-2 rounded">
                <span className="text-rose-700 font-sans font-semibold text-[11px] block mb-0.5">
                  À éviter (provoque l'erreur) :
                </span>
                <span className="text-rose-900">{activeCatalogItem.exampleBroken}</span>
              </div>
              <div className="bg-emerald-100/60 border border-emerald-300 p-2 rounded">
                <span className="text-emerald-800 font-sans font-semibold text-[11px] block mb-0.5">
                  Bonne pratique :
                </span>
                <span className="text-emerald-950">{activeCatalogItem.exampleFixed}</span>
              </div>
            </div>
          </div>

          {/* Pro tip */}
          <div className="text-xs text-slate-500 flex items-start gap-2 pt-1 border-t border-slate-100">
            <span className="font-semibold text-slate-700 shrink-0">Astuce Pro :</span>
            <span>{activeCatalogItem.proTip}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
