import { useState, useEffect } from 'react';
import {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
    listCategories,
    createCategory,
    addCategoriesToNote,
    removeCategoryFromNote,
} from '../services/api';
import NoteCard from '../components/Notes/NoteCard';
import Modal from '../components/Notes/Modal';
import { useAuth } from '../context/AuthContext';

const NotesPage = () => {
    const { logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterCategoryId, setFilterCategoryId] = useState(null);
    const [archived, setArchived] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [newCategory, setNewCategory] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [notesData, categoriesData] = await Promise.all([
                    getNotes(archived, token),
                    listCategories(token),
                ]);
                setNotes(notesData);
                setCategories(categoriesData.filter((category) => category.id));
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [archived]);


    const handleCreateCategory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!newCategory.trim()) {
            alert('Category name cannot be empty');
            return;
        }

        try {
            const createdCategory = await createCategory({ name: newCategory }, token);
            setCategories((prevCategories) => [...prevCategories, createdCategory]);
            setNewCategory(''); // Clear input after creating category
        } catch (err) {
            console.error('Error creating category:', err);
            alert(err.message);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const createdNote = await createNote(newNote, token);
            setNotes((prevNotes) => [createdNote, ...prevNotes]);
            setNewNote({ title: '', content: '' });
        } catch (err) {
            console.error('Error creating note:', err);
        }
    };

    const handleEditNote = (noteId) => {
        const noteToEdit = notes.find((note) => note.id === noteId);
        setEditingNote(noteToEdit);
        setIsModalOpen(true);
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const updatedNote = await updateNote(editingNote.id, editingNote, token);
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === updatedNote.id ? updatedNote : note
                )
            );
            setEditingNote(null);
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error updating note:', err);
        }
    };


    const handleChangeEditingNote = (field, value) => {
        setEditingNote((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDeleteNote = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await deleteNote(id, token);
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const handleArchiveNote = async (id, isArchived) => {
        try {
            const token = localStorage.getItem('token');
            const updatedNote = await updateNote(id, { archived: !isArchived }, token);

            if (updatedNote.archived !== archived) {
                setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
            } else {
                setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                        note.id === updatedNote.id ? updatedNote : note
                    )
                );
            }
        } catch (err) {
            console.error('Error archiving/unarchiving note:', err);
        }
    };

    // FIX ME:
    const handleAddCategory = async (noteId, categoryId) => {
        try {
            const token = localStorage.getItem('token');
            const [updatedNote] = await addCategoriesToNote(noteId, [categoryId], token);

            console.log('Original Notes:', notes);
            console.log('Updated Note:', updatedNote);
            console.log('Updated Categories:', updatedNote.categories);

            setNotes((prevNotes) =>
                prevNotes.map((note) => {
                    if (note.id === noteId) {
                        const existingCategories = note.categories || [];
                        const newCategories = updatedNote.categories.filter(
                            (newCategory) =>
                                !existingCategories.some(
                                    (existingCategory) => existingCategory.id === newCategory.id
                                )
                        );
                        return {
                            ...note,
                            categories: [...existingCategories, ...newCategories]
                        };
                    }
                    return note;
                })
            );

        } catch (err) {
            console.error('Error adding category to note:', err);
        }
    };


    const handleRemoveCategory = async (noteId, categoryId) => {
        try {
            const token = localStorage.getItem('token');
            await removeCategoryFromNote(noteId, categoryId, token);
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId
                        ? { ...note, categories: note.categories.filter(cat => cat.id !== categoryId) }
                        : note
                )
            );
        } catch (err) {
            console.error('Error removing category from note:', err);
        }
    };


    const handleFilterByCategory = (categoryId) => {
        setFilterCategoryId(categoryId);
    };

    const filteredNotes = filterCategoryId
        ? notes.filter((note) =>
            note.categories?.some((category) => category.id === filterCategoryId)
        )
        : notes;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Notes</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>
            <main className="flex-1 p-4 flex justify-center">
                <div className="w-full max-w-4xl">
                    <button
                        onClick={() => setArchived(!archived)}
                        className="mb-4 bg-gray-200 text-blue-500 px-4 py-2 rounded"
                    >
                        {archived ? 'Show Active Notes' : 'Show Archived Notes'}
                    </button>
                    <form onSubmit={handleCreateCategory} className="mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New Category Name"
                            className="border p-2 rounded flex-1"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Create Category
                        </button>
                    </form>
                    <form onSubmit={handleCreateNote} className="mb-4 flex flex-col gap-2">
                        <input
                            type="text"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            placeholder="Title"
                            className="border p-2 rounded"
                            required
                        />
                        <textarea
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            placeholder="Content"
                            className="border p-2 rounded"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >Create Note
                        </button>
                    </form>

                    <div className="mb-4">
                        <select
                            value={filterCategoryId || ''}
                            onChange={(e) =>
                                handleFilterByCategory(
                                    e.target.value ? Number(e.target.value) : null
                                )
                            }
                            className="border p-2 rounded"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {filteredNotes.length > 0 ? (
                        <ul>
                            {filteredNotes.map((note) => (
                                <NoteCard
                                    key={note.id}
                                    id={note.id}
                                    title={note.title}
                                    content={note.content}
                                    isArchived={note.archived}
                                    categories={note.categories || []}
                                    availableCategories={categories}
                                    onDelete={handleDeleteNote}
                                    onArchive={handleArchiveNote}
                                    onEdit={handleEditNote}
                                    onAddCategory={handleAddCategory}
                                    onRemoveCategory={handleRemoveCategory}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No notes found.</p>
                    )}
                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-lg font-bold mb-4">Edit Note</h2>
                {editingNote && (
                    <form onSubmit={handleUpdateNote} className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={editingNote.title}
                            onChange={(e) =>
                                handleChangeEditingNote('title', e.target.value)
                            }
                            className="border p-2 rounded"
                            placeholder="Title"
                            required
                        />
                        <textarea
                            value={editingNote.content}
                            onChange={(e) =>
                                handleChangeEditingNote('content', e.target.value)
                            }
                            className="border p-2 rounded"
                            placeholder="Content"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </Modal>


        </div>
    );
};

export default NotesPage;
