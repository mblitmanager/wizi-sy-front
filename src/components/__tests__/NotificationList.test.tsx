import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { NotificationList } from '../NotificationList';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('NotificationList', () => {
  const mockNotifications = [
    {
      id: 1,
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info',
      is_read: false,
      created_at: '2024-03-21T10:00:00Z'
    }
  ];

  beforeEach(() => {
    // Mock token
    mockLocalStorage.getItem.mockReturnValue('fake-token');
    
    // Mock axios responses
    mockedAxios.get.mockResolvedValue({ data: mockNotifications });
    mockedAxios.patch.mockResolvedValue({ data: { message: 'Notification marked as read' } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders notifications correctly', async () => {
    render(<NotificationList />);

    // Vérifie le chargement initial
    expect(screen.getByText('Chargement des notifications...')).toBeInTheDocument();

    // Attend que les notifications soient chargées
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });

    // Vérifie que le message est affiché
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
  });

  it('marks notification as read when clicking the button', async () => {
    render(<NotificationList />);

    // Attend que les notifications soient chargées
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });

    // Clique sur le bouton "Marquer comme lu"
    const markAsReadButton = screen.getByText('Marquer comme lu');
    fireEvent.click(markAsReadButton);

    // Vérifie que l'appel API a été fait
    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/notifications/1/read',
        {},
        expect.any(Object)
      );
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock une erreur API
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    console.error = vi.fn(); // Mock console.error

    render(<NotificationList />);

    // Vérifie que l'erreur est gérée
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
}); 