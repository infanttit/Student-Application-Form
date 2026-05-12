import { render, screen } from '@testing-library/react';
import App from './App';

test('shows login screen by default', async () => {
  render(<App />);
  const heading = await screen.findByText(/student portal/i);
  expect(heading).toBeInTheDocument();
});
