// File: config/db.js (Versi yang Sudah Diperbarui)

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'aws-0-ap-southeast-1.pooler.supabase.com ',      // Alamat server database Anda
    user: 'postgres.rzcqcpqkfchmehpwbvhj',           // User default XAMPP
    password: 'Michikowidjaya3805',           // Password default XAMPP adalah kosong
    database: 'postgres',// Nama database yang sudah Anda buat
});

console.log("Koneksi ke database berhasil dibuat.");

module.exports = pool;
