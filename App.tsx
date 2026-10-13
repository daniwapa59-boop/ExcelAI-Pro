/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { FormulaGenerator } from './components/FormulaGenerator';
import { FormulaCategoriesSection } from './components/FormulaCategoriesSection';
import { FormulaExplainer } from './components/FormulaExplainer';
import { ErrorTroubleshooter } from './components/ErrorTroubleshooter';
import { PracticalExamples } from './components/PracticalExamples';
import { ExcelAssistant } from './components/ExcelAssistant';
import { FavoritesHistoryModal } from './components/FavoritesHistoryModal';
import { FormulaHistoryModal } from './components/FormulaHistoryModal';
import { ProModal } from './components/ProModal';
import { ExcelLanguage, ExcelVersion, SavedFormula, FormulaHistoryItem } from './types';
import { FileSpreadsheet, Sparkles, BookOpen, Wrench, MessageSquare, HelpCircle, CheckCircle2 } from 'lucide-react';

const INITIAL_FAVORITES: SavedFormula[] = [
  {
    id: 'fav-1',
    title: 'Somme conditionnelle par catégorie',
    formula: '=SOMME.SI(B2:B50; "Marketing"; C2:C50)',
    category: 'Finance',
    date: Date.now() - 86400000 * 2
  },
  {
    id: 'fav-2',
    title: 'Recherche sécurisée sans erreur',
    formula: '=RECHERCHEX(A2; Clients!A:A; Clients!C:C; "Introuvable")',
    category: 'Recherche',
    date: Date.now() - 86400000 * 5
  }
];

const INITIAL_HISTORY: FormulaHistoryItem[] = [
  {
    id: 'hist-init-1',
    prompt: 'Calculer la somme de la colonne B de la ligne 2 à 6 avec SOMME',
    formula: '=SOMME(B2:B6)',
    formulaEnglish: '=SUM(B2:B6)',
    timestamp: Date.now() - 1000 * 60 * 18,
    language: 'fr'
  },
  {
    id: 'hist-init-2',
    prompt: 'Si la note en B2 >= 10 afficher "Admis" sinon "Recalé"',
    formula: '=SI(B2>=10; "Admis"; "Recalé")',
    formulaEnglish: '=IF(B2>=10, "Admis", "Recalé")',
    timestamp: Date.now() - 1000 * 60 * 55,
    language: 'fr'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [language, setLanguage] = useState<ExcelLanguage>('fr');
  const [excelVersion, setExcelVersion] = useState<ExcelVersion>('365');
  const [favorites, setFavorites] = useState<SavedFormula[]>(() => {
    try {
      const stored = localStorage.getItem('excelai_favorites');
      return stored ? JSON.parse(stored) : INITIAL_FAVORITES;
    } catch {
      return INITIAL_FAVORITES;
    }
  });

  const [history, setHistory] = useState<FormulaHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('excelai_history');
      return stored ? JSON.parse(stored) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [generatorPreFill, setGeneratorPreFill] = useState<string>('');
  const [explainerPreFill, setExplainerPreFill] = useState<string>('');

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('excelai_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }, [favorites]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('excelai_history', JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage unavailable for history', e);
    }
  }, [history]);

  const handleSaveFormula = (title: string, formula: string, category: string) => {
    const newFav: SavedFormula = {
      id: `fav-${Date.now()}`,
      title,
      formula,
      category,
      date: Date.now()
    };
    setFavorites(prev => [newFav, ...prev]);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const handleAddToHistory = (item: { prompt: string; formula: string; formulaEnglish?: string; language: ExcelLanguage }) => {
    const newItem: FormulaHistoryItem = {
      ...item,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('excelai_history');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleSelectFormulaFromHistory = (formula: string, prompt?: string) => {
    if (prompt) {
      setGeneratorPreFill(prompt);
      setActiveTab('generator');
    } else {
      setExplainerPreFill(formula);
      setActiveTab('explainer');
    }
  };

  const handleSendToGenerator = (prompt: string) => {
    setGeneratorPreFill(prompt);
    setActiveTab('generator');
  };

  const handleSelectFormulaToExplain = (formula: string) => {
    setExplainerPreFill(formula);
    setActiveTab('explainer');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        excelVersion={excelVersion}
        setExcelVersion={setExcelVersion}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        favoritesCount={favorites.length}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 pb-24 sm:pb-12">
        {/* Tab 1: Formula Generator */}
        {activeTab === 'generator' && (
          <FormulaGenerator
            language={language}
            excelVersion={excelVersion}
            onSaveFormula={handleSaveFormula}
            initialPrompt={generatorPreFill}
            onAddToHistory={handleAddToHistory}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
            onExplainFormula={handleSelectFormulaToExplain}
            onReset={() => setGeneratorPreFill('')}
          />
        )}

        {/* Tab 2: Formula Categories */}
        {activeTab === 'categories' && (
          <FormulaCategoriesSection
            onSendToGenerator={handleSendToGenerator}
            onSendToExplainer={handleSelectFormulaToExplain}
          />
        )}

        {/* Tab 3: Formula Explainer */}
        {activeTab === 'explainer' && (
          <FormulaExplainer
            language={language}
            initialFormula={explainerPreFill}
          />
        )}

        {/* Tab 3: Error Troubleshooter */}
        {activeTab === 'troubleshooter' && (
          <ErrorTroubleshooter
            language={language}
          />
        )}

        {/* Tab 4: Practical Examples & Tutorials */}
        {activeTab === 'examples' && (
          <PracticalExamples
            language={language}
            onSendToGenerator={handleSendToGenerator}
          />
        )}

        {/* Tab 5: Freeform Assistant */}
        {activeTab === 'assistant' && (
          <ExcelAssistant />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-200">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">ExcelAI Pro</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Pour Microsoft Excel® & Google Sheets</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <span>Syntaxe FR (point-virgule) et EN (virgule)</span>
            <span>·</span>
            <span>Compatible Excel 365, 2021, 2019, 2016</span>
            <span>·</span>
            <span>Prêt pour intégration Stripe & Auth</span>
          </div>

          <div className="text-slate-500 text-[11px] text-center md:text-right">
            Conçu pour tous les niveaux, du débutant à l'expert.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FormulaHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRemoveItem={handleRemoveHistoryItem}
        onSelectFormula={handleSelectFormulaFromHistory}
      />

      <FavoritesHistoryModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onSelectFormula={handleSelectFormulaToExplain}
      />

      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </div>
  );
}
