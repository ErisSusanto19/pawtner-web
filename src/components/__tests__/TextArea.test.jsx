
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import TextArea from '../TextArea';

// A wrapper component to use react-hook-form
const TestForm = ({ label, id, rules, errors }) => {
  const { register } = useForm();
  return <TextArea label={label} id={id} register={register} rules={rules} errors={errors} />;
};

describe('TextArea', () => {
  it('should render with the correct label', () => {
    render(<TestForm label="Test Label" id="test-textarea" errors={{}} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('should display an error message when an error is passed', () => {
    const errors = {
      'test-textarea': {
        type: 'required',
        message: 'This field is required',
      },
    };
    render(<TestForm label="Test Label" id="test-textarea" errors={errors} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
