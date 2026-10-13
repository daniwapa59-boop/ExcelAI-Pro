import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  ArrowRight, 
  Info, 
  Lightbulb, 
  Loader2, 
  CheckCircle2,
  BookOpen,
  HelpCircle,
  History,
  Clock,
  RotateCcw
} from 'lucide-react';
import { FormulaGenerationResult, ExcelLanguage, ExcelVersion } from '../types';
import { InteractiveSpreadsheet } from './InteractiveSpreadsheet';
import { TOP_5_FRENCH_FUNCTIONS } from '../data/frenchFunctions';
import { copyFormulaToClipboard } from '../utils/clipboard';
import { generateLocalFormula } from '../utils/formulaEngine';

interface FormulaGeneratorProps {
  language: ExcelLanguage;
  excelVersion: ExcelVersion;
  onSaveFormula: (title: string, formula: string, category: string) => void;
  initialPrompt?: string;
  onAddToHistory?: (item: { prompt: string; formula: string; formulaEnglish?: string; language: ExcelLanguage }) => void;
  onOpenHistory?: () => void;
  historyCount?: number;
  onExplainFormula?: (formula: string) => void;
  onReset?: () => void;
}

export const FormulaGenerator: React.FC<FormulaGeneratorProps> = ({
  language,
  excelVersion,
  onSaveFormula,
  initialPrompt = '',
  onAddToHistory,
  onOpenHistory,
  historyCount = 0,
  onExplainFormula,
  onReset
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);

  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const [context, setContext] = useState('');
  const [showAdvancedContext, setShowAdvancedContext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormulaGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedMain, setCopiedMain] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedQuickFn, setSelectedQuickFn] = useState<string | null>(null);
  const [showBeginnerHelp, setShowBeginnerHelp] = useState(false);

  // Suggested prompts for beginners
  const QUICK_PROMPTS = [
    'Calculer la somme de la colonne B de la ligne 2 à 6',
    'Si la note en B2 >= 10 afficher "Admis", sinon "Recalé"',
    'Chercher le prix de l\'article en D2 dans le tableau A2:B6',
    'Compter combien de fois le statut "Validé" apparaît en colonne B',
    'Calculer la somme des montants en colonne C où la ville en B est "Paris"'
  ];

  const handleSelectFrenchFunction = (fnName: string) => {
    const fnCard = TOP_5_FRENCH_FUNCTIONS.find(f => f.name === fnName);
    if (fnCard) {
      setSelectedQuickFn(fnName);
      setPrompt(fnCard.promptExample);
    }
  };

  const handleGenerate = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const activePrompt = customPrompt || prompt;
    if (!activePrompt.trim()) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch('/api/generate-formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          excelVersion,
          language,
          context
        })
      });

      let data: FormulaGenerationResult;
      if (response.ok) {
        data = await response.json();
      } else {
        // Transparent fallback to local formula engine if server is slow or offline
        data = generateLocalFormula(activePrompt, language, excelVersion, context);
      }

      setResult(data);

      // Auto-save to formula history with timestamp
      if (onAddToHistory) {
        onAddToHistory({
          prompt: activePrompt,
          formula: data.formula,
          formulaEnglish: data.formulaEnglish,
          language
        });
      }
    } catch {
      // Local fallback on any network failure
      const fallbackData = generateLocalFormula(activePrompt, language, excelVersion, context);
      setResult(fallbackData);
      if (onAddToHistory) {
        onAddToHistory({
          prompt: activePrompt,
          formula: fallbackData.formula,
          formulaEnglish: fallbackData.formulaEnglish,
          language
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    const ok = await copyFormulaToClipboard(text);
    if (ok) {
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2500);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveFormula(
      prompt.slice(0, 40) + (prompt.length > 40 ? '...' : ''),
      result.formula,
      'Générée par IA'
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setPrompt('');
    setResult(null);
    setContext('');
    setShowAdvancedContext(false);
    setError(null);
    setSelectedQuickFn(null);
    setShowBeginnerHelp(false);
    setCopiedMain(false);
    setSaved(false);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 Flagship French Functions Quick Bar */}
      <div className="bg-white rounded-xl border border-emerald-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Les 5 Fonctions Excel Indispensables en Français
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowBeginnerHelp(!showBeginnerHelp)}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showBeginnerHelp ? 'Masquer le guide' : 'Guide débutant'}</span>
          </button>
        </div>

        {/* Function Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TOP_5_FRENCH_FUNCTIONS.map((fn) => {
            const isSelected = selectedQuickFn === fn.name;
            return (
              <button
                key={fn.name}
                type="button"
                onClick={() => handleSelectFrenchFunction(fn.name)}
                className={`p-2.5 rounded-lg border text-left transition cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs sm:text-sm text-emerald-900">
                    {fn.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {fn.englishName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                  {fn.roleShort}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Function Details & Instant Run */}
        {selectedQuickFn && (() => {
          const activeFn = TOP_5_FRENCH_FUNCTIONS.find(f => f.name === selectedQuickFn);
          if (!activeFn) return null;
          return (
            <div className="mt-3.5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-emerald-950 font-bold font-mono">{activeFn.syntax}</strong>
                  <span className="text-slate-500 text-[11px]">· {activeFn.descriptionSimple}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  💡 <strong>Astuce :</strong> {activeFn.tips}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleGenerate(undefined, activeFn.promptExample)}
                className="w-full sm:w-auto shrink-0 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-md shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Générer cet exemple</span>
              </button>
            </div>
          );
        })()}

        {/* Beginner Help Box */}
        {showBeginnerHelp && (
          <div className="mt-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              Comment bien utiliser Excel en français :
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Le point-virgule (;) :</strong> Dans la version française d'Excel, on sépare les arguments d'une formule par <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-emerald-800">;</code> (et non par une virgule).</li>
              <li><strong>Les guillemets doubles (" ") :</strong> Tout texte ou comparaison texte dans une formule doit être entouré de guillemets (ex : <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-emerald-800">"Paris"</code> ou <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-emerald-800">"&gt;100"</code>).</li>
              <li><strong>Copier-coller :</strong> Cliquez sur le bouton vert <em>"Copier la formule"</em>, ouvrez votre classeur Excel, cliquez sur votre cellule et collez avec <strong>Ctrl + V</strong> (ou appui long sur Android).</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Generator Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Générateur Intelligent en Langage Naturel</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Décrivez ce que vous voulez calculer en français
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Écrivez simplement votre besoin. ExcelAI Pro écrit la formule exacte avec les fonctions françaises, le point-virgule (;) et un tableau de démonstration.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => handleGenerate(e)} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="prompt-input" className="block text-xs font-semibold text-slate-700">
                Votre demande en français :
              </label>
              {(prompt || result || context) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium transition active:scale-95"
                  title="Effacer la demande et réinitialiser l'écran"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
            <div className="relative">
              <textarea
                id="prompt-input"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex : Je veux calculer la prime de 10% si le montant en B2 dépasse 5000 € et que le statut en C2 est 'Validé'..."
                className="w-full px-3.5 py-3 text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition resize-y font-sans"
              />
            </div>
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-1.5">
              Exemples pratiques à tester en 1 clic :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(sample)}
                  className="text-xs text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1.5 rounded-lg transition text-left cursor-pointer active:scale-95"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Optional context toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvancedContext(!showAdvancedContext)}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer py-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>
                {showAdvancedContext ? 'Masquer la précision des colonnes' : '+ Préciser vos colonnes ou structure de données (optionnel)'}
              </span>
            </button>

            {showAdvancedContext && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Exemple de structure de vos colonnes :
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Ex : Col A = Nom client, Col B = Montant HT, Col C = Statut (Validé/En attente)"
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white focus:border-emerald-600 outline-none"
                />
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>Syntaxe : <strong className="text-slate-800 font-semibold">{language === 'fr' ? 'Français ( ; )' : 'Anglais ( , )'}</strong></span>
              <span>·</span>
              <span>Version : <strong className="text-slate-800 font-semibold">{excelVersion}</strong></span>
              {onOpenHistory && historyCount > 0 && (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={onOpenHistory}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer underline decoration-dotted"
                  >
                    <History className="w-3 h-3" />
                    <span>Historique ({historyCount})</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition cursor-pointer active:scale-95 border border-slate-200 shadow-2xs"
                title="Effacer le texte saisi et réinitialiser l'écran à zéro"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Réinitialiser</span>
              </button>

              {onOpenHistory && (
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                  title="Voir l'historique des formules"
                >
                  <History className="w-4 h-4 text-emerald-700" />
                  <span>Historique</span>
                  {historyCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-emerald-200 text-emerald-800 font-bold rounded-full">
                      {historyCount}
                    </span>
                  )}
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:cursor-not-allowed active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calcul et conception en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Générer la formule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-6">
          {/* Main Formula Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-emerald-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Formule Prête à l'Emploi
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <p className="text-xs text-emerald-100/90">
                    À coller directement dans votre barre de formule Excel
                  </p>
                  <span className="text-[10px] text-emerald-300 bg-emerald-800/80 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 border border-emerald-700/50">
                    <Clock className="w-2.5 h-2.5" /> Enregistrée dans l'historique
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onExplainFormula && (
                  <button
                    type="button"
                    onClick={() => onExplainFormula(result.formula)}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition border border-emerald-600/40 cursor-pointer active:scale-95 shadow-2xs"
                    title="Expliquer cette formule dans l'onglet Explicateur"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Expliquer</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-medium bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition border border-emerald-600/40 cursor-pointer active:scale-95"
                  title="Ajouter aux favoris"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{saved ? 'Enregistrée !' : 'Sauvegarder'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.formula)}
                  className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-1.5 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 rounded-lg transition shadow-xs cursor-pointer active:scale-95"
                >
                  {copiedMain ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMain ? '✓ Copié !' : 'Copier la formule'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-medium bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 hover:text-white rounded-lg transition border border-emerald-700/60 cursor-pointer active:scale-95"
                  title="Effacer le résultat et revenir à l'écran initial"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              </div>
            </div>

            {/* Formula display */}
            <div className="p-4 sm:p-5 bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base overflow-x-auto border-b border-slate-200 selection:bg-emerald-700 selection:text-white">
              <code>{result.formula}</code>
            </div>

            {/* Alternative & English translation */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {result.formulaAlt && (
                <div>
                  <span className="text-slate-500 font-medium block">Variante alternative :</span>
                  <code className="text-slate-800 font-mono font-semibold bg-white px-2 py-1 rounded border border-slate-200 inline-block mt-1">
                    {result.formulaAlt}
                  </code>
                </div>
              )}
              <div>
                <span className="text-slate-500 font-medium block">Équivalent en anglais (Excel International) :</span>
                <code className="text-slate-800 font-mono font-semibold bg-white px-2 py-1 rounded border border-slate-200 inline-block mt-1">
                  {result.formulaEnglish}
                </code>
              </div>
            </div>

            {/* Explanation text */}
            <div className="p-5">
              <h2 className="text-xs uppercase font-semibold text-slate-500 tracking-wider mb-2">
                Explication simple de la formule
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {result.explanation}
              </p>

              {/* Components breakdown */}
              {result.components && result.components.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-800 mb-2.5">
                    Décomposition des arguments :
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.components.map((c, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <code className="font-mono font-semibold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                            {c.part}
                          </code>
                          <span className="text-[11px] text-slate-500 font-medium">{c.role}</span>
                        </div>
                        <p className="text-slate-600 mt-1">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips for beginners */}
              {result.tips && result.tips.length > 0 && (
                <div className="mt-5 p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Conseils pratiques pour débutants :</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1">
                    {result.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Spreadsheet Simulation */}
          {result.sampleData && (
            <InteractiveSpreadsheet
              data={result.sampleData}
              formula={result.formula}
              title="Exemple pratique & simulation interactive"
              subtitle="Modifiez les nombres dans les cellules pour observer le recalcul en direct"
            />
          )}
        </div>
      )}
    </div>
  );
};
