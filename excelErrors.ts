export interface ExcelErrorInfo {
  code: string;
  name: string;
  shortDesc: string;
  mainCause: string;
  commonScenarios: string[];
  quickFix: string;
  exampleBroken: string;
  exampleFixed: string;
  proTip: string;
}

export const EXCEL_ERRORS_CATALOG: ExcelErrorInfo[] = [
  {
    code: '#REF!',
    name: 'Référence de cellule non valide',
    shortDesc: 'Une cellule, ligne ou colonne référencée a été supprimée ou déplacée.',
    mainCause: 'Vous avez supprimé la ligne ou colonne source, ou fait un copier/coller par-dessus une plage référencée.',
    commonScenarios: [
      'Suppression d\'une colonne intermédiaire incluse dans un calcul',
      'Fonction RECHERCHEV avec un numéro d\'index colonne supérieur au nombre de colonnes',
      'Liaison externe vers un classeur Excel fermé ou introuvable'
    ],
    quickFix: 'Appuyez immédiatement sur Ctrl + Z si vous venez de supprimer la colonne, ou remplacez la référence #REF! par la nouvelle plage valide.',
    exampleBroken: '=SOMME(A1;#REF!;C1)',
    exampleFixed: '=SOMME(A1:B1)',
    proTip: 'Utilisez des Tableaux structurés (Ctrl + L) au lieu de plages statiques pour éviter les erreurs lors de l\'ajout ou suppression de lignes.'
  },
  {
    code: '#N/A',
    name: 'Valeur non disponible (Not Available)',
    shortDesc: 'La valeur recherchée n\'existe pas dans la table de recherche.',
    mainCause: 'RECHERCHEV ou RECHERCHEX ne trouve pas la correspondance exacte dans la première colonne.',
    commonScenarios: [
      'Faute de frappe dans la clé recherchée (ex: espaces invisibles en fin de mot)',
      'Le format de la clé est "Texte" alors que la colonne cible est "Nombre" (ou l\'inverse)',
      'Paramètre de recherche approximative absent (dernier argument de RECHERCHEV omis ou faux)'
    ],
    quickFix: 'Entourez votre recherche avec SI.NON.DISP() pour afficher un texte personnalisé propre au lieu de #N/A.',
    exampleBroken: '=RECHERCHEV("Dupont"; A2:C50; 3; FAUX)',
    exampleFixed: '=SI.NON.DISP(RECHERCHEX(A2; Clients!A:A; Clients!C:C); "Client introuvable")',
    proTip: 'Privilégiez la fonction RECHERCHEX (XLOOKUP) disponible sur Excel 365, qui intègre nativement l\'argument [si_non_trouvé].'
  },
  {
    code: '#VALEUR!',
    name: 'Type de valeur incorrect (Value Error)',
    shortDesc: 'Une opération mathématique a rencontré du texte ou un format inattendu.',
    mainCause: 'Vous essayez d\'additionner ou multiplier une cellule qui contient du texte au lieu d\'un nombre.',
    commonScenarios: [
      'Utiliser le signe + au lieu de SOMME sur des cellules contenant du texte (ex: =A1+B1 où B1 est "N/A")',
      'Nombres écrits avec un point décimal (.) au lieu de la virgule (,) selon les paramètres régionaux',
      'Argument de date invalide ou texte entouré de guillemets non converti'
    ],
    quickFix: 'Utilisez la fonction SOMME() au lieu de l\'opérateur +, car SOMME ignore automatiquement les cellules de texte.',
    exampleBroken: '=A1 + B1  (quand B1 = "En attente")',
    exampleFixed: '=SOMME(A1; B1)',
    proTip: 'Sélectionnez vos colonnes de chiffres et faites "Données > Convertir" pour forcer la transformation des textes numériques en vrais nombres.'
  },
  {
    code: '#DIV/0!',
    name: 'Division par zéro',
    shortDesc: 'Une formule tente de diviser un nombre par zéro ou par une cellule vide.',
    mainCause: 'Le dénominateur de votre division vaut 0 ou la cellule est vide.',
    commonScenarios: [
      'Calcul d\'un pourcentage de réalisation quand l\'objectif initial est de 0',
      'Calcul de moyenne (MOYENNE) sur une plage où aucune cellule n\'a de valeur numérique',
      'Données de vente ou de trafic encore non renseignées en début de mois'
    ],
    quickFix: 'Encadrez la division avec la fonction SI() ou SIERREUR().',
    exampleBroken: '=B2 / C2  (quand C2 vaut 0 ou vide)',
    exampleFixed: '=SI(C2=0; 0; B2 / C2) ou =SIERREUR(B2 / C2; 0)',
    proTip: 'Pour les tableaux de bord présentés à votre direction, remplacez les #DIV/0! par "-" ou 0% pour un rendu impeccable.'
  },
  {
    code: '#NOM?',
    name: 'Nom de fonction ou de plage non reconnu',
    shortDesc: 'Excel ne reconnaît pas le mot utilisé dans la formule.',
    mainCause: 'Faute d\'orthographe dans le nom d\'une fonction ou oubli de guillemets autour d\'un texte.',
    commonScenarios: [
      'Écrire SOM en pensant à SOMME ou VLOOKUP sur un Excel en français',
      'Oubli des guillemets doubles autour d\'un mot : =SI(A1=Validé; 1; 0) au lieu de "Validé"',
      'Plage nommée supprimée ou mal orthographiée'
    ],
    quickFix: 'Vérifiez l\'orthographe de la fonction en français et assurez-vous que tous les textes sont entourés de guillemets doubles (" ").',
    exampleBroken: '=SI(A1=Paris; 10; 0)',
    exampleFixed: '=SI(A1="Paris"; 10; 0)',
    proTip: 'Utilisez l\'autocomplétion d\'Excel (touche Tabulation dès que la fonction apparaît dans la liste déroulante).'
  },
  {
    code: '#NUM!',
    name: 'Valeur numérique non valide',
    shortDesc: 'Un calcul mathématique impossible ou un résultat hors des limites d\'Excel.',
    mainCause: 'Calcul impossible (comme la racine carrée d\'un nombre négatif) ou nombre trop grand.',
    commonScenarios: [
      'Fonction RACINE(-25)',
      'Calcul itératif qui ne converge pas (ex: taux de rentabilité interne TRI)',
      'Fonction DATEDIF avec date de début postérieure à la date de fin'
    ],
    quickFix: 'Vérifiez la cohérence mathématique des paramètres (ex: inverser les dates dans DATEDIF).',
    exampleBroken: '=DATEDIF("2026-12-31"; "2026-01-01"; "D")',
    exampleFixed: '=DATEDIF("2026-01-01"; "2026-12-31"; "D")',
    proTip: 'Excel gère les nombres entre 1E-307 et 1E+307. Tout ce qui dépasse provoque #NUM!.'
  },
  {
    code: '#PROPAGATION!',
    name: 'Erreur de déversement (Spill)',
    shortDesc: 'Une formule matricielle dynamique est bloquée par des cellules non vides.',
    mainCause: 'La formule tente de renvoyer plusieurs lignes/colonnes (comme UNIQUE ou FILTRE), mais des cellules sur le chemin contiennent déjà du texte ou des valeurs.',
    commonScenarios: [
      'Utiliser =UNIQUE(A2:A100) en C2 alors que la cellule C5 contient déjà un texte',
      'Tableau Excel structuré qui n\'accepte pas les formules de propagation automatique'
    ],
    quickFix: 'Effacez ou déplacez le contenu des cellules en dessous ou à droite de la formule pour libérer l\'espace de déversement.',
    exampleBroken: '=UNIQUE(A2:A20)  (quand une cellule de la plage cible est occupée)',
    exampleFixed: 'Videz la colonne réceptrice pour laisser la formule s\'étendre librement',
    proTip: 'La bordure fine en pointillés bleu turquoise indique exactement la zone où la formule souhaite s\'étendre.'
  }
];
