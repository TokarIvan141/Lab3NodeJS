const bookService = require('../services/book.service');

class BookController {
    async getAll(req, res) {
        try {
            const books = await bookService.getAllBooks();
            res.status(200).json(books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const book = await bookService.getBookById(req.params.id);
            res.status(200).json(book);
        } catch (error) {
            if (error.message === 'NOT_FOUND') {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const insertId = await bookService.createBook(req.body);
            res.status(201).json({ id: insertId, message: 'Book created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await bookService.deleteBook(req.params.id);
            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            if (error.message === 'NOT_FOUND') {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new BookController();