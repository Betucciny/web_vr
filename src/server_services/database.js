import { createPool, escape } from 'mysql2/promise';
require('dotenv').config()

let pool = null;

export function getPool() {
    if (!pool) {
        pool = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 140,
            queueLimit: 0
        });
    }
    return pool;
}

export async function getEntries() {
    const pool = await getPool()
    const query = 'SELECT * FROM entries where date >= DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY date DESC limit 5'
    try {
        const [rows] = await pool.query(query)
        return rows
    } catch (e) {
        throw new Error("Error al obtener las entradas")
    }
}

export async function setEntry(text){
    const pool = await getPool()
    const query = `INSERT INTO entries (text) VALUES (` + escape(text) + `)`
    try {
        await pool.query(query)
    } catch (e) {
        throw new Error("Error al insertar la entrada")
    }
}