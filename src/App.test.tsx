import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('App', () => {
  beforeEach(() => {
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.IntersectionObserver = MockIntersectionObserver as any;

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('handles GitHub API fetch error gracefully', async () => {
    // Mock global fetch to return a 500 error
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Server Error' })
    } as Response);

    render(<App />);

    // Fast-forward or wait for the fetch to resolve and error out
    // The component sets githubLoading to false in the finally block
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    }, { timeout: 3000 });

    // Assert that the error state UI is shown
    expect(screen.getByText(/GitHub profile couldn't be loaded right/i)).toBeInTheDocument();
  });
});
