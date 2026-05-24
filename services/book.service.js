const bookRepository = require('../repositories/book.repository');

class BookService {
    async getAllBooks() {
        return await bookRepository.findAll();
    }

    async getBookById(id) {
        const book = await bookRepository.findById(id);
        if (!book) throw new Error('NOT_FOUND');
        return book;
    }

    async createBook(bookData) {
        return await bookRepository.create(bookData);
    }

    async deleteBook(id) {
        const deletedRows = await bookRepository.delete(id);
        if (deletedRows === 0) throw new Error('NOT_FOUND');
        return true;
    }
}

module.exports = new BookService();