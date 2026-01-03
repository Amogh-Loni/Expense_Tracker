import React, { useState } from 'react';
import BootOverlay from './BootOverlay';
import CanvasSystem from './CanvasSystem';
import './index.css';

export default function App() {
  const [boot, setBoot] = useState(true);

  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [shared, setShared] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlement, setSettlement] = useState([]);

  function addParticipant() {
    if (!name || participants.includes(name)) return;
    setParticipants([...participants, name]);
    setName('');
  }

  function toggleShared(p) {
    setShared(s =>
      s.includes(p) ? s.filter(x => x !== p) : [...s, p]
    );
  }

  function logExpense() {
    if (!amount || !paidBy || shared.length === 0) return;
    setExpenses([...expenses, { amount: Number(amount), paidBy, shared }]);
    setAmount('');
    setShared([]);
  }

  function settle() {
    const bal = {};
    participants.forEach(p => (bal[p] = 0));

    expenses.forEach(e => {
      const share = e.amount / e.shared.length;
      e.shared.forEach(p => (bal[p] -= share));
      bal[e.paidBy] += e.amount;
    });

    const debt = [], cred = [];
    Object.entries(bal).forEach(([p, v]) => {
      if (v < 0) debt.push([p, -v]);
      if (v > 0) cred.push([p, v]);
    });

    const res = [];
    let i = 0, j = 0;

    while (i < debt.length && j < cred.length) {
      const x = Math.min(debt[i][1], cred[j][1]);
      res.push(`${debt[i][0]} → ${cred[j][0]} : ₹${x.toFixed(2)}`);
      debt[i][1] -= x;
      cred[j][1] -= x;
      if (debt[i][1] === 0) i++;
      if (cred[j][1] === 0) j++;
    }

    setSettlement(res);
  }

  return (
    <>
      {boot && <BootOverlay onDone={() => setBoot(false)} />}
      <CanvasSystem />

      <div className="hud-root">
        <header className="hud-header">
          <h1 data-text="EXPENSE SPLITTER">EXPENSE SPLITTER</h1>
          <span>Jarvis Financial Core</span>
        </header>

        <div className="grid">
          <div className="panel">
            <h3>Participants</h3>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />
            <button onClick={addParticipant}>ADD</button>
            <ul>
              {participants.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <div className="panel">
            <h3>Log Expense</h3>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
            >
              <option value="">Paid By</option>
              {participants.map((p, i) => <option key={i}>{p}</option>)}
            </select>

            <div className="checks">
              {participants.map((p, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    checked={shared.includes(p)}
                    onChange={() => toggleShared(p)}
                  /> {p}
                </label>
              ))}
            </div>

            <button onClick={logExpense}>LOG</button>
          </div>

          <div className="panel">
            <h3>Expense Log</h3>
            <ul>
              {expenses.map((e, i) => (
                <li key={i}>₹{e.amount} by {e.paidBy}</li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3>Settlement Execution</h3>
            <button onClick={settle}>EXECUTE</button>
            <ul className="settle">
              {settlement.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
