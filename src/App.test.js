import { render, screen } from '@testing-library/react';
import App from './App';

test('renders FreshFit brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/FreshFit sokovi/i);
  expect(brandElement).toBeTruthy();
});
