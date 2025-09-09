class SimplePicker {
  constructor({ title, options, searchable = false, onConfirm }) {
    this.title = title;
    this.options = options;
    this.searchable = searchable;
    this.onConfirm = onConfirm;
    this.activeValue = null;
  }
  open(currentValue = null) {
    this.activeValue = currentValue;
    this._render();
  }
  close() {
    if (this.overlay) document.body.removeChild(this.overlay);
  }
  _render() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'picker-overlay';
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });
    const sheet = document.createElement('div');
    sheet.className = 'picker-sheet';
    const titleEl = document.createElement('div');
    titleEl.className = 'picker-title';
    titleEl.textContent = this.title;
    sheet.appendChild(titleEl);
    const list = document.createElement('div');
    list.className = 'picker-list';
    this.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'picker-item' + (opt.value === this.activeValue ? ' active' : '');
      item.textContent = opt.label;
      item.addEventListener('click', () => {
        this.activeValue = opt.value;
        [...list.children].forEach(c => c.classList.remove('active'));
        item.classList.add('active');
      });
      list.appendChild(item);
    });
    sheet.appendChild(list);
    const actions = document.createElement('div');
    actions.className = 'picker-actions';
    const btnCancel = document.createElement('button');
    btnCancel.className = 'picker-btn cancel';
    btnCancel.textContent = 'Cancelar';
    btnCancel.onclick = () => this.close();
    const btnOk = document.createElement('button');
    btnOk.className = 'picker-btn ok';
    btnOk.textContent = 'Selecionar';
    btnOk.onclick = () => {
      if (this.onConfirm && this.activeValue != null) {
        const found = this.options.find(o => o.value === this.activeValue);
        this.onConfirm(found);
      }
      this.close();
    };
    actions.appendChild(btnCancel);
    actions.appendChild(btnOk);
    sheet.appendChild(actions);
    this.overlay.appendChild(sheet);
    document.body.appendChild(this.overlay);
  }
}

export function initBeltPicker({ displayEl, hiddenInput }) {
  const belts = [
    'branca','cinza','cinza/branca','cinza/preta',
    'amarela','amarela/branca','amarela/preta',
    'laranja','laranja/branca','laranja/preta',
    'verde','verde/branca','verde/preta',
    'azul','roxa','marrom','preta'
  ];
  const options = belts.map(b => ({ label: b, value: b }));
  const picker = new SimplePicker({
    title: 'Selecionar faixa',
    options,
    onConfirm: opt => {
      hiddenInput.value = opt.value;
      displayEl.innerHTML = `<span>${opt.label}</span><span>▾</span>`;
    }
  });
  displayEl.addEventListener('click', () => picker.open(hiddenInput.value || null));
}

export function initTeamPicker({ displayEl, hiddenInput, fetchTeamsUrl }) {
  fetch(fetchTeamsUrl)
    .then(r => r.json())
    .then(teams => {
      const options = teams.map(t => ({ label: t.name, value: String(t.id) }));
      const picker = new SimplePicker({
        title: 'Selecionar equipe',
        options,
        onConfirm: opt => {
          hiddenInput.value = opt.value;
          displayEl.innerHTML = `<span>${opt.label}</span><span>▾</span>`;
        }
      });
      displayEl.addEventListener('click', () => picker.open(hiddenInput.value || null));
    });
}
