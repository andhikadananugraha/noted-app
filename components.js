class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <h1>Notes App</h1>
      </header>
    `;
  }
}
customElements.define('app-bar', AppBar);

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container">
        <h2>Tambah Catatan</h2>
        <input type="text" placeholder="Judul Catatan">
        <textarea placeholder="Isi Catatan"></textarea>
        <button>Tambah</button>
      </div>
    `;
  }
}
customElements.define('note-form', NoteForm);

class NoteList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container">
        <h2>Daftar Catatan</h2>
        <ul>
          <li>Catatan 1</li>
          <li>Catatan 2</li>
          <li>Catatan 3</li>
        </ul>
      </div>
    `;
  }
}
customElements.define('note-list', NoteList);