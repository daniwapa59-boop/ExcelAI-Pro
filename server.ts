import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { generateLocalFormula } from './src/utils/formulaEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to sanitize Gemini JSON responses
function parseGeminiJson<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error('Failed to parse JSON from model:', err, text);
    return fallback;
  }
}

// API: Generate formula from natural language
app.post('/api/generate-formula', async (req, res) => {
  try {
    const { prompt, excelVersion = '365', language = 'fr', context = '' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'La description est requise.' });
    }

    if (!ai) {
      return res.json(generateLocalFormula(prompt, language, excelVersion, context));
    }

    const systemInstruction = `Tu es l'instructeur et expert Microsoft Excel d'ExcelAI Pro, spécialisé dans l'accompagnement des débutants et professionnels francophones.
Ta mission est d'aider les utilisateurs en créant la formule Excel exacte et optimale pour leur besoin.
Accorde une priorité absolue et naturelle aux 5 fonctions fondamentales en français si applicables :
1. SOMME (addition simple)
2. SI (test conditionnel)
3. RECHERCHEV (recherche verticale avec FAUX)
4. NB.SI (comptage conditionnel)
5. SOMME.SI (somme conditionnelle)
(Ou RECHERCHEX si version 365 demandée).

Règles de syntaxe strictes :
- Si language === 'fr', TOUJOURS utiliser les noms de fonctions en français et le séparateur point-virgule (;).
- Si language === 'en', utiliser les noms anglais et la virgule (,).
- Explication pédagogique, bienveillante et accessible aux débutants sans jargon abstrait.
- Fournis obligatoirement un exemple de mini-tableau réaliste (sampleData) avec colonnes lisibles, 3 à 5 lignes, et le résultat calculé pour le simulateur interactif.
Réponds EXCLUSIVEMENT sous forme d'un objet JSON valide.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Description de l'utilisateur : "${prompt}"
Version Excel ciblée : ${excelVersion}
Langue d'interface Excel souhaitée : ${language === 'fr' ? 'Français (séparateur ;)' : 'Anglais (séparateur ,)'}
Contexte ou colonnes indiquées : "${context}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            formula: { type: Type.STRING, description: 'La formule principale exacte commençant par =' },
            formulaAlt: { type: Type.STRING, description: 'Une alternative moderne ou plus simple' },
            formulaEnglish: { type: Type.STRING, description: 'La version équivalente en anglais international avec virgule' },
            explanation: { type: Type.STRING, description: 'Explication pédagogique et claire en français simple' },
            components: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  part: { type: Type.STRING, description: 'Morceau ou argument de la formule' },
                  role: { type: Type.STRING, description: 'Rôle de cet argument' },
                  detail: { type: Type.STRING, description: 'Explication pour débutant' }
                },
                required: ['part', 'role', 'detail']
              }
            },
            sampleData: {
              type: Type.OBJECT,
              properties: {
                headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                rows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                formulaCell: { type: Type.STRING, description: 'Emplacement de la formule (ex: D2 ou E5)' },
                calculatedValue: { type: Type.STRING, description: 'Résultat visible obtenu' }
              },
              required: ['headers', 'rows', 'formulaCell', 'calculatedValue']
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 ou 3 astuces pratiques ou pièges à éviter'
            }
          },
          required: ['formula', 'formulaEnglish', 'explanation', 'components', 'sampleData', 'tips']
        }
      }
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.json(generateLocalFormula(prompt, language, excelVersion, context));
    }

    res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini generateContent error, using intelligent fallback:', error?.message);
    // Return high quality deterministic formula without failing or returning 500
    const fallbackFormula = generateLocalFormula(
      req.body?.prompt || 'SOMME',
      req.body?.language || 'fr',
      req.body?.excelVersion || '365',
      req.body?.context || ''
    );
    res.json(fallbackFormula);
  }
});

// API: Explain formula
app.post('/api/explain-formula', async (req, res) => {
  try {
    const { formula, language = 'fr' } = req.body;

    if (!formula || typeof formula !== 'string') {
      return res.status(400).json({ error: 'La formule est requise.' });
    }

    if (!ai) {
      return res.json({
        summary: `Cette formule analyse les données spécifiées et renvoie le résultat calculé.`,
        translatedFormula: formula.startsWith('=') ? formula : `=${formula}`,
        breakdown: [
          'Étape 1: Excel évalue les arguments intérieurs.',
          'Étape 2: La fonction principale traite la condition ou le calcul.',
          'Étape 3: Le résultat final est affiché dans la cellule.'
        ],
        functionsUsed: [
          { name: 'Fonction', purpose: 'Calcul ou recherche automatisée', frenchName: 'FR', englishName: 'EN' }
        ],
        edgeCases: [
          'Vérifiez la concordance exacte des plages (même nombre de lignes).',
          'Attention aux espaces invisibles dans le texte.'
        ],
        sampleData: {
          headers: ['A', 'B', 'C', 'Résultat'],
          rows: [['Exemple 1', '10', '20', '30']],
          formulaCell: 'D2',
          calculatedValue: 'Succès'
        }
      });
    }

    const systemInstruction = `Tu es l'instructeur pédagogique d'ExcelAI Pro.
Tu dois expliquer une formule Excel en français simple et accessible, sans jargon intimidant.
Décompose précisément le fonctionnement, la traduction français/anglais des fonctions utilisées, l'ordre d'évaluation logique par Excel, et les pièges classiques (cases vides, types de données incompatibles, erreurs de formatage).
Fournis également un jeu d'essai (sampleData) pour visualiser la formule en action dans un mini-tableur.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Explique cette formule Excel : "${formula}"
Langue préférée de l'utilisateur : ${language}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Résumé en 1 ou 2 phrases claires de ce que fait la formule' },
            translatedFormula: { type: Type.STRING, description: 'La formule traduite (si FR vers EN, ou si EN vers FR)' },
            breakdown: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Étapes détaillées d\'évaluation pas à pas'
            },
            functionsUsed: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  frenchName: { type: Type.STRING },
                  englishName: { type: Type.STRING }
                },
                required: ['name', 'purpose']
              }
            },
            edgeCases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Points de vigilance ou cas particuliers'
            },
            sampleData: {
              type: Type.OBJECT,
              properties: {
                headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                rows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                formulaCell: { type: Type.STRING },
                calculatedValue: { type: Type.STRING }
              },
              required: ['headers', 'rows', 'formulaCell', 'calculatedValue']
            }
          },
          required: ['summary', 'breakdown', 'functionsUsed', 'edgeCases', 'sampleData']
        }
      }
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.json({
        summary: `Cette formule analyse la sélection et renvoie le résultat calculé.`,
        translatedFormula: formula.startsWith('=') ? formula : `=${formula}`,
        breakdown: [
          'Étape 1: Excel évalue les arguments intérieurs.',
          'Étape 2: La fonction traite la condition ou le calcul.',
          'Étape 3: Le résultat est affiché dans la cellule.'
        ],
        functionsUsed: [
          { name: 'Fonction Excel', purpose: 'Calcul ou recherche automatisée', frenchName: 'FR', englishName: 'EN' }
        ],
        edgeCases: [
          'Vérifiez la concordance des plages (même dimension).',
          'Vérifiez l\'absence d\'espaces invisibles.'
        ],
        sampleData: {
          headers: ['A', 'B', 'C', 'Résultat'],
          rows: [['Ligne 1', '10', '20', '30']],
          formulaCell: 'D2',
          calculatedValue: 'Calculé'
        }
      });
    }

    res.json(parsed);
  } catch (error: any) {
    console.warn('Error explaining formula, returning fallback:', error?.message);
    const formulaStr = req.body?.formula || '=SOMME(A1:A5)';
    res.json({
      summary: `Explication de la formule ${formulaStr}.`,
      translatedFormula: formulaStr.startsWith('=') ? formulaStr : `=${formulaStr}`,
      breakdown: [
        'Étape 1: Excel identifie les plages de cellules concernées.',
        'Étape 2: L\'opération mathématique ou logique est effectuée.',
        'Étape 3: Le résultat est renvoyé sans altérer les données d\'origine.'
      ],
      functionsUsed: [
        { name: 'Excel', purpose: 'Traitement automatique des données' }
      ],
      edgeCases: [
        'Attention au séparateur : point-virgule (;) en français, virgule (,) en anglais.'
      ],
      sampleData: {
        headers: ['Données A', 'Données B', 'Résultat'],
        rows: [['10', '20', '30']],
        formulaCell: 'C2',
        calculatedValue: 'Succès'
      }
    });
  }
});

