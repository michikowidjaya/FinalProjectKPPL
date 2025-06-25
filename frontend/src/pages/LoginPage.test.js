import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './LoginPage';
import API from '../api';

// Mock API module untuk mengontrol response dari server
jest.mock('../api');

describe('LoginPage', () => {
  test('renders login form correctly', () => {
    render(
      <Router>
        <LoginPage onLogin={() => {}} />
      </Router>
    );

    // Memastikan semua elemen form ada di layar
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows an error message on failed login', async () => {
    // Simulasikan API call yang gagal
    API.post.mockRejectedValueOnce({
      response: { data: { message: 'Email atau password salah.' } }
    });
    
    // Fungsi onLogin dummy
    const handleLogin = jest.fn();

    render(
      <Router>
        <LoginPage onLogin={handleLogin} />
      </Router>
    );

    // Simulasikan input dari user
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'salah@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Simulasikan klik tombol login
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Tunggu dan pastikan pesan error muncul
    await waitFor(() => {
      expect(screen.getByText(/email atau password salah. silakan coba lagi./i)).toBeInTheDocument();
    });

    // Pastikan fungsi onLogin tidak terpanggil
    expect(handleLogin).not.toHaveBeenCalled();
  });
});