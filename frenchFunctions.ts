import { SampleSpreadsheetData } from '../types';

export interface FrenchFunctionCard {
  name: string;
  englishName: string;
  roleShort: string;
  descriptionSimple: string;
  syntax: string;
  syntaxExplanation: string;
  formulaExample: string;
  promptExample: string;
  tips: string;
  sampleData: SampleSpreadsheetData;
}

export const TOP_5_FRENCH_FUNCTIONS: FrenchFunctionCard[] = [
  {
    name: 'SOMME',
    englishName: 'SUM',
    roleShort: 'Additionner une série de nombres',
    descriptionSimple: 'Calcule le total de toutes les valeurs dans une plage de cellules en un seul coup.',
    syntax: '=SOMME(plage)',
    syntaxExplanation: 'plage = les cellules à additionner (ex : B2:B6).',
    formulaExample: '=SOMME(B2:B6)',
    promptExample: 'Calculer la somme totale des montants situés dans la colonne B de la ligne 2 à 6.',
    tips: 'SOMME ignore automatiquement les cellules contenant du texte, contrairement à l\'opérateur + qui afficherait #VALEUR!.',
    sampleData: {
      headers: ['Mois (A)', 'Dépenses € (B)', 'Total Calculé (C)'],
      rows: [
        ['Janvier', 1250, ''],
        ['Février', 980, ''],
        ['Mars', 1420, ''],
        ['Avril', 1100, ''],
        ['Mai', 1650, '']
      ],
      formulaCell: 'C2',
      calculatedValue: '6 400 €'
    }
  },
  {
    name: 'SI',
    englishName: 'IF',
    roleShort: 'Tester une condition et renvoyer 2 résultats',
    descriptionSimple: 'Affiche un résultat si la condition est VRAIE, et un autre résultat différent si elle est FAUSSE.',
    syntax: '=SI(test_logique; valeur_si_vrai; valeur_si_faux)',
    syntaxExplanation: 'test = la comparaison (ex: B2>=10), si_vrai = ce qu\'on affiche si oui, si_faux = ce qu\'on affiche si non.',
    formulaExample: '=SI(B2>=10; "Admis"; "Recalé")',
    promptExample: 'Si la note en B2 est supérieure ou égale à 10 afficher "Admis", sinon afficher "Recalé".',
    tips: 'N\'oubliez pas de mettre des guillemets doubles " " autour des textes (comme "Admis"), mais pas autour des nombres.',
    sampleData: {
      headers: ['Candidat (A)', 'Moyenne (B)', 'Résultat (C)'],
      rows: [
        ['Lucas', 14, ''],
        ['Emma', 8.5, ''],
        ['Thomas', 11, ''],
        ['Sarah', 9.5, '']
      ],
      formulaCell: 'C2',
      calculatedValue: 'Admis'
    }
  },
  {
    name: 'RECHERCHEV',
    englishName: 'VLOOKUP',
    roleShort: 'Rechercher une valeur verticalement',
    descriptionSimple: 'Cherche un code ou un nom dans la première colonne d\'un tableau et rapporte une information située sur la même ligne.',
    syntax: '=RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche])',
    syntaxExplanation: 'Cherche la valeur en colonne 1 de la table, et renvoie la colonne N. Terminez toujours par FAUX pour une correspondance exacte.',
    formulaExample: '=RECHERCHEV(D2; A2:B6; 2; FAUX)',
    promptExample: 'Rechercher le prix de l\'article dont le code est en D2 dans le tableau A2:B6 et renvoyer la 2ème colonne.',
    tips: 'Le mot clé FAUX à la fin est obligatoire pour éviter de récupérer une mauvaise référence approximative.',
    sampleData: {
      headers: ['Code (A)', 'Article (B)', 'Code Cherché (D)', 'Article Trouvé (E)'],
      rows: [
        ['ART-01', 'Ordinateur Portable', 'ART-03', ''],
        ['ART-02', 'Souris sans fil', '', ''],
        ['ART-03', 'Écran 24 pouces', '', ''],
        ['ART-04', 'Clavier USB', '', '']
      ],
      formulaCell: 'E2',
      calculatedValue: 'Écran 24 pouces'
    }
  },
  {
    name: 'NB.SI',
    englishName: 'COUNTIF',
    roleShort: 'Compter le nombre de cellules selon un critère',
    descriptionSimple: 'Compte combien de cellules respectent une condition précise (ex : combien de ventes dépassent 100 €, combien de "Validé").',
    syntax: '=NB.SI(plage; critère)',
    syntaxExplanation: 'plage = les cellules à vérifier, critère = la valeur cherchée entre guillemets si c\'est du texte (ex: "Validé") ou ">100".',
    formulaExample: '=NB.SI(B2:B6; "Validé")',
    promptExample: 'Compter combien de fois le statut "Validé" apparaît dans la colonne B2:B6.',
    tips: 'Pour compter les cellules supérieures à un nombre, écrivez le critère entre guillemets : ">50".',
    sampleData: {
      headers: ['Dossier (A)', 'Statut (B)', 'Total "Validé" (C)'],
      rows: [
        ['DOS-101', 'Validé', ''],
        ['DOS-102', 'En attente', ''],
        ['DOS-103', 'Validé', ''],
        ['DOS-104', 'Validé', ''],
        ['DOS-105', 'Rejeté', '']
      ],
      formulaCell: 'C2',
      calculatedValue: '3'
    }
  },
  {
    name: 'SOMME.SI',
    englishName: 'SUMIF',
    roleShort: 'Additionner les cellules selon un critère',
    descriptionSimple: 'Calcule la somme de montants uniquement pour les lignes qui correspondent à une catégorie ou un filtre précis.',
    syntax: '=SOMME.SI(plage_critère; critère; [plage_somme])',
    syntaxExplanation: 'Examine la plage_critère, et si elle égale le critère, additionne la cellule correspondante dans plage_somme.',
    formulaExample: '=SOMME.SI(B2:B6; "Paris"; C2:C6)',
    promptExample: 'Additionner le chiffre d\'affaires en colonne C pour toutes les commandes de la ville "Paris" en colonne B.',
    tips: 'Vérifiez que la plage_critère et la plage_somme ont exactement le même nombre de lignes (ex : B2:B6 et C2:C6).',
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
