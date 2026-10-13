import { FormulaGenerationResult, ExcelLanguage, ExcelVersion } from '../types';

/**
 * Normalizes French text (removes accents, converts to lowercase)
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Intelligent client & server fallback Excel formula generator.
 * Accurately translates French natural language into precise Excel formulas.
 */
export function generateLocalFormula(
  prompt: string,
  language: ExcelLanguage = 'fr',
  excelVersion: ExcelVersion = '365',
  context: string = ''
): FormulaGenerationResult {
  const norm = normalize(prompt + ' ' + context);

  // Extract cell range if mentioned (e.g. B2:B6, A1:A50, B2 à B10)
  const rangeMatch = prompt.match(/([A-Z]+[0-9]+)\s*(?::|à|a)\s*([A-Z]+[0-9]+)/i);
  const cellRange = rangeMatch ? `${rangeMatch[1].toUpperCase()}:${rangeMatch[2].toUpperCase()}` : 'B2:B6';

  // 1. RECHERCHEV / RECHERCHEX / VLOOKUP / XLOOKUP
  if (
    norm.includes('recherch') ||
    norm.includes('trouver le prix') ||
    norm.includes('chercher') ||
    norm.includes('vlookup') ||
    norm.includes('xlookup') ||
    norm.includes('trouver l\'article') ||
    norm.includes('correspondance')
  ) {
    if (excelVersion === '365' || norm.includes('recherchex') || norm.includes('xlookup')) {
      return {
        formula: language === 'fr' 
          ? '=RECHERCHEX(D2; A2:A6; B2:B6; "Non trouvé")' 
          : '=XLOOKUP(D2, A2:A6, B2:B6, "Not found")',
        formulaAlt: language === 'fr' ? '=RECHERCHEV(D2; A2:B6; 2; FAUX)' : '=VLOOKUP(D2, A2:B6, 2, FALSE)',
        formulaEnglish: '=XLOOKUP(D2, A2:A6, B2:B6, "Not found")',
        explanation: 'La fonction moderne RECHERCHEX cherche la valeur de D2 dans la colonne A (A2:A6) et renvoie instantanément la valeur correspondante dans la colonne B (B2:B6). Si la référence n\'existe pas, elle affiche proprement "Non trouvé" sans générer d\'erreur #N/A.',
        components: [
          { part: 'D2', role: 'Valeur cherchée', detail: 'La cellule contenant la référence ou le code que vous cherchez.' },
          { part: 'A2:A6', role: 'Tableau de recherche', detail: 'La colonne où se trouvent les codes.' },
          { part: 'B2:B6', role: 'Tableau renvoyé', detail: 'La colonne contenant le résultat à récupérer (ex: le prix ou la désignation).' },
          { part: '"Non trouvé"', role: 'Valeur si non trouvé', detail: 'Message de sécurité si le code n\'existe pas.' }
        ],
        sampleData: {
          headers: ['Code (A)', 'Désignation (B)', 'Recherche (D)', 'Résultat (E)'],
          rows: [
            ['ART-01', 'Écran 27 pouces', 'ART-02', ''],
            ['ART-02', 'Clavier sans fil', '', ''],
            ['ART-03', 'Souris optique', '', ''],
            ['ART-04', 'Casque audio', '', '']
          ],
          formulaCell: 'E2',
          calculatedValue: 'Clavier sans fil'
        },
        tips: [
          'RECHERCHEX remplace avantageusement RECHERCHEV : elle peut chercher vers la gauche et ne plante pas si vous insérez des colonnes.',
          'N\'oubliez pas les guillemets autour du message "Non trouvé".'
        ]
      };
    }

    return {
      formula: language === 'fr' ? '=RECHERCHEV(D2; A2:B6; 2; FAUX)' : '=VLOOKUP(D2, A2:B6, 2, FALSE)',
      formulaAlt: language === 'fr' ? '=INDEX(B2:B6; EQUIV(D2; A2:A6; 0))' : '=INDEX(B2:B6, MATCH(D2, A2:A6, 0))',
      formulaEnglish: '=VLOOKUP(D2, A2:B6, 2, FALSE)',
      explanation: 'La fonction RECHERCHEV cherche la référence indiquée en D2 dans la 1ère colonne du tableau (A2:B6), puis rapporte la valeur située sur la même ligne dans la 2ème colonne.',
      components: [
        { part: 'D2', role: 'Valeur cherchée', detail: 'L\'élément dont vous voulez retrouver l\'information.' },
        { part: 'A2:B6', role: 'Table matrice', detail: 'Le tableau complet englobant la colonne de recherche et celle du résultat.' },
        { part: '2', role: 'Numéro d\'index colonne', detail: 'Le numéro de la colonne qui contient le résultat (ici la 2ème).' },
        { part: 'FAUX', role: 'Valeur proche', detail: 'Exige une correspondance exacte.' }
      ],
      sampleData: {
        headers: ['Référence (A)', 'Prix unitaire (B)', 'Réf cherchée (D)', 'Prix trouvé (E)'],
        rows: [
          ['REF-10', '15 €', 'REF-20', ''],
          ['REF-20', '89 €', '', ''],
          ['REF-30', '45 €', '', ''],
          ['REF-40', '120 €', '', '']
        ],
        formulaCell: 'E2',
        calculatedValue: '89 €'
      },
      tips: [
        'Important : terminez toujours par FAUX (ou 0) pour forcer une correspondance exacte et éviter les résultats erronés.',
        'La valeur cherchée doit obligatoirement se trouver dans la toute première colonne à gauche du tableau sélectionné.'
      ]
    };
  }

  // 2. SOMME.SI / SOMME.SI.ENS / SUMIF / SUMIFS
  if (
    norm.includes('somme.si') ||
    norm.includes('somme si') ||
    (norm.includes('somme') && (norm.includes('si ') || norm.includes('selon') || norm.includes('critere') || norm.includes('condition') || norm.includes('paris') || norm.includes('categorie')))
  ) {
    return {
      formula: language === 'fr' 
        ? '=SOMME.SI(B2:B6; "Paris"; C2:C6)' 
        : '=SUMIF(B2:B6, "Paris", C2:C6)',
      formulaAlt: language === 'fr' ? '=SOMME.SI.ENS(C2:C6; B2:B6; "Paris")' : '=SUMIFS(C2:C6, B2:B6, "Paris")',
      formulaEnglish: '=SUMIF(B2:B6, "Paris", C2:C6)',
      explanation: 'La formule SOMME.SI examine la colonne des villes (B2:B6). Dès qu\'elle repère "Paris", elle additionne le montant correspondant situé dans la colonne C (C2:C6).',
      components: [
        { part: 'B2:B6', role: 'Plage du critère', detail: 'La colonne contenant les valeurs à tester (ex: les villes ou catégories).' },
        { part: '"Paris"', role: 'Critère', detail: 'Le critère précis que la ligne doit respecter.' },
        { part: 'C2:C6', role: 'Plage à additionner', detail: 'La colonne des montants numériques à sommer.' }
      ],
      sampleData: {
        headers: ['Client (A)', 'Ville (B)', 'Montant € (C)', 'Total Paris (D)'],
        rows: [
          ['Dupont', 'Paris', 350, ''],
          ['Martin', 'Lyon', 180, ''],
          ['Bernard', 'Paris', 420, ''],
          ['Dubois', 'Marseille', 290, ''],
          ['Thomas', 'Paris', 510, '']
        ],
        formulaCell: 'D2',
        calculatedValue: '1 280 €'
      },
      tips: [
        'Veillez à ce que la plage de critère (B2:B6) et la plage de somme (C2:C6) aient exactement le même nombre de lignes.',
        'Dans Excel en français, les arguments sont séparés par un point-virgule (;).'
      ]
    };
  }

  // 3. NB.SI / NB.SI.ENS / COUNTIF
  if (
    norm.includes('nb.si') ||
    norm.includes('compter si') ||
    norm.includes('combien de fois') ||
    norm.includes('nombre de fois') ||
    norm.includes('nombre de dossiers') ||
    norm.includes('nombre de lignes') ||
    norm.includes('valide') && norm.includes('compter')
  ) {
    return {
      formula: language === 'fr' 
        ? '=NB.SI(B2:B6; "Validé")' 
        : '=COUNTIF(B2:B6, "Validé")',
      formulaAlt: language === 'fr' ? '=NB.SI.ENS(B2:B6; "Validé")' : '=COUNTIFS(B2:B6, "Validé")',
      formulaEnglish: '=COUNTIF(B2:B6, "Validé")',
      explanation: 'La fonction NB.SI parcourt la colonne B (B2:B6) et compte combien de cellules contiennent exactement la mention "Validé".',
      components: [
        { part: 'B2:B6', role: 'Plage à examiner', detail: 'La liste de cellules dans laquelle Excel doit compter.' },
        { part: '"Validé"', role: 'Critère', detail: 'Le mot ou la condition exacte recherchée.' }
      ],
      sampleData: {
        headers: ['Dossier (A)', 'Statut (B)', 'Dossiers Validés (C)'],
        rows: [
          ['DOS-101', 'Validé', ''],
          ['DOS-102', 'En attente', ''],
          ['DOS-103', 'Validé', ''],
          ['DOS-104', 'Validé', ''],
          ['DOS-105', 'Rejeté', '']
        ],
        formulaCell: 'C2',
        calculatedValue: '3'
      },
      tips: [
        'Pour compter les valeurs supérieures à 100, écrivez le critère entre guillemets : ">100".',
        'NB.SI n\'est pas sensible à la casse ("validé" comptera aussi "Validé" ou "VALIDÉ").'
      ]
    };
  }

  // 4. SI / TEST CONDITIONNEL / IF
  if (
    norm.includes(' si ') ||
    norm.startsWith('si ') ||
    norm.includes('condition') ||
    norm.includes('admis') ||
    norm.includes('recale') ||
    norm.includes('bonus') ||
    norm.includes('prime') ||
    norm.includes('atteint') ||
    norm.includes('reussite') ||
    norm.includes('statut')
  ) {
    return {
      formula: language === 'fr' 
        ? '=SI(B2>=10; "Admis"; "Recalé")' 
        : '=IF(B2>=10, "Admis", "Recalé")',
      formulaAlt: language === 'fr' 
        ? '=SI(B2>=10; "Admis"; SI(B2>=8; "Rattrapage"; "Recalé"))' 
        : '=IF(B2>=10, "Admis", IF(B2>=8, "Rattrapage", "Recalé"))',
      formulaEnglish: '=IF(B2>=10, "Admis", "Recalé")',
      explanation: 'La fonction SI teste la valeur de la cellule B2. Si elle est supérieure ou égale à 10, Excel affiche "Admis". Dans le cas contraire, Excel affiche "Recalé".',
      components: [
        { part: 'B2>=10', role: 'Test logique', detail: 'La condition vérifiée par Excel (la note est-elle au moins 10 ?).' },
        { part: '"Admis"', role: 'Valeur si vrai', detail: 'Le texte affiché si la condition est remplie.' },
        { part: '"Recalé"', role: 'Valeur si faux', detail: 'Le texte affiché si la condition n\'est pas remplie.' }
      ],
      sampleData: {
        headers: ['Élève (A)', 'Note / 20 (B)', 'Décision du jury (C)'],
        rows: [
          ['Sophie', 14, ''],
          ['Thomas', 8.5, ''],
          ['Camille', 10, ''],
          ['Lucas', 12, ''],
          ['Emma', 7, '']
        ],
        formulaCell: 'C2',
        calculatedValue: 'Admis'
      },
      tips: [
        'Pensez à toujours mettre des guillemets droits ("") autour des mots à afficher.',
        'Pour imbriquer plusieurs conditions, vous pouvez remplacer "Recalé" par un second SI().'
      ]
    };
  }

  // 5. MOYENNE / AVERAGE
  if (
    norm.includes('moyenne') ||
    norm.includes('moyen') ||
    norm.includes('average') ||
    norm.includes('panier moyen') ||
    norm.includes('score moyen')
  ) {
    return {
      formula: language === 'fr' ? `=MOYENNE(${cellRange})` : `=AVERAGE(${cellRange})`,
      formulaAlt: language === 'fr' ? `=SOMME(${cellRange})/NB(${cellRange})` : `=SUM(${cellRange})/COUNT(${cellRange})`,
      formulaEnglish: `=AVERAGE(${cellRange})`,
      explanation: `La fonction MOYENNE calcule la moyenne arithmétique de toutes les valeurs numériques de la plage ${cellRange} en divisant automatiquement par le nombre d'éléments.`,
      components: [
        { part: 'MOYENNE', role: 'Fonction', detail: 'Additionne puis divise par le nombre de valeurs.' },
        { part: cellRange, role: 'Plage', detail: 'Les cellules contenant les nombres à moyenner.' }
      ],
      sampleData: {
        headers: ['Commercial (A)', 'Ventes mensuelles € (B)', 'Moyenne équipe (C)'],
        rows: [
          ['Lucas', 2400, ''],
          ['Sarah', 3100, ''],
          ['Alexandre', 1900, ''],
          ['Emma', 2800, ''],
          ['Thomas', 2300, '']
        ],
        formulaCell: 'C2',
        calculatedValue: '2 500 €'
      },
      tips: [
        'Les cellules vides ou contenant du texte sont ignorées et ne faussent pas la moyenne.',
        'Une cellule avec le chiffre 0 sera quant à elle comptabilisée.'
      ]
    };
  }

  // 6. MAX / MIN
  if (norm.includes('max') || norm.includes('plus grand') || norm.includes('meilleur score') || norm.includes('maximum') || norm.includes('record')) {
    return {
      formula: language === 'fr' ? `=MAX(${cellRange})` : `=MAX(${cellRange})`,
      formulaAlt: language === 'fr' ? `=GRANDE.VALEUR(${cellRange}; 1)` : `=LARGE(${cellRange}, 1)`,
      formulaEnglish: `=MAX(${cellRange})`,
      explanation: `La fonction MAX parcourt la sélection ${cellRange} et renvoie la valeur numérique la plus élevée sans nécessiter de trier le tableau.`,
      components: [
        { part: 'MAX', role: 'Fonction', detail: 'Extrait le maximum d\'une liste de nombres.' },
        { part: cellRange, role: 'Plage', detail: 'L\'ensemble des données à analyser.' }
      ],
      sampleData: {
        headers: ['Commercial (A)', 'Ventes € (B)', 'Meilleure vente (C)'],
        rows: [
          ['Béatrice', 32400, ''],
          ['Julien', 28900, ''],
          ['Sophie', 14500, ''],
          ['Karim', 19800, '']
        ],
        formulaCell: 'C2',
        calculatedValue: '32 400 €'
      },
      tips: [
        'Idéal pour repérer en un clin d\'œil le meilleur chiffre d\'affaires ou la note la plus haute.'
      ]
    };
  }

  if (norm.includes('min') || norm.includes('plus petit') || norm.includes('minimum') || norm.includes('moins cher') || norm.includes('pire')) {
    return {
      formula: language === 'fr' ? `=MIN(${cellRange})` : `=MIN(${cellRange})`,
      formulaAlt: language === 'fr' ? `=PETITE.VALEUR(${cellRange}; 1)` : `=SMALL(${cellRange}, 1)`,
      formulaEnglish: `=MIN(${cellRange})`,
      explanation: `La fonction MIN identifie et renvoie la plus petite valeur parmi les cellules de la plage ${cellRange}.`,
      components: [
        { part: 'MIN', role: 'Fonction', detail: 'Repère le nombre le plus faible.' },
        { part: cellRange, role: 'Plage', detail: 'Les cellules à comparer.' }
      ],
      sampleData: {
        headers: ['Fournisseur (A)', 'Tarif HT (B)', 'Tarif le plus bas (C)'],
        rows: [
          ['Fournisseur A', 450, ''],
          ['Fournisseur B', 380, ''],
          ['Fournisseur C', 510, ''],
          ['Fournisseur D', 340, '']
        ],
        formulaCell: 'C2',
        calculatedValue: '340 €'
      },
      tips: [
        'Très utile dans un comparateur de prix ou de devis.'
      ]
    };
  }

  // 7. TEXTE : GAUCHE, DROITE, STXT, CONCATENER, NBCAR
  if (norm.includes('gauche') || norm.includes('premier caractere') || norm.includes('premieres lettres') || norm.includes('prefixe')) {
    return {
      formula: language === 'fr' ? '=GAUCHE(A2; 3)' : '=LEFT(A2, 3)',
      formulaAlt: language === 'fr' ? '=STXT(A2; 1; 3)' : '=MID(A2, 1, 3)',
      formulaEnglish: '=LEFT(A2, 3)',
      explanation: 'La fonction GAUCHE extrait les 3 premiers caractères situés au tout début du texte de la cellule A2.',
      components: [
        { part: 'A2', role: 'Cellule source', detail: 'La cellule contenant le texte d\'origine.' },
        { part: '3', role: 'Nombre de caractères', detail: 'Le nombre de lettres ou chiffres à récupérer depuis la gauche.' }
      ],
      sampleData: {
        headers: ['Référence (A)', 'Code Pays (B)', 'Désignation'],
        rows: [
          ['FRA-9801', '', 'France'],
          ['ESP-4412', '', 'Espagne'],
          ['DEU-1289', '', 'Allemagne']
        ],
        formulaCell: 'B2',
        calculatedValue: 'FRA'
      },
      tips: ['Parfait pour isoler un code pays, une catégorie ou un trigramme.']
    };
  }

  if (norm.includes('droite') || norm.includes('dernier caractere') || norm.includes('dernieres lettres') || norm.includes('suffixe')) {
    return {
      formula: language === 'fr' ? '=DROITE(A2; 4)' : '=RIGHT(A2, 4)',
      formulaEnglish: '=RIGHT(A2, 4)',
      explanation: 'La fonction DROITE extrait les 4 derniers caractères à la fin de la cellule A2.',
      components: [
        { part: 'A2', role: 'Cellule source', detail: 'Le texte complet.' },
        { part: '4', role: 'Nombre de caractères', detail: 'Le nombre de caractères à prélever en partant de la droite.' }
      ],
      sampleData: {
        headers: ['N° Série (A)', 'Numéro final (B)', 'Modèle'],
        rows: [
          ['SN-2026-9840', '', 'Standard'],
          ['SN-2026-7120', '', 'Pro'],
          ['SN-2026-4410', '', 'Entreprise']
        ],
        formulaCell: 'B2',
        calculatedValue: '9840'
      },
      tips: ['Indispensable pour récupérer l\'extension d\'un fichier ou la terminaison d\'un identifiant.']
    };
  }

  if (norm.includes('concatener') || norm.includes('fusionner') || norm.includes('assembler') || norm.includes('combiner') || norm.includes('prenom et nom')) {
    return {
      formula: language === 'fr' ? '=A2 & " " & B2' : '=A2 & " " & B2',
      formulaAlt: language === 'fr' ? '=CONCATENER(A2; " "; B2)' : '=CONCATENATE(A2, " ", B2)',
      formulaEnglish: '=A2 & " " & B2',
      explanation: 'L\'opérateur esperluette (&) fusionne le contenu de la cellule A2 et de la cellule B2 en insérant un espace entre les deux.',
      components: [
        { part: 'A2', role: 'Premier texte', detail: 'Exemple : le prénom.' },
        { part: '" "', role: 'Séparateur espace', detail: 'L\'espace inséré entre les deux mots.' },
        { part: 'B2', role: 'Second texte', detail: 'Exemple : le nom de famille.' }
      ],
      sampleData: {
        headers: ['Prénom (A)', 'Nom (B)', 'Nom complet (C)'],
        rows: [
          ['Jean', 'Dupont', ''],
          ['Marie', 'Curie', ''],
          ['Victor', 'Hugo', '']
        ],
        formulaCell: 'C2',
        calculatedValue: 'Jean Dupont'
      },
      tips: ['L\'utilisation du symbole & est beaucoup plus rapide et lisible que la fonction =CONCATENER().']
    };
  }

  // 8. DATES : AUJOURDHUI, MAINTENANT, JOUR, MOIS, ANNEE
  if (norm.includes('aujourdhui') || norm.includes('date du jour') || norm.includes('today') || norm.includes('delai') || norm.includes('retard')) {
    return {
      formula: language === 'fr' ? '=AUJOURDHUI()' : '=TODAY()',
      formulaAlt: language === 'fr' ? '=AUJOURDHUI() - A2' : '=TODAY() - A2',
      formulaEnglish: '=TODAY()',
      explanation: 'La fonction AUJOURDHUI() génère la date du jour actuel sans heure. Elle se met à jour automatiquement chaque jour à l\'ouverture du classeur.',
      components: [
        { part: 'AUJOURDHUI()', role: 'Fonction sans argument', detail: 'Ne nécessite aucun paramètre à l\'intérieur des parenthèses.' }
      ],
      sampleData: {
        headers: ['Facture (A)', 'Date d\'échéance (B)', 'Date du jour (C)'],
        rows: [
          ['FAC-01', '01/10/2026', ''],
          ['FAC-02', '15/10/2026', ''],
          ['FAC-03', '30/10/2026', '']
        ],
        formulaCell: 'C2',
        calculatedValue: '12/10/2026'
      },
      tips: ['Pour calculer un retard de paiement : =AUJOURDHUI() - B2 donne le nombre exact de jours écoulés !']
    };
  }

  // 9. SOMME PAR DÉFAUT / ADDITION (SOMME / SUM)
  return {
    formula: language === 'fr' ? `=SOMME(${cellRange})` : `=SUM(${cellRange})`,
    formulaAlt: language === 'fr' ? `=SOUS.TOTAL(9; ${cellRange})` : `=SUBTOTAL(9, ${cellRange})`,
    formulaEnglish: `=SUM(${cellRange})`,
    explanation: `La fonction SOMME calcule en un geste le montant cumulé de toutes les cellules de la plage ${cellRange}. C'est la fonction reine pour totaliser des colonnes sans risque d'erreur.`,
    components: [
      { part: 'SOMME', role: 'Fonction d\'addition', detail: 'Additionne automatiquement toutes les cellules sélectionnées.' },
      { part: cellRange, role: 'Plage de cellules', detail: `De la première cellule jusqu'à la dernière incluse.` }
    ],
    sampleData: {
      headers: ['Désignation (A)', 'Montant € (B)', 'Total (C)'],
      rows: [
        ['Loyer', 950, ''],
        ['Énergie', 120, ''],
        ['Assurance', 65, ''],
        ['Internet', 40, ''],
        ['Fournitures', 85, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '1 260 €'
    },
    tips: [
      'Utilisez le raccourci Alt + = pour insérer la fonction SOMME en une seconde sous votre colonne.',
      'La fonction SOMME ignore automatiquement les cellules vides ou avec du texte, évitant l\'erreur #VALEUR!.'
    ]
  };
}
