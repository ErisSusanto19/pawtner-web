import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminSidebarHead from '../AdminSidebarHead';

vi.mock('@/assets/pawtner2.png', () => ({
  default: 'mock-pawtner-logo.png',
}));


describe('AdminSidebarHead Component', () => {

  it('should render the logo, title, and subtitle correctly', () => {
    // Act: Render the component
    render(<AdminSidebarHead />);

    // Assert: Verify the logo
    const logoImage = screen.getByAltText('Pawtner Logo');
    expect(logoImage).toBeInTheDocument();
  
    expect(logoImage.src).toContain('mock-pawtner-logo.png');

    // Assert: Verify the main title
    const title = screen.getByRole('heading', { name: /pawtner/i, level: 2 });
    expect(title).toBeInTheDocument();

    // Assert: Verify the subtitle
    const subtitle = screen.getByText('Admin Panel');
    expect(subtitle).toBeInTheDocument();
  });
});