import React, { useState, useEffect } from 'react';
import './App.css'; // Add styles for button animations

const mathFuncs = ["/", "*", "-", "+"];
const tips = [
  "Display limited to 10 characters.",
  "Use backspace to delete one character.",
  "Pressing CE will clear only the current entry.",
  "Pressing C will clear the history."
];

const Calculator = () => {
  const maxLength = 10;
  const maxHistoryLength = 20;

  const [entryVal, setEntryVal] = useState("0");
  const [calcHistory, setCalcHistory] = useState("");
  const [shownHistory, setShownHistory] = useState("NO HISTORY");
  const [tip, setTip] = useState(tips[0]);
  const [pressedButton, setPressedButton] = useState("");
  const [powerOn, setPowerOn] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTip((prev) => {
        const idx = tips.indexOf(prev);
        return tips[(idx + 1) % tips.length];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePower = () => {
  setPowerOn(!powerOn);
  setEntryVal(powerOn ? "" : "0");
  setShownHistory(powerOn ? "OFF" : "READY");
};

  const handleEntry = (val) => {
    if (entryVal.length >= maxLength) return;
    if (entryVal === "0" && val === ".") {
      setEntryVal("0.");
    } else if (entryVal === "0") {
      setEntryVal(val);
    } else if (val === "." && entryVal.includes(".")) {
      return;
    } else {
      setEntryVal(entryVal + val);
    }
  };

  const handleOperation = (op) => {
    const lastChar = calcHistory.slice(-1);
    let updatedHistory = calcHistory;
    if (entryVal !== "0") {
      updatedHistory += entryVal;
    }
    if (mathFuncs.includes(lastChar)) {
      updatedHistory = updatedHistory.slice(0, -1);
    }
    updatedHistory += op;
    setCalcHistory(updatedHistory);
    setEntryVal("0");
    updateShownHistory(updatedHistory);
  };

  const updateShownHistory = (history) => {
    const view = history.length > maxHistoryLength
      ? "..." + history.slice(-maxHistoryLength)
      : history;
    setShownHistory(view);
  };

  const handleClearEntry = () => {
    setEntryVal("0");
  };

  const handleClearHistory = () => {
    setEntryVal("0");
    setCalcHistory("");
    setShownHistory("NO HISTORY");
  };

  const handleBackspace = () => {
    setEntryVal(entryVal.length === 1 ? "0" : entryVal.slice(0, -1));
  };

  const handleTotal = () => {
    let expression = calcHistory;
    if (entryVal !== "0") {
      expression += entryVal;
    }
    if (mathFuncs.includes(expression.slice(-1))) {
      expression = expression.slice(0, -1);
    }
    try {
      const total = eval(expression).toString().slice(0, maxLength);
      setEntryVal(total);
      setCalcHistory("");
      setShownHistory(expression);
    } catch (e) {
      setEntryVal("Error");
    }
  };

  const buttons = [
    { id: "seven", label: "7", onClick: () => handleEntry("7") },
    { id: "eight", label: "8", onClick: () => handleEntry("8") },
    { id: "nine", label: "9", onClick: () => handleEntry("9") },
    { id: "divide", label: "/", onClick: () => handleOperation("/") },

    { id: "four", label: "4", onClick: () => handleEntry("4") },
    { id: "five", label: "5", onClick: () => handleEntry("5") },
    { id: "six", label: "6", onClick: () => handleEntry("6") },
    { id: "multiply", label: "*", onClick: () => handleOperation("*") },

    { id: "one", label: "1", onClick: () => handleEntry("1") },
    { id: "two", label: "2", onClick: () => handleEntry("2") },
    { id: "three", label: "3", onClick: () => handleEntry("3") },
    { id: "subtract", label: "-", onClick: () => handleOperation("-") },

    { id: "zero", label: "0", onClick: () => handleEntry("0") },
    { id: "decimal", label: ".", onClick: () => handleEntry(".") },
    { id: "total", label: "=", onClick: handleTotal },
    { id: "add", label: "+", onClick: () => handleOperation("+") },

    { id: "clearEntry", label: "CE", onClick: handleClearEntry },
    { id: "clearHistory", label: "C", onClick: handleClearHistory },
    { id: "backspace", label: "←", onClick: handleBackspace },
    { id: "power", label: powerOn ? "OFF" : "ON", onClick: handleTogglePower }
  ];

  const handleMouseDown = (id) => setPressedButton(id);
  const handleMouseUp = () => setPressedButton("");

  return (
    <div className="calculator">
      <div className="display">
        <div id="calcHistory">{shownHistory}</div>
        <div id="calcEntry">{entryVal}</div>
      </div>
      <div className="buttons">
        {buttons.map(({ id, label, onClick }) => (
          <button
            key={id}
            id={id}
            onClick={onClick}
            onMouseDown={() => handleMouseDown(id)}
            onMouseUp={handleMouseUp}
            className={pressedButton === id ? "calc-button-down" : ""}
          >
            {label}
          </button>
        ))}
      </div>
      <div id="tipText" className="tip">{tip}</div>
    </div>
  );
};

export default Calculator;
