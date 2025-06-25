// File: frontend/src/pages/AdminPage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import AdminPage from './AdminPage';

// Mock modul axios
jest.mock('axios');

// Data tiruan untuk pesanan
const mockOrders = [
  {
    id: 1,
    customer_name: 'Budi Santoso',
    total_amount: 50000,
    status: 'pending',
    created_at: '2023-10-27T10:00:00.000Z',
  },
  {
    id: 2,
    customer_name: 'Ani Lestari',
    total_amount: 35000,
    status: 'paid',
    created_at: '2023-10-27T11:00:00.000Z',
  },
];

describe('AdminPage Component', () => {

  beforeEach(() => {
    // Atur mock response untuk GET request (mengambil daftar pesanan)
    // Kita gunakan mockImplementation agar bisa menangani parameter URL
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/admin/orders')) {
        return Promise.resolve({ data: { data: mockOrders } });
      }
      return Promise.reject(new Error('not found'));
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('menampilkan form tambah produk dan daftar pesanan', async () => {
    render(
        <Router>
            <AdminPage />
        </Router>
    );
    
    // Cek apakah judul-judul section ada di layar
    expect(screen.getByRole('heading', { name: /tambah produk baru/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /daftar pesanan masuk/i })).toBeInTheDocument();
    
    // Tunggu hingga data pesanan dari API ditampilkan
    await waitFor(() => {
      // Cek apakah nama pelanggan dari mock data muncul di tabel
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
      expect(screen.getByText('Ani Lestari')).toBeInTheDocument();
    });
  });

  test('dapat menambahkan produk baru melalui form', async () => {
    // Atur mock response untuk POST request (menambah produk)
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(
        <Router>
            <AdminPage />
        </Router>
    );

    // Simulasikan input pengguna
    fireEvent.change(screen.getByPlaceholderText(/nama produk/i), { target: { value: 'Kopi Tubruk' } });
    fireEvent.change(screen.getByPlaceholderText(/harga/i), { target: { value: '15000' } });
    fireEvent.change(screen.getByPlaceholderText(/stok/i), { target: { value: '100' } });
    
    // Simulasikan klik tombol simpan
    fireEvent.click(screen.getByRole('button', { name: /simpan produk/i }));

    // Tunggu dan pastikan axios.post dipanggil dengan data yang benar
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/admin/products',
        expect.objectContaining({
          name: 'Kopi Tubruk',
          price: '15000',
          stock: '100',
        }),
        expect.any(Object) // untuk headers
      );
    });

    // Cek apakah notifikasi sukses muncul
    expect(await screen.findByText(/produk berhasil ditambahkan!/i)).toBeInTheDocument();
  });
});