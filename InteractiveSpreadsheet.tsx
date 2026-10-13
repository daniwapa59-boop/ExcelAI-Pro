import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Sparkles, MoveHorizontal } from 'lucide-react';
import { SampleSpreadsheetData } from '../types';
import { copyFormulaToClipboard } from '../utils/clipboard';

interface InteractiveSpreadsheetProps {
  data: SampleSpreadsheetData;
  formula: string;
  title?: string;
  subtitle?: string;
}

export const InteractiveSpreadsheet: React.FC<InteractiveSpreadsheetProps> = ({
  data,
  formula,
  title,
  subtitle
}) => {
  const [gridRows, setGridRows] = useState<(string | number)[][]>(() => 
    data.rows.map(row => [...row])
  );
  const [copied, setCopied] = useState(false);
  const [selectedCell, setSelectedCell] = useState<string>(data.formulaCell || 'A1');

  // Reset grid
  const handleReset = () => {
    setGridRows(data.rows.map(row => [...row]));
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updated = [...gridRows];
    updated[rowIndex] = [...updated[rowIndex]];
    // Simple number conversion if applicable
    const num = Number(value);
    updated[rowIndex][colIndex] = !isNaN(num) && value.trim() !== '' ? num : value;
    setGridRows(updated);
  };

  const copyFormula = async () => {
    const ok = await copyFormulaToClipboard(formula);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Convert column index 0, 1, 2 to Excel letters A, B, C...
  const getColLetter = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            {title || 'Simulateur interactif Excel'}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition active:scale-95"
            title="Réinitialiser les valeurs par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
          <button
            type="button"
            onClick={copyFormula}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition shadow-xs active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié !' : 'Copier la formule'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-3 py-1 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
        <span className="flex items-center gap-1">
          <MoveHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          Faites défiler horizontalement pour voir toutes les colonnes
        </span>
      </div>

      {/* Formula Bar like real Excel */}
      <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-xs font-mono">
        <div className="w-12 px-2 py-1 bg-white border border-slate-300 rounded text-center text-slate-700 font-semibold shadow-2xs">
          {selectedCell}
        </div>
        <div className="text-slate-400 font-bold px-1 select-none flex items-center">
          <span className="italic text-emerald-700 font-serif text-sm">fx</span>
        </div>
        <div className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 font-mono overflow-x-auto whitespace-nowrap shadow-2xs text-xs sm:text-sm">
          {formula}
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-600 border-b border-slate-300 select-none">
              <th className="w-10 py-1.5 px-2 bg-slate-200 text-slate-500 border-r border-slate-300 text-center font-normal">
                #
              </th>
              {data.headers.map((header, colIdx) => (
                <th
                  key={colIdx}
                  className="py-1.5 px-3 border-r border-slate-300 text-left font-medium text-slate-700 min-w-[130px]"
                >
                  <div className="flex items-center justify-between">
                    <span>{header}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-1">
                      {getColLetter(colIdx)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridRows.map((row, rowIdx) => {
              const rowNumber = rowIdx + 2; // Assuming row 1 is header
              return (
                <tr key={rowIdx} className="hover:bg-slate-50/70 border-b border-slate-200">
                  <td className="py-1.5 px-2 bg-slate-100 text-slate-500 border-r border-slate-300 text-center font-mono select-none">
                    {rowNumber}
                  </td>
                  {row.map((cellValue, colIdx) => {
                    const cellAddress = `${getColLetter(colIdx)}${rowNumber}`;
                    const isFormulaCell = cellAddress === data.formulaCell;

                    if (isFormulaCell) {
                      return (
                        <td
                          key={colIdx}
                          onClick={() => setSelectedCell(cellAddress)}
                          className="py-1.5 px-3 border-r border-slate-200 bg-emerald-50 text-emerald-950 font-semibold relative cursor-pointer ring-1 ring-inset ring-emerald-600"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-emerald-900">
                              {data.calculatedValue}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 bg-emerald-200 text-emerald-800 rounded font-sans uppercase">
                              fx
                            </span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={colIdx}
                        onClick={() => setSelectedCell(cellAddress)}
                        className={`py-1 px-2 border-r border-slate-200 ${
                          selectedCell === cellAddress ? 'bg-blue-50/50 ring-1 ring-inset ring-emerald-500' : ''
                        }`}
                      >
                        <input
                          type="text"
                          value={cellValue !== undefined ? cellValue : ''}
                          onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                          className="w-full bg-transparent border-none outline-none text-slate-800 font-sans focus:ring-0 px-1 py-0.5"
                          placeholder="—"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer tips */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Les cellules blanches sont modifiables pour tester vos propres données.
        </span>
        <span className="font-mono text-slate-400">
          Cellule résultat : {data.formulaCell}
        </span>
      </div>
    </div>
  );
};
