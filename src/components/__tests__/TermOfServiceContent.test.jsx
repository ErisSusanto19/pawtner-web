import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import TermOfServiceContent from '../TermOfServiceContent';

describe('TermOfServiceContent', () => {
  it('should render all headings and content correctly', () => {
    render(<TermOfServiceContent />);

    const introductionHeading = screen.getByRole('heading', { name: /1. Introduction/i });
    const usingServicesHeading = screen.getByRole('heading', { name: /2. Using our Services/i });
    const yourContentHeading = screen.getByRole('heading', { name: /3. Your Content in our Services/i });

    expect(introductionHeading).toBeInTheDocument();
    expect(usingServicesHeading).toBeInTheDocument();
    expect(yourContentHeading).toBeInTheDocument();

    expect(screen.getByText(/welcome to our service/i)).toBeInTheDocument();
    expect(screen.getByText(/don't misuse our services/i)).toBeInTheDocument();
    expect(screen.getByText(/you give us a worldwide license to use/i)).toBeInTheDocument();
  });

  it('should have the correct structure', () => {
    render(<TermOfServiceContent />);

    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings).toHaveLength(3);

    const introductionHeading = screen.getByRole('heading', { name: /1. Introduction/i });

  });
});