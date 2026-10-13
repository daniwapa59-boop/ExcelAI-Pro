import React, { useState } from 'react';
import { X, Check, Crown, Zap, Shield, Sparkles, Building, ArrowRight } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [checkoutNotice, setCheckoutNotice] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: 'free' | 'pro' | 'enterprise') => {
    setSelectedPlan(plan);
    setCheckoutNotice(true);
    setTimeout(() => setCheckoutNotice(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Crown className="w-4 h-4" />
            <span>Offres & Abonnements ExcelAI Pro</span>
          </div>
          <h2 className="text-2xl font-bold">
            Passez à la vitesse supérieure sur Excel
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Débloquez la génération illimitée, les scripts VBA / Macros automatiques, l'exportation de classeurs et l'assistance prioritaire pour votre entreprise.
          </p>

          {/* Billing Switch */}
          <div className="mt-4 inline-flex items-center bg-emerald-950/60 p-1 rounded-lg border border-emerald-700/60 text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-md transition font-medium ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 font-semibold' : 'text-emerald-200 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 font-semibold' : 'text-emerald-200 hover:text-white'
              }`}
            >
              <span>Annuel</span>
              <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-bold">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Tier */}
          <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Découverte
              </span>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                0 € <span className="text-xs font-normal text-slate-500">/ toujours</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Idéal pour les étudiants et pour dépanner des calculs occasionnels.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>20 générations de formules par jour</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Explications de base en français</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Catalogue d'erreurs (#REF, #N/A)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Simulateur interactif intégré</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('free')}
              className="mt-6 w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Plan Actuel
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="border-2 border-emerald-600 rounded-xl p-5 flex flex-col justify-between bg-white relative shadow-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Le plus populaire
            </div>

            <div>
              <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
                ExcelAI Pro
              </span>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {billingCycle === 'yearly' ? '9,99 €' : '12,99 €'}
                <span className="text-xs font-normal text-slate-500">/ mois</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Pour les professionnels, analystes, comptables et créateurs de rapports.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong className="text-slate-900">Générations illimitées</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Générateur de Macros VBA & Office Scripts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Export de classeurs Excel (.xlsx) réels</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sauvegarde illimitée dans le cloud</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Support prioritaire par email & chat</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('pro')}
              className="mt-6 w-full py-2.5 px-3 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Activer ExcelAI Pro</span>
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between bg-slate-50/50">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Entreprise & Équipe
              </span>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                29 € <span className="text-xs font-normal text-slate-500">/ utilisateur</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Pour les entreprises, cabinets comptables et directions financières.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tous les avantages Pro pour l'équipe</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bibliothèque de formules d'entreprise partagée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conformité RGPD et sécurité renforcée</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Facturation centralisée et SSO Google/Azure</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('enterprise')}
              className="mt-6 w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
            >
              Contacter l'équipe
            </button>
          </div>
        </div>

        {/* Notice for checkout flow */}
        {checkoutNotice && (
          <div className="px-6 py-2.5 bg-emerald-100 border-t border-emerald-200 text-xs text-emerald-900 text-center font-medium">
            ✅ Pré-sélection enregistrée pour le plan {selectedPlan.toUpperCase()}. Le module de paiement sécurisé (Stripe/Facturation) sera actif lors du déploiement en production.
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Paiement 100% sécurisé · Sans engagement, résiliable en 1 clic</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
