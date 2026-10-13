import { PracticalExample } from '../types';

export const PRACTICAL_EXAMPLES: PracticalExample[] = [
  {
    id: 'debutant-somme',
    title: '1. SOMME : Additionner une liste de dépenses',
    category: 'Débutant',
    difficulty: 'Facile',
    description: 'Calculer le montant total de toutes les dépenses du mois en une seule opération.',
    prompt: 'Additionner toutes les valeurs de la colonne B de la cellule B2 à B6.',
    formulaFR: '=SOMME(B2:B6)',
    formulaEN: '=SUM(B2:B6)',
    keyFunctions: ['SOMME', 'SUM'],
    explanation: 'La fonction SOMME additionne automatiquement tous les nombres de la plage B2:B6. Elle ignore les cellules vides ou contenant du texte.',
    sampleData: {
      headers: ['Poste de dépense (A)', 'Montant € (B)', 'Total Calculé (C)'],
      rows: [
        ['Loyer bureau', 1200, ''],
        ['Électricité & Eau', 180, ''],
        ['Connexion Internet', 65, ''],
        ['Fournitures', 140, ''],
        ['Café & En-cas', 75, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '1 660 €'
    }
  },
  {
    id: 'debutant-si',
    title: '2. SI : Tester si un objectif de vente est atteint',
    category: 'Débutant',
    difficulty: 'Facile',
    description: 'Affiche "Objectif Atteint" si les ventes dépassent 10 000 €, sinon "À relancer".',
    prompt: 'Si le montant des ventes en B2 est supérieur ou égal à 10000 afficher "Objectif Atteint", sinon afficher "À relancer".',
    formulaFR: '=SI(B2>=10000; "Objectif Atteint"; "À relancer")',
    formulaEN: '=IF(B2>=10000, "Objectif Atteint", "À relancer")',
    keyFunctions: ['SI', 'IF'],
    explanation: 'La fonction SI teste la cellule B2. Si la valeur est >= 10 000, elle renvoie le texte du 2ème argument. Sinon, elle renvoie celui du 3ème argument.',
    sampleData: {
      headers: ['Commercial (A)', 'Ventes Réalisées € (B)', 'Statut Objectif (C)'],
      rows: [
        ['Antoine', 12400, ''],
        ['Béatrice', 8900, ''],
        ['Claire', 14500, ''],
        ['David', 9200, '']
      ],
      formulaCell: 'C2',
      calculatedValue: 'Objectif Atteint'
    }
  },
  {
    id: 'debutant-recherchev',
    title: '3. RECHERCHEV : Retrouver le prix d\'un produit avec son code',
    category: 'Débutant',
    difficulty: 'Facile',
    description: 'Recherche le code saisi dans un catalogue produit et renvoie le prix unitaire correspondant.',
    prompt: 'Rechercher le code en D2 dans le tableau A2:B5 et renvoyer la valeur de la colonne 2 (le prix).',
    formulaFR: '=RECHERCHEV(D2; A2:B5; 2; FAUX)',
    formulaEN: '=VLOOKUP(D2, A2:B5, 2, FALSE)',
    keyFunctions: ['RECHERCHEV', 'VLOOKUP'],
    explanation: 'RECHERCHEV regarde la valeur en D2, la cherche dans la première colonne du tableau A2:B5, puis extrait la valeur de la 2ème colonne. Le paramètre FAUX garantit une correspondance exacte.',
    sampleData: {
      headers: ['Code (A)', 'Désignation (B)', 'Code Sélectionné (D)', 'Résultat Trouvé (E)'],
      rows: [
        ['P-01', 'Clavier Ergonomique', 'P-03', ''],
        ['P-02', 'Souris Sans Fil', '', ''],
        ['P-03', 'Écran 27 Pouces', '', ''],
        ['P-04', 'Casque Audio', '', '']
      ],
      formulaCell: 'E2',
      calculatedValue: 'Écran 27 Pouces'
    }
  },
  {
    id: 'debutant-nb-si',
    title: '4. NB.SI : Compter le nombre de dossiers validés',
    category: 'Débutant',
    difficulty: 'Facile',
    description: 'Compte automatiquement combien de lignes ont le statut "Validé" dans une liste.',
    prompt: 'Compter combien de fois le mot "Validé" se trouve dans la plage B2 à B6.',
    formulaFR: '=NB.SI(B2:B6; "Validé")',
    formulaEN: '=COUNTIF(B2:B6, "Validé")',
    keyFunctions: ['NB.SI', 'COUNTIF'],
    explanation: 'NB.SI parcourt chaque cellule entre B2 et B6 et incrémente le compteur chaque fois qu\'elle trouve le mot exact "Validé".',
    sampleData: {
      headers: ['N° Client (A)', 'Statut Dossier (B)', 'Nombre de Validés (C)'],
      rows: [
        ['CLI-101', 'Validé', ''],
        ['CLI-102', 'En attente', ''],
        ['CLI-103', 'Validé', ''],
        ['CLI-104', 'Refusé', ''],
        ['CLI-105', 'Validé', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '3'
    }
  },
  {
    id: 'debutant-somme-si',
    title: '5. SOMME.SI : Total des ventes d\'une ville spécifique',
    category: 'Débutant',
    difficulty: 'Facile',
    description: 'Additionne uniquement les chiffres d\'affaires réalisés dans la ville de Paris.',
    prompt: 'Calculer la somme des montants en colonne C uniquement pour les lignes où la ville en colonne B est "Paris".',
    formulaFR: '=SOMME.SI(B2:B6; "Paris"; C2:C6)',
    formulaEN: '=SUMIF(B2:B6, "Paris", C2:C6)',
    keyFunctions: ['SOMME.SI', 'SUMIF'],
    explanation: 'SOMME.SI vérifie la colonne B2:B6. Dès qu\'une cellule est égale à "Paris", elle prend le montant en C2:C6 correspondant et l\'additionne au total.',
    sampleData: {
      headers: ['Client (A)', 'Ville (B)', 'Montant € (C)', 'Total Paris (D)'],
      rows: [
        ['SARL Alpha', 'Paris', 450, ''],
        ['Beta SAS', 'Lyon', 720, ''],
        ['Gamma Pro', 'Paris', 850, ''],
        ['Delta Tech', 'Marseille', 310, ''],
        ['Epsilon', 'Paris', 640, '']
      ],
      formulaCell: 'D2',
      calculatedValue: '1 940 €'
    }
  },
  {
    id: 'budget-somme-si',
    title: 'Calculer le total des dépenses par catégorie',
    category: 'Finance & Ventes',
    difficulty: 'Facile',
    description: 'Additionne uniquement les montants associés à la catégorie "Marketing" ou "Informatique".',
    prompt: 'Je veux additionner toutes les dépenses de la catégorie "Marketing" situées dans la colonne B avec les montants en colonne C.',
    formulaFR: '=SOMME.SI(B2:B6; "Marketing"; C2:C6)',
    formulaEN: '=SUMIF(B2:B6, "Marketing", C2:C6)',
    keyFunctions: ['SOMME.SI', 'SUMIF'],
    explanation: 'La fonction SOMME.SI examine la plage B2:B6. Dès qu\'une cellule est égale à "Marketing", elle additionne la valeur correspondante dans la colonne C2:C6.',
    sampleData: {
      headers: ['Date (A)', 'Catégorie (B)', 'Montant € (C)', 'Total Marketing (D)'],
      rows: [
        ['01/03/2026', 'Marketing', 450, ''],
        ['03/03/2026', 'Informatique', 1200, ''],
        ['05/03/2026', 'Marketing', 820, ''],
        ['08/03/2026', 'Fournitures', 140, ''],
        ['12/03/2026', 'Marketing', 310, '']
      ],
      formulaCell: 'D2',
      calculatedValue: '1 580 €'
    }
  },
  {
    id: 'recherche-client-xlookup',
    title: 'Trouver le prix d\'un article avec RECHERCHEX',
    category: 'Recherche & Lookups',
    difficulty: 'Facile',
    description: 'Retrouve instantanément le prix unitaire d\'une référence sans risque d\'erreur #N/A.',
    prompt: 'Retrouver le prix de l\'article saisi en E2 en cherchant dans la colonne A (références) et en renvoyant la colonne C (prix). Si introuvable, afficher "Non répertorié".',
    formulaFR: '=RECHERCHEX(E2; A2:A6; C2:C6; "Non répertorié")',
    formulaEN: '=XLOOKUP(E2, A2:A6, C2:C6, "Non répertorié")',
    keyFunctions: ['RECHERCHEX', 'XLOOKUP'],
    explanation: 'RECHERCHEX remplace avantageusement RECHERCHEV. Elle cherche vers la gauche ou la droite sans décalage et inclut une gestion automatique des éléments introuvables.',
    sampleData: {
      headers: ['Réf (A)', 'Désignation (B)', 'Prix HT (C)', 'Réf Cherchée (E)', 'Prix Trouvé (F)'],
      rows: [
        ['REF-101', 'Écran 27"', 249, 'REF-103', ''],
        ['REF-102', 'Clavier Sans Fil', 65, '', ''],
        ['REF-103', 'Souris Ergonomique', 42, '', ''],
        ['REF-104', 'Webcam 4K', 119, '', '']
      ],
      formulaCell: 'F2',
      calculatedValue: '42 €'
    }
  },
  {
    id: 'rh-calcul-prime',
    title: 'Attribuer une prime selon l\'atteinte des objectifs',
    category: 'Ressources Humaines',
    difficulty: 'Intermédiaire',
    description: 'Accorde 15% de bonus si les ventes dépassent 50 000 €, sinon 5% si supérieures à 30 000 €, sinon 0 €.',
    prompt: 'Calculer la prime d\'un commercial selon son chiffre d\'affaires en B2 : 15% si CA >= 50000, 5% si CA >= 30000, sinon 0.',
    formulaFR: '=SI(B2>=50000; B2*0,15; SI(B2>=30000; B2*0,05; 0))',
    formulaEN: '=IF(B2>=50000, B2*0.15, IF(B2>=30000, B2*0.05, 0))',
    keyFunctions: ['SI', 'IF'],
    explanation: 'Cette formule utilise deux conditions imbriquées. Excel teste d\'abord le palier haut (50 000 €). S\'il n\'est pas atteint, il teste le palier intermédiaire (30 000 €).',
    sampleData: {
      headers: ['Collaborateur (A)', 'Chiffre Ventes (B)', 'Objectif (C)', 'Prime Calculée (D)'],
      rows: [
        ['Sophie Martin', 58400, 40000, ''],
        ['Lucas Bernard', 34200, 40000, ''],
        ['Emma Petit', 62100, 40000, ''],
        ['Thomas Dubois', 24800, 40000, '']
      ],
      formulaCell: 'D2',
      calculatedValue: '8 760 €'
    }
  },
  {
    id: 'nettoyage-nom-prenom',
    title: 'Extraire le prénom et le nom d\'une cellule complète',
    category: 'Nettoyage & Texte',
    difficulty: 'Intermédiaire',
    description: 'Sépare automatiquement "Jean Dupont" pour récupérer uniquement le prénom.',
    prompt: 'Extraire uniquement le premier mot (le prénom) situé avant le premier espace dans la cellule A2.',
    formulaFR: '=GAUCHE(A2; TROUVE(" "; A2) - 1)',
    formulaEN: '=LEFT(A2, FIND(" ", A2) - 1)',
    keyFunctions: ['GAUCHE', 'TROUVE', 'LEFT', 'FIND'],
    explanation: 'TROUVE(" "; A2) repère la position du premier espace. La fonction GAUCHE extrait tous les caractères situés juste avant cette position.',
    sampleData: {
      headers: ['Nom Complet (A)', 'Prénom Extrait (B)', 'Statut'],
      rows: [
        ['Alexandre Dumas', '', 'Auteur'],
        ['Marie Curie', '', 'Scientifique'],
        ['Victor Hugo', '', 'Écrivain'],
        ['Camille Claudel', '', 'Sculptrice']
      ],
      formulaCell: 'B2',
      calculatedValue: 'Alexandre'
    }
  },
  {
    id: 'dates-anciennete',
    title: 'Calculer l\'ancienneté en années à partir d\'une date d\'embauche',
    category: 'Dates & Temps',
    difficulty: 'Facile',
    description: 'Détermine le nombre exact d\'années révolues entre la date d\'embauche et aujourd\'hui.',
    prompt: 'Calculer le nombre d\'années d\'ancienneté d\'un salarié avec sa date d\'embauche en B2 par rapport à aujourd\'hui.',
    formulaFR: '=DATEDIF(B2; AUJOURDHUI(); "Y")',
    formulaEN: '=DATEDIF(B2, TODAY(), "Y")',
    keyFunctions: ['DATEDIF', 'AUJOURDHUI', 'TODAY'],
    explanation: 'DATEDIF compare la date de début (B2) avec la date du jour (AUJOURDHUI()). L\'unité "Y" calcule les années complètes écoulées.',
    sampleData: {
      headers: ['Employé (A)', 'Date Embauche (B)', 'Poste (C)', 'Ancienneté (D)'],
      rows: [
        ['Alice Legrand', '15/04/2018', 'Cheffe de projet', ''],
        ['Karim Benali', '01/09/2021', 'Développeur', ''],
        ['Nathalie Colin', '10/01/2015', 'Directrice RH', ''],
        ['Julien Roy', '03/11/2023', 'Designer', '']
      ],
      formulaCell: 'D2',
      calculatedValue: '8 ans'
    }
  },
  {
    id: 'multi-criteres-somme-si-ens',
    title: 'Additionner avec plusieurs conditions (SOMME.SI.ENS)',
    category: 'Finance & Ventes',
    difficulty: 'Intermédiaire',
    description: 'Calcule le chiffre d\'affaires pour une région spécifique ET un statut "Livré".',
    prompt: 'Calculer la somme des montants en colonne D pour les lignes où la région en B est "Nord" et le statut en C est "Livré".',
    formulaFR: '=SOMME.SI.ENS(D2:D6; B2:B6; "Nord"; C2:C6; "Livré")',
    formulaEN: '=SUMIFS(D2:D6, B2:B6, "Nord", C2:C6, "Livré")',
    keyFunctions: ['SOMME.SI.ENS', 'SUMIFS'],
    explanation: 'Contrairement à SOMME.SI, la fonction SOMME.SI.ENS place la plage à additionner (D2:D6) en TOUT PREMIER argument, suivie des couples (plage; critère).',
    sampleData: {
      headers: ['Commande (A)', 'Région (B)', 'Statut (C)', 'Montant (D)', 'Total Nord Livré (E)'],
      rows: [
        ['CMD-01', 'Nord', 'Livré', 1200, ''],
        ['CMD-02', 'Sud', 'Livré', 850, '', ''],
        ['CMD-03', 'Nord', 'En cours', 430, ''],
        ['CMD-04', 'Nord', 'Livré', 950, ''],
        ['CMD-05', 'Ouest', 'Livré', 1100, '']
      ],
      formulaCell: 'E2',
      calculatedValue: '2 150 €'
    }
  }
];
