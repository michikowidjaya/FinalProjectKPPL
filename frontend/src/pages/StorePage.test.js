// File: frontend/src/pages/StorePage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import StorePage from './StorePage';
import API from '../api';

jest.mock('../api');

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
};

const mockProducts = [
  { id: 1, name: 'Americano Klasik', price: 18000, stock: 10, category: 'Kopi' },
  { id: 2, name: 'Croissant Cokelat', price: 20000, stock: 5, category: 'Makanan' },
];

const mockRecommendations = [
  { id: 3, name: 'Kopi Susu Aren', price: 22000, stock: 15, category: 'Rekomendasi' },
];

describe('StorePage Component', () => {

  beforeEach(() => {
    // Atur mock untuk berbagai endpoint yang dipanggil di StorePage
    API.get.mockImplementation((url) => {
      if (url.includes('/api/pelanggan/products')) {
        return Promise.resolve({ data: { data: mockProducts } });
      }
      if (url.includes('/api/pelanggan/recommendations')) {
        return Promise.resolve({ data: { data: mockRecommendations } });
      }
      return Promise.reject(new Error('not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('menampilkan produk dan rekomendasi setelah berhasil fetch data', async () => {
    render(
      <Router>
        <StorePage user={mockUser} />
      </Router>
    );

    // Tunggu hingga produk dan rekomendasi muncul di layar
    await waitFor(() => {
      expect(screen.getByText('Americano Klasik')).toBeInTheDocument();
      expect(screen.getByText('Croissant Cokelat')).toBeInTheDocument();
      expect(screen.getByText('Kopi Susu Aren')).toBeInTheDocument();
    });
  });

  test('menambahkan item ke keranjang saat tombol "Tambah ke Keranjang" diklik', async () => {
    render(
      <Router>
        <StorePage user={mockUser} />
      </Router>
    );

    // Tunggu hingga produk muncul
    await waitFor(() => {
      expect(screen.getByText('Americano Klasik')).toBeInTheDocument();
    });

    // Cek kondisi awal keranjang
    expect(screen.getByText(/keranjang anda kosong/i)).toBeInTheDocument();
    
    // Temukan tombol "Tambah ke Keranjang" untuk Americano dan klik
    const addButton = screen.getAllByRole('button', { name: /tambah ke keranjang/i })[0];
    fireEvent.click(addButton);

    // Cek apakah keranjang telah diperbarui
    await waitFor(() => {
      expect(screen.getByText(/keranjang belanja \(1 item\)/i)).toBeInTheDocument();
      expect(screen.getByText('Americano Klasik')).toBeInTheDocument();
      expect(screen.getByText(/Total Belanja/i)).toBeInTheDocument();
      // Pastikan totalnya benar
      expect(screen.getByText(/Rp 18.000/i)).toBeInTheDocument();
    });
  });

});