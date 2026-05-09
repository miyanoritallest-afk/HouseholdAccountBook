"use client";

import { useState } from "react";

type Props = {
  onConfirm: (value: number) => void;
  onClose: () => void;
  initialValue?: string;
};

export default function Calculator({ onConfirm, onClose, initialValue = "" }: Props) {
  const [display, setDisplay] = useState(initialValue || "0");
  const [expression, setExpression] = useState("");
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (expression && !waitingForOperand) {
      const result = evaluate(expression + display);
      setDisplay(String(result));
      setExpression(String(result) + op);
    } else {
      setExpression(String(current) + op);
    }
    setWaitingForOperand(true);
  };

  const evaluate = (expr: string): number => {
    try {
      // 安全な四則演算のみ評価
      const sanitized = expr.replace(/[^0-9+\-*/.()\s]/g, "");
      // eslint-disable-next-line no-new-func
      return new Function(`return ${sanitized}`)() as number;
    } catch {
      return 0;
    }
  };

  const handleEquals = () => {
    if (!expression) return;
    const result = evaluate(expression + display);
    const rounded = Math.round(result);
    setDisplay(String(rounded));
    setExpression("");
    setWaitingForOperand(true);
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (waitingForOperand) return;
    const next = display.length > 1 ? display.slice(0, -1) : "0";
    setDisplay(next);
  };

  const handleConfirm = () => {
    const val = Math.round(parseFloat(display));
    if (!isNaN(val) && val > 0) {
      onConfirm(val);
    }
  };

  const displayNumber = parseFloat(display);
  const formatted = isNaN(displayNumber)
    ? display
    : display.endsWith(".")
    ? display
    : Number.isInteger(displayNumber)
    ? displayNumber.toLocaleString("ja-JP")
    : displayNumber.toLocaleString("ja-JP");

  const btnBase = "flex items-center justify-center rounded-lg text-lg font-medium h-12 transition-colors active:scale-95";
  const btnGray = `${btnBase} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  const btnOrange = `${btnBase} bg-orange-400 text-white hover:bg-orange-500`;
  const btnBlue = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`;
  const btnRed = `${btnBase} bg-red-50 text-red-600 hover:bg-red-100`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-72 rounded-2xl bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 式と結果表示 */}
        <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-right">
          <p className="h-4 text-xs text-gray-400">{expression}</p>
          <p className="mt-0.5 text-2xl font-bold text-gray-800 tabular-nums">{formatted}</p>
        </div>

        {/* ボタングリッド */}
        <div className="grid grid-cols-4 gap-2">
          <button className={btnRed} onClick={handleClear}>C</button>
          <button className={btnGray} onClick={handleBackspace}>⌫</button>
          <button className={btnGray} onClick={() => handleOperator("%")}>%</button>
          <button className={btnOrange} onClick={() => handleOperator("/")}>÷</button>

          <button className={btnGray} onClick={() => handleDigit("7")}>7</button>
          <button className={btnGray} onClick={() => handleDigit("8")}>8</button>
          <button className={btnGray} onClick={() => handleDigit("9")}>9</button>
          <button className={btnOrange} onClick={() => handleOperator("*")}>×</button>

          <button className={btnGray} onClick={() => handleDigit("4")}>4</button>
          <button className={btnGray} onClick={() => handleDigit("5")}>5</button>
          <button className={btnGray} onClick={() => handleDigit("6")}>6</button>
          <button className={btnOrange} onClick={() => handleOperator("-")}>−</button>

          <button className={btnGray} onClick={() => handleDigit("1")}>1</button>
          <button className={btnGray} onClick={() => handleDigit("2")}>2</button>
          <button className={btnGray} onClick={() => handleDigit("3")}>3</button>
          <button className={btnOrange} onClick={() => handleOperator("+")}>＋</button>

          <button className={`${btnGray} col-span-2`} onClick={() => handleDigit("0")}>0</button>
          <button className={btnGray} onClick={handleDecimal}>.</button>
          <button className={btnOrange} onClick={handleEquals}>=</button>
        </div>

        {/* 確定・キャンセル */}
        <div className="mt-3 flex gap-2">
          <button
            className="flex-1 rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className={`${btnBlue} flex-1 py-2 text-sm`}
            onClick={handleConfirm}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
