import { SampleSpreadsheetData } from '../types';

export type CategoryId = 'calculs' | 'recherche' | 'dates' | 'texte' | 'conditions';

export interface CategoryFunctionItem {
  id: string;
  name: string;
  englishName: string;
  category: CategoryId;
  role: string;
  simpleExplanation: string;
  syntax: string;
  syntaxDetail: string;
  formulaExample: string;
  formulaEnglish: string;
  proTip: string;
  sampleData: SampleSpreadsheetData;
}

export interface FormulaCategoryMeta {
  id: CategoryId;
  title: string;
  description: string;
  color: string;
  badge: string;
  functions: string[];
}

export const FORMULA_CATEGORIES_META: FormulaCategoryMeta[] = [
  {
    id: 'calculs',
    title: '1. Calculs',
    description: 'Additionner, calculer des moyennes, trouver les extrêmes et dénombrer.',
    color: 'emerald',
    badge: '5 fonctions',
    functions: ['SOMME', 'MOYENNE', 'MAX', 'MIN', 'NB']
  },
  {
    id: 'recherche',
    title: '2. Recherche',
    description: 'Retrouver des informations dans des bases de données et catalogues.',
    color: 'blue',
    badge: '4 fonctions',
    functions: ['RECHERCHEV', 'INDEX', 'EQUIV', 'RECHERCHE']
  },
  {
    id: 'dates',
    title: '3. Dates et heures',
    description: 'Manipuler le calendrier, calculer des délais et extraire le jour, mois, année.',
    color: 'amber',
    badge: '5 fonctions',
    functions: ['AUJOURDHUI', 'MAINTENANT', 'JOUR', 'MOIS', 'ANNEE']
  },
  {
    id: 'texte',
    title: '4. Texte',
    description: 'Nettoyer, découper, combiner et mesurer les chaînes de caractères.',
    color: 'purple',
    badge: '5 fonctions',
    functions: ['GAUCHE', 'DROITE', 'STXT', 'CONCATENER', 'NBCAR']
  },
  {
    id: 'conditions',
    title: '5. Conditions',
    description: 'Prendre des décisions logiques et filtrer les calculs selon des règles.',
    color: 'teal',
    badge: '5 fonctions',
    functions: ['SI', 'ET', 'OU', 'NB.SI', 'SOMME.SI']
  }
];

