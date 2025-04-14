import '../css/style.css';
import { fetchNotes, addNote, deleteNote } from './api.js';
// 🔹 Web Component untuk Header
class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Notes App</h1>`;
  }
}
customElements.define('app-bar', AppBar);

// 🔹 Web Component untuk Form Input
class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="noteForm">
        <input type="text" id="noteTitle" placeholder="Judul Catatan" required>
        <span class="error" id="titleError"></span>
        <textarea id="noteBody" placeholder="Catatan" required></textarea>
        <span class="error" id="bodyError"></span>
        <button type="submit" id="submitBtn" disabled>Tambah Catatan</button>
      </form>
    `;

    this.querySelector('#noteForm').addEventListener('submit', this.addNote);
    this.querySelector('#noteTitle').addEventListener(
      'input',
      this.validateInput
    );
    this.querySelector('#noteBody').addEventListener(
      'input',
      this.validateInput
    );
  }

  validateInput() {
    const title = document.getElementById('noteTitle');
    const body = document.getElementById('noteBody');
    const titleError = document.getElementById('titleError');
    const bodyError = document.getElementById('bodyError');
    const submitBtn = document.getElementById('submitBtn');

    let isValid = true;

    if (title.value.length < 1) {
      titleError.textContent = 'Tolong isi Judul Catatan';
      title.style.borderColor = 'red';
      isValid = false;
    } else {
      titleError.textContent = '';
      title.style.borderColor = 'green';
    }

    if (body.value.length < 1) {
      bodyError.textContent = 'Tolong isi Catatan';
      body.style.borderColor = 'red';
      isValid = false;
    } else {
      bodyError.textContent = '';
      body.style.borderColor = 'green';
    }

    submitBtn.disabled = !isValid;
  }

  async addNote(event) {
    event.preventDefault();
    const title = document.getElementById('noteTitle').value;
    const body = document.getElementById('noteBody').value;
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;

    try {
      await addNote({ title, body });
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteBody').value = '';
      renderNotes();
    } catch (error) {
      alert(`Gagal menambahkan catatan: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
    }
  }
}
customElements.define('note-form', NoteForm);

// 🔹 Web Component untuk Menampilkan Catatan
class NoteItem extends HTMLElement {
  set note(note) {
    this.innerHTML = `
      <div class="note-card">
        <h3>${note.title}</h3>
        <p>${note.body}</p>
        <p class="date">${new Date(note.createdAt).toLocaleDateString()}</p>
        <button class="delete-btn" data-id="${note.id}">Hapus</button>
      </div>
    `;

    this.querySelector('.delete-btn').addEventListener('click', async () => {
      try {
        await deleteNote(note.id);
        renderNotes();
      } catch (error) {
        alert(`Gagal menghapus catatan: ${error.message}`);
      }
    });
  }
}
customElements.define('note-item', NoteItem);

// 🔹 Fungsi Render Notes ke Halaman dari API
async function renderNotes() {
  const notesContainer = document.getElementById('notes-container');
  notesContainer.innerHTML = `<p style="text-align:center; font-size  : 120px; color : #8f87f1">Loading...</p>`;

  try {
    const notes = await fetchNotes();
    notesContainer.innerHTML = '';

    notes.forEach((note) => {
      const noteElement = document.createElement('note-item');
      noteElement.note = note;
      notesContainer.appendChild(noteElement);
    });

    if (notes.length === 0) {
      notesContainer.innerHTML = '<p>Tidak ada catatan tersedia.</p>';
    }
  } catch (error) {
    notesContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// 🔹 Tampilkan Catatan Saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', renderNotes);
