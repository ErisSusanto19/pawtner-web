import { describe, it, expect } from 'vitest';
import { formatCurrencyIDR, formatDate, formatToBackendHours, formatToFrontendHours } from './formatter';

describe('formatCurrencyIDR', () => {
  it('should format a number to IDR currency format', () => {
    expect(formatCurrencyIDR(10000)).toBe('Rp\u00a010.000');
    expect(formatCurrencyIDR(1234567)).toBe('Rp\u00a01.234.567');
  });

  it('should return Rp 0 for NaN input', () => {
    expect(formatCurrencyIDR('not a number')).toBe('Rp 0');
  });

  it('should handle zero correctly', () => {
    expect(formatCurrencyIDR(0)).toBe('Rp\u00a00');
  });
});

describe('formatDate', () => {
  it('should format an ISO string to a dd/mm/yyyy hh:mm format in WIB', () => {
    const isoString = '2024-07-27T10:00:00.000Z'; // 17:00 WIB
    expect(formatDate(isoString)).toBe('27/07/2024 17:00');
  });

  it('should handle another ISO string correctly', () => {
    const isoString = '2023-01-01T00:00:00.000Z'; // 07:00 WIB
    expect(formatDate(isoString)).toBe('01/01/2023 07:00');
  });

  it('should return an invalid date format for invalid input', () => {
    expect(formatDate('invalid-date')).toBe('NaN/NaN/NaN NaN:NaN');
  });
});

describe('formatToBackendHours', () => {
  it('should convert frontend hours to backend format', () => {
    const frontendHours = {
      monday: { isOpen: true, open: '09:00', close: '17:00' },
      tuesday: { isOpen: false, open: '', close: '' },
      wednesday: { isOpen: true, open: '10:00', close: '18:00' },
    };
    const expectedBackendHours = {
      monday: { open: '09:00', close: '17:00' },
      tuesday: null,
      wednesday: { open: '10:00', close: '18:00' },
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    };
    expect(formatToBackendHours(frontendHours)).toEqual(expectedBackendHours);
  });

  it('should handle empty input', () => {
    expect(formatToBackendHours({})).toEqual({
      monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null
    });
  });

  it('should handle undefined input', () => {
    expect(formatToBackendHours(undefined)).toEqual({});
  });
});

describe('formatToFrontendHours', () => {
  it('should convert backend hours to frontend format', () => {
    const backendHours = {
      monday: { open: '09:00', close: '17:00' },
      tuesday: null,
      wednesday: { open: '10:00', close: '18:00' },
    };
    const expectedFrontendHours = {
      monday: { isOpen: true, open: '09:00', close: '17:00' },
      tuesday: { isOpen: false, open: '', close: '' },
      wednesday: { isOpen: true, open: '10:00', close: '18:00' },
      thursday: { isOpen: false, open: '', close: '' },
      friday: { isOpen: false, open: '', close: '' },
      saturday: { isOpen: false, open: '', close: '' },
      sunday: { isOpen: false, open: '', close: '' },
    };
    expect(formatToFrontendHours(backendHours)).toEqual(expectedFrontendHours);
  });

  it('should handle empty input', () => {
    const expected = {
      monday: { isOpen: false, open: '', close: '' },
      tuesday: { isOpen: false, open: '', close: '' },
      wednesday: { isOpen: false, open: '', close: '' },
      thursday: { isOpen: false, open: '', close: '' },
      friday: { isOpen: false, open: '', close: '' },
      saturday: { isOpen: false, open: '', close: '' },
      sunday: { isOpen: false, open: '', close: '' },
    };
    expect(formatToFrontendHours({})).toEqual(expected);
  });

  it('should handle undefined input', () => {
    const expected = {
      monday: { isOpen: false, open: '', close: '' },
      tuesday: { isOpen: false, open: '', close: '' },
      wednesday: { isOpen: false, open: '', close: '' },
      thursday: { isOpen: false, open: '', close: '' },
      friday: { isOpen: false, open: '', close: '' },
      saturday: { isOpen: false, open: '', close: '' },
      sunday: { isOpen: false, open: '', close: '' },
    };
    expect(formatToFrontendHours(undefined)).toEqual(expected);
  });
});

