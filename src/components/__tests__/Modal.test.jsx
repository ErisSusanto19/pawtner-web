
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render with title and children when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when the modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByText('Modal Content'));
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});


