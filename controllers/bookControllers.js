import query from '../config/db.js';

const bookControllers = {
    getAll: async (req, res) => {
        const sqlStr = `SELECT * FROM books`;
        const result = await query(sqlStr, []);
        const { token } = req.cookies;

        if (result) {
            res.status(200).render('get-books', { books: result, token });
        } else {
            res.status(400).render('404', {
                title: 'Books not found',
                message: 'Books not found'
            });
        }
    },
    getById: async (req, res) => {
        const { id } = req.params;
        const sqlStr = `SELECT * FROM books WHERE id=?`;
        const params = [id];

        const result = await query(sqlStr, params);

        if (result.length > 0) {
            res.status(200).render('get-book', { book: result[0] });
        } else {
            res.status(400).render('404', {
                title: 'Book does not exist',
                message: 'Book does not exist'
            });
        }
    },
    getAddBookForm: (req, res) => {
        res.status(200).render('add-book-form');
    },
    addBook: async (req, res) => {
        const { title, author, price, img } = req.body;

        if (title && author && price && img) {
            const sqlStr = `INSERT INTO books (title, author, price, img) VALUES (?, ?, ?, ?)`;
            const params = [title, author, price, img];

            const result = await query(sqlStr, params);

            if (result.affectedRows > 0) {
                res.status(302).redirect('/api/books');
            } else {
                res.status(400).render('404', {
                    title: 'Cannot add a book',
                    message: 'Cannot add a book'
                });
            }
        } else {
            res.status(400).render('404', {
                title: 'All fields are required',
                message: 'All fields are required'
            });
        }
    },
    updateBook: async (req, res) => {
        const { id } = req.params;
        const { title, author, price, img } = req.body;

        const sqlStr = `UPDATE books SET title=?, author=?, price=?, img=? WHERE id=?`;
        const params = [title, author, price, img, id];

        const result = await query(sqlStr, params);

        if (result.affectedRows > 0) {
            res.status(302).redirect('/api/books');
        } else {
            res.status(400).render('404', {
                title: 'Failed to update book',
                message: 'Failed to update book'
            });
        }
    },
    deleteBook: async (req, res) => {
        const { id } = req.params;

        const sqlStr = `DELETE FROM books WHERE id=?`;
        const params = [id];

        const result = await query(sqlStr, params);

        if (result.affectedRows > 0) {
            res.status(302).redirect('/api/books');
        } else {
            res.status(400).render('404', {
                title: 'Failed to delete book',
                message: 'Failed to delete book'
            });
        }
    }
};

export default bookControllers;