export const CATEGORY_FUNCTIONS: CategoryFunctionItem[] = [
  // --- 1. CALCULS ---
  {
    id: 'somme',
    name: 'SOMME',
    englishName: 'SUM',
    category: 'calculs',
    role: 'Additionner une plage de nombres',
    simpleExplanation: 'Calcule la somme totale de toutes les valeurs numériques situées dans les cellules indiquées. Ignore automatiquement le texte.',
    syntax: '=SOMME(nombre1; [nombre2]; ...)',
    syntaxDetail: 'Exemple : =SOMME(B2:B6) additionne toutes les cellules de B2 à B6.',
    formulaExample: '=SOMME(B2:B6)',
    formulaEnglish: '=SUM(B2:B6)',
    proTip: 'Pratique : évitez de faire =A1+A2+A3+A4+A5, SOMME(A1:A5) est 10 fois plus rapide et n\'affiche pas d\'erreur si une case est vide.',
    sampleData: {
      headers: ['Dépense (A)', 'Montant € (B)', 'Total (C)'],
      rows: [
        ['Loyer', 950, ''],
        ['Électricité', 120, ''],
        ['Assurance', 65, ''],
        ['Internet', 40, ''],
        ['Fournitures', 85, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '1 260 €'
    }
  },
  {
    id: 'moyenne',
    name: 'MOYENNE',
    englishName: 'AVERAGE',
    category: 'calculs',
    role: 'Calculer la moyenne arithmétique',
    simpleExplanation: 'Additionne toutes les valeurs puis divise automatiquement par le nombre de cellules remplies.',
    syntax: '=MOYENNE(plage)',
    syntaxDetail: 'Exemple : =MOYENNE(B2:B6) donne la note ou le panier moyen.',
    formulaExample: '=MOYENNE(B2:B6)',
    formulaEnglish: '=AVERAGE(B2:B6)',
    proTip: 'Les cellules contenant du texte ou vides ne faussent pas la moyenne ; en revanche, une cellule avec 0 sera prise en compte.',
    sampleData: {
      headers: ['Élève (A)', 'Note / 20 (B)', 'Moyenne classe (C)'],
      rows: [
        ['Lucas', 15, ''],
        ['Sarah', 12, ''],
        ['Alexandre', 18, ''],
        ['Emma', 11, ''],
        ['Thomas', 14, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '14,0 / 20'
    }
  },
  {
    id: 'max',
    name: 'MAX',
    englishName: 'MAX',
    category: 'calculs',
    role: 'Trouver la valeur la plus élevée',
    simpleExplanation: 'Parcourt une liste de nombres et renvoie le plus grand montant sans avoir besoin de trier le tableau.',
    syntax: '=MAX(plage)',
    syntaxDetail: 'Exemple : =MAX(B2:B6) repère le meilleur score ou la plus grosse vente.',
    formulaExample: '=MAX(B2:B6)',
    formulaEnglish: '=MAX(B2:B6)',
    proTip: 'Idéal pour identifier le record de ventes ou la facture la plus lourde.',
    sampleData: {
      headers: ['Commercial (A)', 'Ventes € (B)', 'Record (C)'],
      rows: [
        ['Sophie', 14500, ''],
        ['Julien', 28900, ''],
        ['Karim', 19800, ''],
        ['Béatrice', 32400, ''],
        ['David', 21100, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '32 400 €'
    }
  },
  {
    id: 'min',
    name: 'MIN',
    englishName: 'MIN',
    category: 'calculs',
    role: 'Trouver la plus petite valeur',
    simpleExplanation: 'Parcourt une liste de nombres et renvoie le plus petit montant de la sélection.',
    syntax: '=MIN(plage)',
    syntaxDetail: 'Exemple : =MIN(B2:B6) repère le prix le plus bas d\'un comparatif.',
    formulaExample: '=MIN(B2:B6)',
    formulaEnglish: '=MIN(B2:B6)',
    proTip: 'Très utilisé pour comparer les devis de plusieurs fournisseurs et isoler le moins cher.',
    sampleData: {
      headers: ['Fournisseur (A)', 'Tarif HT (B)', 'Meilleur prix (C)'],
      rows: [
        ['Fournisseur A', 450, ''],
        ['Fournisseur B', 380, ''],
        ['Fournisseur C', 510, ''],
        ['Fournisseur D', 340, ''],
        ['Fournisseur E', 420, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '340 €'
    }
  },
  {
    id: 'nb',
    name: 'NB',
    englishName: 'COUNT',
    category: 'calculs',
    role: 'Compter le nombre de valeurs numériques',
    simpleExplanation: 'Compte combien de cellules contiennent des nombres dans une plage donnée.',
    syntax: '=NB(plage)',
    syntaxDetail: 'Exemple : =NB(B2:B6) compte les lignes ayant un chiffre renseigné.',
    formulaExample: '=NB(B2:B6)',
    formulaEnglish: '=COUNT(B2:B6)',
    proTip: 'Attention : NB compte uniquement les chiffres. Pour compter les cellules contenant du texte, utilisez NBVAL().',
    sampleData: {
      headers: ['Client (A)', 'Acompte versé € (B)', 'Clients payeurs (C)'],
      rows: [
        ['Société Alpha', 500, ''],
        ['Beta SAS', '', ''],
        ['Gamma SARL', 750, ''],
        ['Delta Tech', 300, ''],
        ['Epsilon', '', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '3'
    }
  },

  // --- 2. RECHERCHE ---
  {
    id: 'recherchev',
    name: 'RECHERCHEV',
    englishName: 'VLOOKUP',
    category: 'recherche',
    role: 'Recherche verticale dans un tableau',
    simpleExplanation: 'Cherche un code ou un nom dans la première colonne d\'un tableau et rapporte une donnée située sur la même ligne dans une autre colonne.',
    syntax: '=RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche])',
    syntaxDetail: 'valeur_cherchée en D2, table A2:B6, no_index 2, dernier argument FAUX pour correspondance exacte.',
    formulaExample: '=RECHERCHEV(D2; A2:B6; 2; FAUX)',
    formulaEnglish: '=VLOOKUP(D2, A2:B6, 2, FALSE)',
    proTip: 'Toujours mettre FAUX à la fin pour éviter les mauvaises correspondances approximatives.',
    sampleData: {
      headers: ['Code (A)', 'Produit (B)', 'Code Cherché (D)', 'Produit Trouvé (E)'],
      rows: [
        ['REF-01', 'Souris sans fil', 'REF-03', ''],
        ['REF-02', 'Clavier USB', '', ''],
        ['REF-03', 'Écran 27 pouces', '', ''],
        ['REF-04', 'Casque audio', '', '']
      ],
      formulaCell: 'E2',
      calculatedValue: 'Écran 27 pouces'
    }
  },
  {
    id: 'index',
    name: 'INDEX',
    englishName: 'INDEX',
    category: 'recherche',
    role: 'Renvoyer la valeur à une coordonnée précise',
    simpleExplanation: 'Extrait le contenu d\'une cellule dans un tableau en lui indiquant simplement le numéro de ligne (et de colonne).',
    syntax: '=INDEX(matrice; no_ligne; [no_colonne])',
    syntaxDetail: 'Exemple : =INDEX(B2:B6; 3) renvoie la 3ème valeur de la colonne B.',
    formulaExample: '=INDEX(B2:B6; 3)',
    formulaEnglish: '=INDEX(B2:B6, 3)',
    proTip: 'Combinée avec EQUIV(), la fonction INDEX remplace avantageusement RECHERCHEV car elle peut chercher vers la gauche !',
    sampleData: {
      headers: ['Position (A)', 'Ville (B)', '3ème Ville (C)'],
      rows: [
        ['1', 'Paris', ''],
        ['2', 'Marseille', ''],
        ['3', 'Lyon', ''],
        ['4', 'Toulouse', ''],
        ['5', 'Nice', '']
      ],
      formulaCell: 'C2',
      calculatedValue: 'Lyon'
    }
  },
  {
    id: 'equiv',
    name: 'EQUIV',
    englishName: 'MATCH',
    category: 'recherche',
    role: 'Trouver le numéro de ligne d\'un élément',
    simpleExplanation: 'Cherche un mot ou un code dans une liste et vous indique à quelle position (numéro de ligne) il se trouve.',
    syntax: '=EQUIV(valeur_cherchée; plage_recherche; [type])',
    syntaxDetail: 'type 0 signifie correspondance exacte.',
    formulaExample: '=EQUIV("Lyon"; B2:B6; 0)',
    formulaEnglish: '=MATCH("Lyon", B2:B6, 0)',
    proTip: 'EQUIV donne la position (ex : 3), qu\'on transmet ensuite à INDEX pour récupérer la valeur associée.',
    sampleData: {
      headers: ['N° Ligne (A)', 'Ville (B)', 'Position de "Lyon" (C)'],
      rows: [
        ['1', 'Paris', ''],
        ['2', 'Marseille', ''],
        ['3', 'Lyon', ''],
        ['4', 'Toulouse', ''],
        ['5', 'Nice', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '3'
    }
  },
  {
    id: 'recherche',
    name: 'RECHERCHE',
    englishName: 'LOOKUP',
    category: 'recherche',
    role: 'Recherche simple par vecteur',
    simpleExplanation: 'Recherche une valeur dans une colonne ou ligne et extrait la valeur correspondante dans un second vecteur.',
    syntax: '=RECHERCHE(valeur_cherchée; vecteur_recherche; [vecteur_résultat])',
    syntaxDetail: 'Cherche dans le premier vecteur et renvoie le même rang dans le second.',
    formulaExample: '=RECHERCHE(D2; A2:A5; B2:B5)',
    formulaEnglish: '=LOOKUP(D2, A2:A5, B2:B5)',
    proTip: 'Pour que RECHERCHE fonctionne correctement, la colonne de recherche doit obligatoirement être triée par ordre croissant.',
    sampleData: {
      headers: ['Barème € (A)', 'Niveau (B)', 'Vente (D)', 'Niveau Obtenu (E)'],
      rows: [
        [0, 'Débutant', 3500, ''],
        [1000, 'Intermédiaire', '', ''],
        [3000, 'Confirmé', '', ''],
        [5000, 'Expert', '', '']
      ],
      formulaCell: 'E2',
      calculatedValue: 'Confirmé'
    }
  },

  // --- 3. DATES ET HEURES ---
  {
    id: 'aujourdhui',
    name: 'AUJOURDHUI',
    englishName: 'TODAY',
    category: 'dates',
    role: 'Obtenir la date du jour',
    simpleExplanation: 'Renvoie automatiquement la date du jour sans heure. Se recalcule chaque jour à l\'ouverture du classeur.',
    syntax: '=AUJOURDHUI()',
    syntaxDetail: 'Cette fonction n\'a aucun argument, il suffit d\'ouvrir et fermer les parenthèses ().',
    formulaExample: '=AUJOURDHUI()',
    formulaEnglish: '=TODAY()',
    proTip: 'Pour calculer un retard de paiement : =AUJOURDHUI() - A2 donne le nombre de jours écoulés depuis l\'échéance !',
    sampleData: {
      headers: ['Facture (A)', 'Date Émission (B)', 'Date du jour (C)'],
      rows: [
        ['FAC-101', '01/10/2026', ''],
        ['FAC-102', '05/10/2026', ''],
        ['FAC-103', '10/10/2026', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '11/10/2026'
    }
  },
  {
    id: 'maintenant',
    name: 'MAINTENANT',
    englishName: 'NOW',
    category: 'dates',
    role: 'Obtenir la date et l\'heure exactes',
    simpleExplanation: 'Renvoie la date et l\'heure actuelles de votre ordinateur, pratique pour dater des réceptions ou logs.',
    syntax: '=MAINTENANT()',
    syntaxDetail: 'Fonction sans argument : =MAINTENANT().',
    formulaExample: '=MAINTENANT()',
    formulaEnglish: '=NOW()',
    proTip: 'Formatez la cellule en [hh:mm:ss] si vous voulez afficher uniquement l\'heure sans la date.',
    sampleData: {
      headers: ['Action (A)', 'Horodatage (B)', 'Temps réel (C)'],
      rows: [
        ['Validation commande', '11/10/2026 14:30', ''],
        ['Contrôle qualité', '11/10/2026 15:15', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '11/10/2026 18:00'
    }
  },
  {
    id: 'jour',
    name: 'JOUR',
    englishName: 'DAY',
    category: 'dates',
    role: 'Extraire le numéro du jour (1-31)',
    simpleExplanation: 'Isole le jour du mois à partir d\'une date complète.',
    syntax: '=JOUR(numéro_de_série)',
    syntaxDetail: 'Exemple : si A2 contient le 15/04/2026, =JOUR(A2) renvoie 15.',
    formulaExample: '=JOUR(A2)',
    formulaEnglish: '=DAY(A2)',
    proTip: 'Permet de regrouper vos statistiques par jour du mois (ex: voir les ventes des débuts de mois vs fins de mois).',
    sampleData: {
      headers: ['Date complète (A)', 'Jour extrait (B)', 'Statut'],
      rows: [
        ['15/04/2026', '', 'Milieu de mois'],
        ['01/05/2026', '', 'Début de mois'],
        ['28/06/2026', '', 'Fin de mois']
      ],
      formulaCell: 'B2',
      calculatedValue: '15'
    }
  },
  {
    id: 'mois',
    name: 'MOIS',
    englishName: 'MONTH',
    category: 'dates',
    role: 'Extraire le numéro du mois (1-12)',
    simpleExplanation: 'Extrait le numéro du mois (1 pour Janvier, 12 pour Décembre) d\'une date.',
    syntax: '=MOIS(numéro_de_série)',
    syntaxDetail: 'Exemple : si A2 vaut le 15/04/2026, =MOIS(A2) renvoie 4 (Avril).',
    formulaExample: '=MOIS(A2)',
    formulaEnglish: '=MONTH(A2)',
    proTip: 'Parfait pour créer une colonne « Mois » à utiliser dans un Tableau Croisé Dynamique (TCD).',
    sampleData: {
      headers: ['Date commande (A)', 'Numéro de mois (B)', 'Trimestre'],
      rows: [
        ['15/04/2026', '', 'T2'],
        ['08/09/2026', '', 'T3'],
        ['24/12/2026', '', 'T4']
      ],
      formulaCell: 'B2',
      calculatedValue: '4'
    }
  },
  {
    id: 'annee',
    name: 'ANNEE',
    englishName: 'YEAR',
    category: 'dates',
    role: 'Extraire l\'année (ex: 2026)',
    simpleExplanation: 'Récupère uniquement l\'année à 4 chiffres contenue dans une date.',
    syntax: '=ANNEE(numéro_de_série)',
    syntaxDetail: 'Exemple : =ANNEE(A2) renvoie 2026.',
    formulaExample: '=ANNEE(A2)',
    formulaEnglish: '=YEAR(A2)',
    proTip: 'Permet de calculer l\'âge ou l\'ancienneté : =ANNEE(AUJOURDHUI()) - ANNEE(A2).',
    sampleData: {
      headers: ['Date d\'embauche (A)', 'Année d\'embauche (B)', 'Poste'],
      rows: [
        ['14/05/2018', '', 'Chef de projet'],
        ['22/10/2021', '', 'Développeur'],
        ['03/01/2024', '', 'Designer']
      ],
      formulaCell: 'B2',
      calculatedValue: '2018'
    }
  },

  // --- 4. TEXTE ---
  {
    id: 'gauche',
    name: 'GAUCHE',
    englishName: 'LEFT',
    category: 'texte',
    role: 'Extraire les premiers caractères d\'un texte',
    simpleExplanation: 'Coupe un texte pour ne garder que les premiers caractères en partant de la gauche.',
    syntax: '=GAUCHE(texte; [no_car])',
    syntaxDetail: 'texte = cellule source, no_car = nombre de caractères à récupérer.',
    formulaExample: '=GAUCHE(A2; 3)',
    formulaEnglish: '=LEFT(A2, 3)',
    proTip: 'Idéal pour isoler un préfixe de référence ou le code pays.',
    sampleData: {
      headers: ['Référence (A)', 'Préfixe (B)', 'Description'],
      rows: [
        ['FRA-1049', '', 'France'],
        ['ESP-8821', '', 'Espagne'],
        ['DEU-3301', '', 'Allemagne']
      ],
      formulaCell: 'B2',
      calculatedValue: 'FRA'
    }
  },
  {
    id: 'droite',
    name: 'DROITE',
    englishName: 'RIGHT',
    category: 'texte',
    role: 'Extraire les derniers caractères d\'un texte',
    simpleExplanation: 'Coupe un texte pour ne garder que les derniers caractères en partant de la droite.',
    syntax: '=DROITE(texte; [no_car])',
    syntaxDetail: 'texte = cellule source, no_car = nombre de caractères à la fin.',
    formulaExample: '=DROITE(A2; 4)',
    formulaEnglish: '=RIGHT(A2, 4)',
    proTip: 'Très utile pour extraire l\'extension d\'un fichier (.pdf, .xlsx) ou les 4 derniers chiffres d\'un numéro de série.',
    sampleData: {
      headers: ['Code Produit (A)', 'Identifiant final (B)', 'Famille'],
      rows: [
        ['PROD-9840', '', 'Électronique'],
        ['PROD-7120', '', 'Informatique'],
        ['PROD-4410', '', 'Bureautique']
      ],
      formulaCell: 'B2',
      calculatedValue: '9840'
    }
  },
  {
    id: 'stxt',
    name: 'STXT',
    englishName: 'MID',
    category: 'texte',
    role: 'Extraire du texte situé au milieu',
    simpleExplanation: 'Extrait un morceau de texte en lui indiquant la position de départ et la longueur souhaitée.',
    syntax: '=STXT(texte; no_départ; nb_caractères)',
    syntaxDetail: 'texte = A2, début = 5ème lettre, longueur = 3 lettres.',
    formulaExample: '=STXT(A2; 5; 3)',
    formulaEnglish: '=MID(A2, 5, 3)',
    proTip: 'Parfait pour extraire le département dans un numéro de sécurité sociale ou un code postal au milieu d\'une adresse.',
    sampleData: {
      headers: ['Matricule (A)', 'Code Service (B)', 'Employé'],
      rows: [
        ['EMP-RH1-99', '', 'Sophie'],
        ['EMP-IT2-40', '', 'Lucas'],
        ['EMP-MK3-12', '', 'Emma']
      ],
      formulaCell: 'B2',
      calculatedValue: 'RH1'
    }
  },
  {
    id: 'concatener',
    name: 'CONCATENER',
    englishName: 'CONCATENATE',
    category: 'texte',
    role: 'Fusionner plusieurs textes ensemble',
    simpleExplanation: 'Colle plusieurs textes ou cellules ensemble pour former une seule phrase ou chaîne.',
    syntax: '=CONCATENER(texte1; [texte2]; ...)',
    syntaxDetail: 'Exemple : =CONCATENER(A2; " "; B2) fusionne Prénom et Nom avec un espace.',
    formulaExample: '=CONCATENER(A2; " "; B2)',
    formulaEnglish: '=CONCATENATE(A2, " ", B2)',
    proTip: 'Astuce rapide : l\'esperluette & fait exactement la même chose ! =A2 & " " & B2 est plus court à taper.',
    sampleData: {
      headers: ['Prénom (A)', 'Nom (B)', 'Nom Complet (C)'],
      rows: [
        ['Jean', 'Dupont', ''],
        ['Marie', 'Curie', ''],
        ['Victor', 'Hugo', '']
      ],
      formulaCell: 'C2',
      calculatedValue: 'Jean Dupont'
    }
  },
  {
    id: 'nbcar',
    name: 'NBCAR',
    englishName: 'LEN',
    category: 'texte',
    role: 'Compter le nombre de caractères d\'une cellule',
    simpleExplanation: 'Compte le nombre de caractères (lettres, chiffres, symboles et espaces compris) d\'une cellule.',
    syntax: '=NBCAR(texte)',
    syntaxDetail: 'Exemple : =NBCAR(A2) vérifie la longueur d\'un mot de passe ou numéro.',
    formulaExample: '=NBCAR(A2)',
    formulaEnglish: '=LEN(A2)',
    proTip: 'Idéal pour vérifier la validité d\'un numéro de téléphone (10 chiffres) ou d\'un code postal (5 chiffres).',
    sampleData: {
      headers: ['Mot de passe (A)', 'Longueur (B)', 'Sécurité'],
      rows: [
        ['Secret2026!', '', 'Robuste'],
        ['Excel12', '', 'Moyen'],
        ['Pass', '', 'Faible']
      ],
      formulaCell: 'B2',
      calculatedValue: '11'
    }
  },

  // --- 5. CONDITIONS ---
  {
    id: 'si',
    name: 'SI',
    englishName: 'IF',
    category: 'conditions',
    role: 'Effectuer un test logique conditionnel',
    simpleExplanation: 'Vérifie si une condition est respectée. Affiche un premier résultat si OUI, et un second résultat si NON.',
    syntax: '=SI(test_logique; valeur_si_vrai; valeur_si_faux)',
    syntaxDetail: 'Exemple : =SI(B2>=10; "Admis"; "Recalé").',
    formulaExample: '=SI(B2>=10; "Admis"; "Recalé")',
    formulaEnglish: '=IF(B2>=10, "Admis", "Recalé")',
    proTip: 'N\'oubliez jamais les guillemets autour du texte : "Admis", mais pas autour des nombres.',
    sampleData: {
      headers: ['Candidat (A)', 'Note (B)', 'Résultat (C)'],
      rows: [
        ['Antoine', 14, ''],
        ['Béatrice', 8.5, ''],
        ['Claire', 11, ''],
        ['David', 9, '']
      ],
      formulaCell: 'C2',
      calculatedValue: 'Admis'
    }
  },
  {
    id: 'et',
    name: 'ET',
    englishName: 'AND',
    category: 'conditions',
    role: 'Vérifier que TOUTES les conditions sont réunies',
    simpleExplanation: 'Renvoie VRAI uniquement si toutes les conditions indiquées sont respectées en même temps.',
    syntax: '=ET(condition1; [condition2]; ...)',
    syntaxDetail: 'Exemple : =ET(B2>=1000; C2="Validé"). Souvent imbriqué dans un SI().',
    formulaExample: '=SI(ET(B2>=1000; C2="Validé"); "Prime accordée"; "Non éligible")',
    formulaEnglish: '=IF(AND(B2>=1000, C2="Validé"), "Prime accordée", "Non éligible")',
    proTip: 'Très utile pour les validations complexes (ex : statut Validé ET montant supérieur à 1 000 €).',
    sampleData: {
      headers: ['Ventes € (B)', 'Statut (C)', 'Prime accordée ? (D)'],
      rows: [
        [1500, 'Validé', ''],
        [800, 'Validé', ''],
        [2000, 'En attente', ''],
        [1200, 'Validé', '']
      ],
      formulaCell: 'D2',
      calculatedValue: 'Prime accordée'
    }
  },
  {
    id: 'ou',
    name: 'OU',
    englishName: 'OR',
    category: 'conditions',
    role: 'Vérifier qu\'AU MOINS UNE condition est respectée',
    simpleExplanation: 'Renvoie VRAI dès qu\'une seule des conditions est satisfaite, sans exiger que toutes le soient.',
    syntax: '=OU(condition1; [condition2]; ...)',
    syntaxDetail: 'Exemple : =OU(B2>=50; C2>=50).',
    formulaExample: '=SI(OU(B2="VIP"; C2>500); "Remise 10%"; "Tarif normal")',
    formulaEnglish: '=IF(OR(B2="VIP", C2>500), "Remise 10%", "Tarif normal")',
    proTip: 'À combiner avec SI pour accorder un avantage soit aux clients VIP, soit aux paniers de plus de 500 €.',
    sampleData: {
      headers: ['Statut Client (B)', 'Panier € (C)', 'Tarif appliqué (D)'],
      rows: [
        ['VIP', 250, ''],
        ['Standard', 650, ''],
        ['Standard', 120, '']
      ],
      formulaCell: 'D2',
      calculatedValue: 'Remise 10%'
    }
  },
  {
    id: 'nb-si',
    name: 'NB.SI',
    englishName: 'COUNTIF',
    category: 'conditions',
    role: 'Compter les cellules répondant à un critère',
    simpleExplanation: 'Parcourt une plage et compte combien de cellules correspondent au critère spécifié (texte ou nombre).',
    syntax: '=NB.SI(plage; critère)',
    syntaxDetail: 'plage = B2:B6, critère = "Validé" ou ">100".',
    formulaExample: '=NB.SI(B2:B6; "Validé")',
    formulaEnglish: '=COUNTIF(B2:B6, "Validé")',
    proTip: 'Pour compter les nombres supérieurs à 100, écrivez le critère entre guillemets : ">100".',
    sampleData: {
      headers: ['Dossier (A)', 'Statut (B)', 'Nombre Validés (C)'],
      rows: [
        ['DOS-01', 'Validé', ''],
        ['DOS-02', 'En attente', ''],
        ['DOS-03', 'Validé', ''],
        ['DOS-04', 'Validé', ''],
        ['DOS-05', 'Rejeté', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '3'
    }
  },
  {
    id: 'somme-si',
    name: 'SOMME.SI',
    englishName: 'SUMIF',
    category: 'conditions',
    role: 'Additionner les cellules selon un critère',
    simpleExplanation: 'Additionne uniquement les montants des lignes qui respectent une condition précise.',
    syntax: '=SOMME.SI(plage_critère; critère; [plage_somme])',
    syntaxDetail: 'plage_critère = B2:B6, critère = "Paris", plage_somme = C2:C6.',
    formulaExample: '=SOMME.SI(B2:B6; "Paris"; C2:C6)',
    formulaEnglish: '=SUMIF(B2:B6, "Paris", C2:C6)',
    proTip: 'Veillez à ce que la colonne des critères et la colonne des montants aient le même nombre de lignes.',
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
    }
  }
];
