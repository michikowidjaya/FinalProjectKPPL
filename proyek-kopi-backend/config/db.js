// File: config/db.js (Versi yang Sudah Diperbarui)

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'http://srv1212.hstgr.io',      // Alamat server database Anda
    user: 'u464386062_chiko_db',           // User default XAMPP
    password: 'Chiko5525252',           // Password default XAMPP adalah kosong
    database: 'u464386062_chiko_db',// Nama database yang sudah Anda buat
});

console.log("Koneksi ke database berhasil dibuat.");

module.exports = pool;