// API: Fix Excel Errors (#REF!, #N/A, #VALEUR!, etc.)
app.post('/api/fix-error', async (req, res) => {
  try {
    const { errorCode, formula = '', description = '', context = '' } = req.body;

    if (!errorCode && !formula && !description) {
      return res.status(400).json({ error: 'Veuillez spécifier l\'erreur ou la formule problématique.' });
    }

    if (!ai) {
      return res.json({
        errorType: errorCode || '#VALEUR!',
        diagnosis: `L'erreur ${errorCode || '#VALEUR!'} survient généralement lorsqu'un type de données inattendu est rencontré.`,
        rootCauses: [
          'Cellules contenant du texte au lieu de nombres lors d\'un calcul.',
          'Espaces insécables ou ponctuation inadéquate.',
          'Plages de dimensions inégales.'
        ],
        solutionFormula: formula ? `=SIERREUR(${formula}; 0)` : '=SI.NON.DISP(RECHERCHEX(A2;B:B;C:C;"Non trouvé");"")',
        safeFormula: formula ? `=SIERREUR(${formula}; "Non disponible")` : '=SIERREUR(A1/B1; 0)',
        actionSteps: [
          '1. Cliquez sur la cellule avec le losange d\'avertissement pour voir l\'indication Excel.',
          '2. Utilisez l\'outil "Évaluation de formule" dans l\'onglet Formules pour isoler l\'étape fautive.',
          '3. Entourez votre calcul avec SIERREUR() ou SI.NON.DISP().'
        ],
        sampleFix: {
          problemCase: 'Calcul sur cellule contenant du texte "N/A"',
          correctionExplanation: 'Convertir le texte en nombre ou gérer l\'exception avec SIERREUR.'
        }
      });
    }

    const systemInstruction = `Tu es le spécialiste du diagnostic et dépannage d'erreurs Excel (comme #REF!, #N/A, #VALEUR!, #DIV/0!, #NOM?, #NUM!, #NUL!, #PROPAGATION!, etc.) pour ExcelAI Pro.
Explique avec précision et bienveillance :
1. Pourquoi cette erreur se produit exactement.
2. Comment corriger la formule en fournissant une version robuste et sécurisée (ex: avec SIERREUR ou SI.NON.DISP).
3. Les manipulations pratiques à faire dans Excel (ex: vérifier les formats de cellule, rétablir une plage supprimée, adapter le séparateur).
Réponds uniquement en JSON structuré.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Code d'erreur : ${errorCode || 'Non précisé'}
Formule en cause : ${formula || 'Non fournie'}
Description du problème par l'utilisateur : ${description || 'Aucune'}
Contexte des données : ${context || 'Général'}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            errorType: { type: Type.STRING },
            diagnosis: { type: Type.STRING, description: 'Analyse claire du problème' },
            rootCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Causes courantes'
            },
            solutionFormula: { type: Type.STRING, description: 'Formule corrigée recommandée' },
            safeFormula: { type: Type.STRING, description: 'Formule sécurisée contre les erreurs futures' },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Étapes concrètes pas à pas à réaliser dans Excel'
            },
            sampleFix: {
              type: Type.OBJECT,
              properties: {
                problemCase: { type: Type.STRING },
                correctionExplanation: { type: Type.STRING }
              },
              required: ['problemCase', 'correctionExplanation']
            }
          },
          required: ['errorType', 'diagnosis', 'rootCauses', 'solutionFormula', 'safeFormula', 'actionSteps']
        }
      }
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.json({
        errorType: errorCode || '#VALEUR!',
        diagnosis: `L'erreur ${errorCode || '#VALEUR!'} est généralement causée par des types de données incompatibles.`,
        rootCauses: [
          'Calcul arithmétique sur une cellule contenant du texte.',
          'Référence de cellule manquante ou supprimée.',
          'Séparateur inadéquat (utiliser le point-virgule en français).'
        ],
        solutionFormula: formula ? `=SIERREUR(${formula}; 0)` : '=SIERREUR(SOMME(A1:A5); 0)',
        safeFormula: formula ? `=SI.NON.DISP(${formula}; "Non trouvé")` : '=SIERREUR(A1/B1; 0)',
        actionSteps: [
          '1. Cliquez sur le symbole d\'avertissement pour afficher le détail.',
          '2. Utilisez l\'évaluation de formule pour isoler l\'erreur.',
          '3. Entourez de SIERREUR pour gérer le cas propre.'
        ]
      });
    }

    res.json(parsed);
  } catch (error: any) {
    console.warn('Error fixing error, returning fallback:', error?.message);
    const errCode = req.body?.errorCode || '#VALEUR!';
    const formulaStr = req.body?.formula || '';
    res.json({
      errorType: errCode,
      diagnosis: `L'erreur ${errCode} survient lorsque des données incompatibles sont fournies à la formule.`,
      rootCauses: [
        'Cellule contenant du texte au lieu d\'un nombre.',
        'Référence introuvable ou supprimée.',
        'Espaces superflus dans les cellules.'
      ],
      solutionFormula: formulaStr ? `=SIERREUR(${formulaStr}; 0)` : '=SIERREUR(SOMME(A1:A5); 0)',
      safeFormula: formulaStr ? `=SI.NON.DISP(${formulaStr}; "Introuvable")` : '=SIERREUR(A1/B1; "Erreur")',
      actionSteps: [
        '1. Vérifiez que les cellules contiennent bien des chiffres.',
        '2. Assurez-vous que les colonnes ont des données valides.',
        '3. Utilisez SIERREUR pour sécuriser la formule.'
      ]
    });
  }
});

