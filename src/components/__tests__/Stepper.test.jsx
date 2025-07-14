import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Stepper from '../Stepper';

vi.mock('lucide-react', async (importOriginal) => {

  const original = await importOriginal(); 
  return {
    ...original,

    Check: (props) => <svg {...props} data-testid="check-icon" />,
  };
});

describe('Stepper Component', () => {
  it('should render the correct number of step circles', () => {
    render(<Stepper totalSteps={5} currentStep={1} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should not render any check icons when on the first step', () => {
    render(<Stepper totalSteps={4} currentStep={1} />);
    const checkIcon = screen.queryByTestId('check-icon');
    expect(checkIcon).not.toBeInTheDocument();
  });

  describe('Step and Connector Styling', () => {
    it('should apply correct styles for the initial state (currentStep = 1)', () => {
      const { container } = render(<Stepper totalSteps={3} currentStep={1} />);
      const elements = container.querySelector('.flex.items-center.justify-between').children;
      
      const [step1, connector1, step2, connector2, step3] = elements;

      expect(step1).toHaveClass('bg-[#C3D3E0] text-[#545F71]');
      expect(step1).toHaveTextContent('1');

      expect(step2).toHaveClass('bg-[#E9ECEF] text-[#ADB5BD]');
      expect(step2).toHaveTextContent('2');
      expect(step3).toHaveClass('bg-[#E9ECEF] text-[#ADB5BD]');
      expect(step3).toHaveTextContent('3');

      expect(connector1).toHaveClass('bg-[#E9ECEF]');
      expect(connector2).toHaveClass('bg-[#E9ECEF]');
    });

    it('should apply correct styles for a middle state (e.g., step 2 of 4)', () => {
      const { container } = render(<Stepper totalSteps={4} currentStep={2} />);
      const elements = container.querySelector('.flex.items-center.justify-between').children;
      
      const [step1, connector1, step2, connector2, step3, connector3, step4] = elements;

      expect(step1).toHaveClass('bg-[#545F71] text-white');
      expect(within(step1).getByTestId('check-icon')).toBeInTheDocument();
      expect(within(step1).queryByText('1')).not.toBeInTheDocument();
      expect(connector1).toHaveClass('bg-[#545F71]');

      expect(step2).toHaveClass('bg-[#C3D3E0] text-[#545F71]');
      expect(step2).toHaveTextContent('2');

      expect(step3).toHaveClass('bg-[#E9ECEF] text-[#ADB5BD]');
      expect(step3).toHaveTextContent('3');
      expect(step4).toHaveClass('bg-[#E9ECEF] text-[#ADB5BD]');
      expect(step4).toHaveTextContent('4');
      
      expect(connector2).toHaveClass('bg-[#E9ECEF]');
      expect(connector3).toHaveClass('bg-[#E9ECEF]');
    });

    it('should apply correct styles when all steps are completed', () => {

      const { container } = render(<Stepper totalSteps={3} currentStep={4} />);
      const elements = container.querySelector('.flex.items-center.justify-between').children;

      const [step1, connector1, step2, connector2, step3] = elements;

      expect(step1).toHaveClass('bg-[#545F71] text-white');
      expect(within(step1).getByTestId('check-icon')).toBeInTheDocument();

      expect(step2).toHaveClass('bg-[#545F71] text-white');
      expect(within(step2).getByTestId('check-icon')).toBeInTheDocument();

      expect(step3).toHaveClass('bg-[#545F71] text-white');
      expect(within(step3).getByTestId('check-icon')).toBeInTheDocument();

      expect(connector1).toHaveClass('bg-[#545F71]');
      expect(connector2).toHaveClass('bg-[#545F71]');
    });
  });
});