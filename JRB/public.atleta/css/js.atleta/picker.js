// Utilitário simples de "roleta" (picker) com overlay, rolagem e seleção
class SimplePicker {
  constructor({ title, options, searchable = false, onConfirm }) {
    this.title = title;
    this.allOptions = options; // [{label, value}]
    this.options = [...options];
    this.searchable = searchable;
    this.onConfirm = onConfirm;
    this.activeValue = null;
  }

  open(currentValue = null) {
    this.activeValue = currentValue;
    this._render();
  }

  close() {
    if (this.overlay) {
      document.body.removeChild(this.overlay);
      this.overlay = null;
    }
  }

  _render() {
    // Overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'picker-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Sheet
    const sheet = document.createElement('div');
    sheet.className = 'picker-sheet';

    // Header
    const header = document.createElement('div');
    header.className = 'picker-header';
    const titleEl = document.createElement('div');
    titleEl.className = 'picker-title';
    titleEl.textContent = this.title;
    header.appendChild(titleEl);
    sheet.appendChild(header);

    // Search
    if (this.searchable) {
      const search = document.createElement('input');
      search.className = 'picker-search';
      search.type = 'search';
      search.placeholder = 'Buscar...';
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        this.options = this.allOptions.filter(opt => {
          const label = opt.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return label.includes(q);
        });
        this._renderList(list);
      });
      sheet.appendChild(search);
    }

    // List
    const list = document.createElement('div');
    list.className = 'picker-list';
    this._renderList(list);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'picker-actions';
    const btnCancel = document.createElement('button');
    btnCancel.className = 'picker-btn cancel';
    btnCancel.textContent = 'Cancelar';
    btnCancel.addEventListener('click', () => this.close());

    const btnOk = document.createElement('button');
    btnOk.className = 'picker-btn ok';
    btnOk.textContent = 'Selecionar';
    btnOk.addEventListener('click', () => {
      if (this.onConfirm && this.activeValue != null) {
        const found = this.allOptions.find(o => o.value === this.activeValue);
        this.onConfirm(found || null);
      }
      this.close();
    });

    actions.appendChild(btnCancel);
    actions.appendChild(btnOk);

    // Mount
    sheet.appendChild(list);
    sheet.appendChild(actions);
    this.overlay.appendChild(sheet);
    document.body.appendChild(this.overlay);
  }

  _renderList(listEl) {
    listEl.innerHTML = '';
    if (!this.options.length) {
      const empty = document.createElement('div');
      empty.className = 'picker-item';
      empty.textContent = 'Nenhum resultado';
      empty.style.color = '#777';
      listEl.appendChild(empty);
      return;
    }
    this.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'picker-item' + (opt.value === this.activeValue ? ' active' : '');
      item.textContent = opt.label;
      item.addEventListener('click', () => {
        this.activeValue = opt.value;
        // realça seleção
        [...listEl.children].forEach(c => c.classList.remove('active'));
        item.classList.add('active');
      });
      listEl.appendChild(item);
    });
  }
}

// Helpers para montar pickers padrão
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
    searchable: false,
    onConfirm: (opt) => {
      if (!opt) return;
      hiddenInput.value = opt.value;
      displayEl.dataset.value = opt.value;
      displayEl.innerHTML = `<span>${opt.label}</span><span class="chevron">▾</span>`;
      displayEl.classList.remove('error');
    }
  });

  displayEl.addEventListener('click', () => {
    picker.open(displayEl.dataset.value || null);
  });
}

export function initTeamPicker({ displayEl, hiddenInput, fetchTeamsUrl }) {
  async function loadTeams() {
    const res = await fetch(fetchTeamsUrl);
    const teams = await res.json(); // [{id,name}]
    const options = teams.map(t => ({ label: t.name, value: String(t.id) }));
    const picker = new SimplePicker({
      title: 'Selecionar equipe',
      options,
      searchable: true,
      onConfirm: (opt) => {
        if (!opt) return;
        hiddenInput.value = opt.value;
        displayEl.dataset.value = opt.value;
        displayEl.innerHTML = `<span>${opt.label}</span><span class="chevron">▾</span>`;
        displayEl.classList.remove('error');
      }
    });
    displayEl.addEventListener('click', () => {
      picker.open(displayEl.dataset.value || null);
    });
  }
  loadTeams().catch(err => console.error('Erro ao carregar equipes:', err));
}
