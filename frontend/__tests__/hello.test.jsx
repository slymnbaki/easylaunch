import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from '../Hello'; // Adjust the import based on your component's location

test('renders hello message', () => {
	render(<Hello />);
	const linkElement = screen.getByText(/hello/i);
	expect(linkElement).toBeInTheDocument();
});