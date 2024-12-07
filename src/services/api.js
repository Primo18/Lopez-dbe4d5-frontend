const BASE_URL = import.meta.env.VITE_BASE_URL;

export const register = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error('Registration failed');
    }
    return response.json();
};

export const login = async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
};

export const createCategory = async (categoryData, token) => {
    const response = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
        throw new Error('Failed to create category');
    }
    return response.json();
};

export const listCategories = async (token) => {
    const response = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to list categories');
    }
    return response.json();
};

export const deleteCategory = async (categoryId, token) => {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
    return response.json();
};

export const createNote = async (noteData, token) => {
    const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
    });
    if (!response.ok) {
        throw new Error('Failed to create note');
    }
    return response.json();
};

export const getNotes = async (archived, token) => {
    const response = await fetch(`${BASE_URL}/notes?archived=${archived}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to get notes');
    }
    return response.json();
};

export const updateNote = async (id, noteData, token) => {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update note');
    }

    return response.json();
};


export const deleteNote = async (noteId, token) => {
    const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete note');
    }
    return noteId;
};

export const addCategoriesToNote = async (noteId, categoryIds, token) => {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryIds }),
    });
    if (!response.ok) {
        throw new Error('Failed to add categories to note');
    }
    return response.json();
};

export const removeCategoryFromNote = async (noteId, categoryId, token) => {
    const response = await fetch(`${BASE_URL}/notes/${noteId}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to remove category from note');
    }
    return response.json();
};
