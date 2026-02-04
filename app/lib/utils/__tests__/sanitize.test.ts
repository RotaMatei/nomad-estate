import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeObject,
} from '../sanitize';

describe('sanitize utilities', () => {
  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeString('Hello>World<')).toBe('HelloWorld');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeString(null as unknown as string)).toBe('');
      expect(sanitizeString(123 as unknown as string)).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should sanitize email correctly', () => {
      expect(sanitizeEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
      expect(sanitizeEmail('user+tag@example.com')).toBe('user+tag@example.com');
    });

    it('should remove invalid characters', () => {
      expect(sanitizeEmail('user<script>@example.com')).toBe('user@example.com');
    });
  });

  describe('sanitizePhone', () => {
    it('should keep only digits and +', () => {
      expect(sanitizePhone('+1 (555) 123-4567')).toBe('+15551234567');
      expect(sanitizePhone('555-123-4567')).toBe('5551234567');
    });
  });

  describe('sanitizeUrl', () => {
    it('should validate and return valid URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    it('should reject non-http(s) protocols', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBeNull();
      expect(sanitizeUrl('file:///etc/passwd')).toBeNull();
    });

    it('should return null for invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBeNull();
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize nested objects', () => {
      const input = {
        name: '<script>alert("xss")</script>',
        email: '  USER@EXAMPLE.COM  ',
        nested: {
          value: 'Hello>World<',
        },
      };

      const result = sanitizeObject(input);

      expect(result.name).toBe('alert("xss")');
      // sanitizeObject uses sanitizeString, which doesn't lowercase - it just removes HTML tags and trims
      expect(result.email).toBe('USER@EXAMPLE.COM');
      expect(result.nested.value).toBe('HelloWorld');
    });
  });
});
