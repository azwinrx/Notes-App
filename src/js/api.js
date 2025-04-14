//link API
const API_URL = 'https://notes-api.dicoding.dev/v2';

// Fungsi untuk mendapatkan semua catatan non-archived
export const fetchNotes = async () => {
  const response = await fetch(`${API_URL}/notes`);
  if (!response.ok) throw new Error('Failed to fetch notes');
  const result = await response.json();
  return result.data;
};

// Fungsi untuk mendapatkan catatan archived
export const fetchArchivedNotes = async () => {
  const response = await fetch(`${API_URL}/notes/archived`);
  if (!response.ok) throw new Error('Failed to fetch archived notes');
  const result = await response.json();
  return result.data;
};

// Fungsi untuk mendapatkan single note
export const fetchNoteById = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch note');
  const result = await response.json();
  return result.data;
};

// Fungsi untuk mengarsipkan catatan
export const archiveNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/archive`, {
    method: 'POST',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to archive note');
  }
  return await response.json();
};

// Fungsi untuk mengembalikan catatan dari arsip
export const unarchiveNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}/unarchive`, {
    method: 'POST',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to unarchive note');
  }
  return await response.json();
};

// Fungsi untuk menghapus catatan
export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete note');
  }
  return await response.json();
};

// Fungsi untuk menambahkan catatan baru
export const addNote = async (note) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: note.title,
      body: note.body,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add note');
  }
  return await response.json();
};
