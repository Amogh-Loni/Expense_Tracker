class MinHeap {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
    this._up();
  }

  pop() {
    if (this.data.length === 1) return this.data.pop();
    const root = this.data[0];
    this.data[0] = this.data.pop();
    this._down();
    return root;
  }

  _up() {
    let i = this.data.length - 1;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (this.data[p].balance <= this.data[i].balance) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  _down() {
    let i = 0;
    while (true) {
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      let s = i;
      if (l < this.data.length && this.data[l].balance < this.data[s].balance) s = l;
      if (r < this.data.length && this.data[r].balance < this.data[s].balance) s = r;
      if (s === i) break;
      [this.data[i], this.data[s]] = [this.data[s], this.data[i]];
      i = s;
    }
  }

  isEmpty() {
    return this.data.length === 0;
  }
}

class MaxHeap {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
    this._up();
  }

  pop() {
    if (this.data.length === 1) return this.data.pop();
    const root = this.data[0];
    this.data[0] = this.data.pop();
    this._down();
    return root;
  }

  _up() {
    let i = this.data.length - 1;
    while (i > 0) {
      let p = Math.floor((i - 1) / 2);
      if (this.data[p].balance >= this.data[i].balance) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  _down() {
    let i = 0;
    while (true) {
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      let s = i;
      if (l < this.data.length && this.data[l].balance > this.data[s].balance) s = l;
      if (r < this.data.length && this.data[r].balance > this.data[s].balance) s = r;
      if (s === i) break;
      [this.data[i], this.data[s]] = [this.data[s], this.data[i]];
      i = s;
    }
  }

  isEmpty() {
    return this.data.length === 0;
  }
}

function minimizeTransactions(balances) {
  const debtors = new MinHeap();
  const creditors = new MaxHeap();

  for (const person in balances) {
    const bal = balances[person];
    if (bal < 0) debtors.push({ person, balance: bal });
    if (bal > 0) creditors.push({ person, balance: bal });
  }

  const result = [];

  while (!debtors.isEmpty() && !creditors.isEmpty()) {
    const d = debtors.pop();
    const c = creditors.pop();

    const amt = Math.min(c.balance, -d.balance);

    result.push({ from: d.person, to: c.person, amount: amt });

    d.balance += amt;
    c.balance -= amt;

    if (d.balance < 0) debtors.push(d);
    if (c.balance > 0) creditors.push(c);
  }

  return result;
}

module.exports = minimizeTransactions;
