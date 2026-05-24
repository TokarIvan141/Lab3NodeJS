const db = require('../config/db.config');

class BookRepository {
    async findAll() {
        const [rows] = await db.query('SELECT * FROM books');
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
        return rows[0];
    }

    async create(bookData) {
        const { isbn, title, author, genre, publish_year, deposit, rental_fee } = bookData;
        const [result] = await db.query(
            'INSERT INTO books (isbn, title, author, genre, publish_year, deposit, rental_fee) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [isbn, title, author, genre, publish_year, deposit, rental_fee]
        );
        return result.insertId;
    }

    async delete(id) {
        const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = new BookRepository();