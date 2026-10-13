import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Play, 
  Copy, 
  Check, 
  ArrowRight, 
  Tag, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { PRACTICAL_EXAMPLES } from '../data/presetExamples';
import { PracticalExample, ExcelLanguage } from '../types';
import { InteractiveSpreadsheet } from './InteractiveSpreadsheet';
import { copyFormulaToClipboard } from '../utils/clipboard';

interface PracticalExamplesProps {
  language: ExcelLanguage;
  onSendToGenerator: (prompt: string) => void;
}

export const PracticalExamples: React.FC<PracticalExamplesProps> = ({
  language,
  onSendToGenerator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeExample, setActiveExample] = useState<PracticalExample>(PRACTICAL_EXAMPLES[0]);
  const [copied, setCopied] = useState(false);

  const categories = [
    'Tous',
    'Débutant',
    'Finance & Ventes',
    'Recherche & Lookups',
    'Ressources Humaines',
    'Nettoyage & Texte',
    'Dates & Temps'
  ];

  const filteredExamples = PRACTICAL_EXAMPLES.filter(ex => {
    const matchesCat = selectedCategory === 'Tous' || ex.category === selectedCategory;
    const matchesSearch = 
      ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.keyFunctions.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const currentFormula = language === 'fr' ? activeExample.formulaFR : activeExample.formulaEN;

  const copyFormula = async () => {
    const ok = await copyFormulaToClipboard(currentFormula);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold tracking-wide uppercase mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Bibliothèque d'Apprentissage & Cas Concrets</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Maîtrisez les formules clés grâce à des cas réels commentés
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Chaque exemple comprend un tableau pré-rempli et un simulateur interactif pour tester et modifier les données en direct.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher (ex: RECHERCHEX, Prime...)"
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-emerald-600 outline-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main split view: list on the left / active simulation on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of Examples */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {filteredExamples.length} cas pratique{filteredExamples.length > 1 ? 's' : ''} disponible{filteredExamples.length > 1 ? 's' : ''} :
          </span>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredExamples.map((item) => {
              const isSelected = activeExample.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveExample(item)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-500 ring-1 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Difficulté : <strong className="text-slate-700">{item.difficulty}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600">
                      {item.keyFunctions.map((fn, idx) => (
                        <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded">
                          {fn}
                        </span>
                      ))}
                    </div>
                    <span className="text-emerald-700 font-medium flex items-center gap-0.5 text-[11px]">
                      Voir le cas <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredExamples.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200">
                Aucun exemple ne correspond à votre recherche. Essayez d'autres mots-clés.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Example Details & Simulation */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                {activeExample.category} · {activeExample.difficulty}
              </span>

              <button
                type="button"
                onClick={() => onSendToGenerator(activeExample.prompt)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                title="Personnaliser ce calcul dans le générateur"
              >
                <span>Adapter dans le Générateur</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {activeExample.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {activeExample.description}
            </p>

            {/* Formula banner */}
            <div className="mt-4 p-3 bg-slate-900 rounded-lg flex flex-wrap items-center justify-between gap-3">
              <div className="text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto">
                <code>{currentFormula}</code>
              </div>

              <button
                type="button"
                onClick={copyFormula}
                className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-lg transition shrink-0 cursor-pointer active:scale-95 shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '✓ Formule copiée !' : 'Copier la formule'}</span>
              </button>
            </div>

            {/* Explanation text */}
            <div className="mt-4 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Comment fonctionne cette formule :</strong>
              {activeExample.explanation}
            </div>
          </div>

          {/* Interactive Simulation */}
          <InteractiveSpreadsheet
            data={activeExample.sampleData}
            formula={currentFormula}
            title={`Simulateur : ${activeExample.title}`}
            subtitle="Vous pouvez modifier les nombres ci-dessous pour tester"
          />
        </div>
      </div>
    </div>
  );
};