// API: Freeform general Excel assistant
app.post('/api/freeform-assistant', async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Votre question est requise.' });
    }

    if (!ai) {
      return res.json({
        answer: `Pour accomplir cela dans Excel :\n1. Sélectionnez vos données.\n2. Utilisez la fonction adaptée ou un Tableau Croisé Dynamique.\n3. Vérifiez la validation des données pour éviter les erreurs de saisie.`,
        suggestedFormulas: ['=RECHERCHEX(A2; Table1[ID]; Table1[Nom])', '=SOMME.SI.ENS(C:C; A:A; "Nord"; B:B; "Validé")'],
        shortcuts: ['Ctrl + E : Remplissage instantané (Flash Fill)', 'Alt + F1 : Créer un graphique instantané']
      });
    }

    const systemInstruction = `Tu es l'assistant conversationnel expert d'ExcelAI Pro.
L'utilisateur te pose une question libre sur Excel : comment créer un tableau croisé dynamique, comment formater des dates, comment nettoyer des doublons, quelle formule utiliser, comment automatiser une tâche, etc.
Fournis une réponse structurée, concise, pédagogique, avec des étapes claires et des formules ou raccourcis concrets.
Tous les textes doivent être en français.`;

    const contents = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      {
        role: 'user',
        parts: [{ text: query }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING, description: 'Réponse détaillée et bien structurée en français' },
            suggestedFormulas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Formules recommandées s\'il y a lieu'
            },
            shortcuts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Raccourcis clavier ou astuces d\'efficacité Excel pertinents'
            },
            nextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Suggestions de questions suivantes ou d\'approfondissement'
            }
          },
          required: ['answer']
        }
      }
    });

    const parsed = parseGeminiJson(response.text || '{}', null);
    if (!parsed) {
      return res.json({
        answer: `Pour réaliser cette action dans Excel :\n1. Organisez vos données avec des colonnes clairement nommées.\n2. Utilisez la fonction adaptée (SOMME, SI, RECHERCHEV, NB.SI).\n3. Vous pouvez également utiliser un Tableau Croisé Dynamique via l'onglet Insertion.`,
        suggestedFormulas: ['=SOMME(A2:A10)', '=RECHERCHEV(A2; B2:D10; 2; FAUX)'],
        shortcuts: ['Ctrl + T : Créer un tableau structuré', 'Ctrl + L : Activer les filtres']
      });
    }

    res.json(parsed);
  } catch (error: any) {
    console.warn('Error in freeform assistant, returning fallback:', error?.message);
    res.json({
      answer: `Pour réaliser cette action dans Excel :\n1. Organisez vos données avec des colonnes clairement nommées.\n2. Utilisez la formule la plus adaptée à votre besoin.\n3. Pour les calculs complexes, privilégiez les Tableaux Croisés Dynamiques (TCD).`,
      suggestedFormulas: ['=SOMME(A2:A10)', '=SI(B2>=10; "Validé"; "À revoir")'],
      shortcuts: ['F4 : Figer les cellules avec des $', 'Ctrl + E : Remplissage automatique instantané']
    });
  }
});

// Serve frontend in dev or prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`ExcelAI Pro server running on http://localhost:${port}`);
});
