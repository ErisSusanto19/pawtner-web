
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';
import { HandCoins, Package, ShoppingCart, Calendar } from 'lucide-react';

// Mocking lucide-react icons
vi.mock('lucide-react', async () => {
  const original = await vi.importActual('lucide-react');
  return {
    ...original,
    HandCoins: (props) => <svg data-testid="hand-coins-icon" {...props} />,
    Package: (props) => <svg data-testid="package-icon" {...props} />,
    ShoppingCart: (props) => <svg data-testid="cart-icon" {...props} />,
    Calendar: (props) => <svg data-testid="calendar-icon" {...props} />,
  };
});

describe('StatCard', () => {
  it('should render the title and value correctly', () => {
    render(<StatCard title="Total Revenue" value="Rp 1.000.000" iconName="revenue" />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Rp 1.000.000')).toBeInTheDocument();
  });

  it('should render the correct icon for "revenue"', () => {
    render(<StatCard title="Revenue" value="0" iconName="revenue" />);
    expect(screen.getByTestId('hand-coins-icon')).toBeInTheDocument();
  });

  it('should render the correct icon for "products"', () => {
    render(<StatCard title="Products" value="0" iconName="products" />);
    expect(screen.getByTestId('package-icon')).toBeInTheDocument();
  });

  it('should render the correct icon for "orders"', () => {
    render(<StatCard title="Orders" value="0" iconName="orders" />);
    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
  });

  it('should render the correct icon for "bookings"', () => {
    render(<StatCard title="Bookings" value="0" iconName="bookings" />);
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
  });

  it('should render the default icon (HandCoins) if iconName is not provided', () => {
    render(<StatCard title="Default" value="0" />);
    expect(screen.getByTestId('hand-coins-icon')).toBeInTheDocument();
  });

  it('should render the default icon (HandCoins) if iconName is invalid', () => {
    render(<StatCard title="Invalid" value="0" iconName="invalid-icon" />);
    expect(screen.getByTestId('hand-coins-icon')).toBeInTheDocument();
  });
});
