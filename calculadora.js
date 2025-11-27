// calculadora.js
// Módulo principal: separa la lógica de cálculo (model) de la manipulación del DOM (view/controller).

const MAX_HISTORY = 10;

function roundResult(num){
  if (!isFinite(num)) return num;
  // redondeo a 10 decimales evitando errores de punto flotante
  const factor = Math.pow(10, 10);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

class CalculatorModel{
  constructor(){
    this.clearAll();
    this.history = [];
  }

  clearAll(){
    this.current = '0';
    this.previous = null;
    this.operator = null;
    this.justComputed = false;
  }

  deleteLast(){
    if (this.justComputed) { this.current = '0'; this.justComputed = false; return; }
    if (this.current.length <= 1) { this.current = '0'; return; }
    this.current = this.current.slice(0, -1);
  }

  appendNumber(d){
    if (this.justComputed){ this.current = (d === '.'? '0.' : d); this.justComputed = false; return; }
    if (d === '.' && this.current.includes('.')) return; // prevenir dos puntos
    if (this.current === '0' && d !== '.') this.current = d; else this.current += d;
  }

  chooseOperator(op){
    if (this.operator && !this.justComputed){
      this.compute();
    }
    this.operator = op;
    this.previous = this.current;
    this.current = '0';
    this.justComputed = false;
  }

  percent(){
    const val = parseFloat(this.current);
    this.current = String(roundResult(val / 100));
    this.justComputed = true;
  }

  compute(){
    if (this.operator == null || this.previous == null) return;
    const a = parseFloat(this.previous);
    const b = parseFloat(this.current);
    let res;
    switch(this.operator){
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/':
        if (b === 0){ res = NaN; break; }
        res = a / b; break;
      default: res = NaN;
    }
    res = roundResult(res);
    const expression = `${this.previous} ${this.operator} ${this.current} = ${res}`;
    this._pushHistory(expression);
    this.current = String(res);
    this.previous = null;
    this.operator = null;
    this.justComputed = true;
  }

  _pushHistory(item){
    this.history.unshift(item);
    if (this.history.length > MAX_HISTORY) this.history.pop();
  }
}

// Controller / View
const App = (function(){
  const model = new CalculatorModel();
  const selectors = {
    buttons: document.getElementById('buttons'),
    result: document.getElementById('result'),
    historyList: document.getElementById('historyList'),
    historyPreview: document.getElementById('historyPreview'),
    toggleTheme: document.getElementById('btnToggleTheme')
  };

  function updateDisplay(){
    let text = model.current;
    // manejar números grandes: limitar a 15 caracteres visuales
    if (text.length > 15){
      const n = Number(text);
      text = n.toExponential(10);
    }
    selectors.result.textContent = text;
    selectors.historyPreview.textContent = model.history[0] || '';
    renderHistory();
  }

  function renderHistory(){
    selectors.historyList.innerHTML = '';
    model.history.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      selectors.historyList.appendChild(li);
    });
  }

  function handleButtonClick(e){
    const btn = e.target.closest('button');
    if (!btn || !selectors.buttons.contains(btn)) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;
    switch(action){
      case 'number': model.appendNumber(value); break;
      case 'decimal': model.appendNumber('.'); break;
      case 'operator': model.chooseOperator(value); break;
      case 'equals': model.compute(); break;
      case 'percent': model.percent(); break;
      case 'clear': model.clearAll(); break;
      case 'delete': model.deleteLast(); break;
      default: break;
    }
    updateDisplay();
  }

  function handleKey(e){
    const k = e.key;
    if ((/^[0-9]$/).test(k)) { model.appendNumber(k); updateDisplay(); return; }
    if (k === '.') { model.appendNumber('.'); updateDisplay(); return; }
    if (k === '+' || k === '-' || k === '*' || k === '/') { model.chooseOperator(k); updateDisplay(); return; }
    if (k === 'Enter' || k === '=') { e.preventDefault(); model.compute(); updateDisplay(); return; }
    if (k === 'Backspace') { model.deleteLast(); updateDisplay(); return; }
    if (k === 'Escape') { model.clearAll(); updateDisplay(); return; }
    if (k === '%') { model.percent(); updateDisplay(); return; }
  }

  function toggleTheme(){
    const root = document.documentElement;
    const pressed = selectors.toggleTheme.getAttribute('aria-pressed') === 'true';
    if (pressed){
      root.classList.remove('dark');
      selectors.toggleTheme.setAttribute('aria-pressed','false');
    } else {
      root.classList.add('dark');
      selectors.toggleTheme.setAttribute('aria-pressed','true');
    }
  }

  function init(){
    selectors.buttons.addEventListener('click', handleButtonClick);
    document.addEventListener('keydown', handleKey);
    selectors.toggleTheme.addEventListener('click', toggleTheme);
    updateDisplay();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
