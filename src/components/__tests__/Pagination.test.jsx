
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const onPageChangeMock = vi.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  it('should not render if totalPages is 1 or less', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={onPageChangeMock} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render correctly with multiple pages', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should disable the "Previous" button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText('Previous').closest('button')).toBeDisabled();
  });

  it('should disable the "Next" button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChangeMock} />);
    expect(screen.getByText('Next').closest('button')).toBeDisabled();
  });

  it('should call onPageChange with the correct page number when a page is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    fireEvent.click(screen.getByText('3'));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when "Next" is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when "Previous" is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChangeMock} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });

  it('should render ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChangeMock} />);
        expect(screen.getAllByText('...')).not.toBeNull();
  });
});
