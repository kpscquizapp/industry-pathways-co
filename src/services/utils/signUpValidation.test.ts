import { describe, it, expect } from 'vitest';
import { VALIDATION } from './signUpValidation';

describe('signUpValidation', () => {
  describe('email validation', () => {
    it('should reject empty email', () => {
      const result = VALIDATION.email.validate('');
      expect(result).toBe('Email is required');
    });

    it('should reject email longer than 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@test.com';
      const result = VALIDATION.email.validate(longEmail);
      expect(result).toBe('Email must be at most 254 characters');
    });

    it('should reject invalid email format', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
      ];

      invalidEmails.forEach((email) => {
        const result = VALIDATION.email.validate(email);
        expect(result).toBe('Please enter a valid email address (e.g., hr@agency.com)');
      });
    });

    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@company.co.uk',
        'name+tag@domain.org',
        'hr@agency.com',
      ];

      validEmails.forEach((email) => {
        const result = VALIDATION.email.validate(email);
        expect(result).toBeNull();
      });
    });
  });

  describe('password validation', () => {
    it('should reject empty password', () => {
      const result = VALIDATION.password.validate('');
      expect(result).toBe('Password is required');
    });

    it('should reject password shorter than 8 characters', () => {
      const result = VALIDATION.password.validate('Short1!');
      expect(result).toBe('Password must be at least 8 characters long');
    });

    it('should reject password longer than 128 characters', () => {
      const longPassword = 'A'.repeat(129) + 'a1!';
      const result = VALIDATION.password.validate(longPassword);
      expect(result).toBe('Password must be less than 128 characters');
    });

    it('should reject password without lowercase letter', () => {
      const result = VALIDATION.password.validate('PASSWORD1!');
      expect(result).toBe('Password must contain at least one lowercase letter');
    });

    it('should reject password without uppercase letter', () => {
      const result = VALIDATION.password.validate('password1!');
      expect(result).toBe('Password must contain at least one uppercase letter');
    });

    it('should reject password without number', () => {
      const result = VALIDATION.password.validate('Password!');
      expect(result).toBe('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = VALIDATION.password.validate('Password1');
      expect(result).toBe('Password must contain at least one special character');
    });

    it('should accept valid passwords', () => {
      const validPasswords = [
        'Password1!',
        'MySecure@123',
        'Str0ng#Pass',
        'C0mplex$Password',
      ];

      validPasswords.forEach((password) => {
        const result = VALIDATION.password.validate(password);
        expect(result).toBeNull();
      });
    });
  });

  describe('name validation', () => {
    it('should reject empty name', () => {
      const result = VALIDATION.name.validate('', 'First name');
      expect(result).toBe('First name is required');
    });

    it('should reject whitespace-only name', () => {
      const result = VALIDATION.name.validate('   ', 'Last name');
      expect(result).toBe('Last name is required');
    });

    it('should reject name longer than 50 characters', () => {
      const longName = 'A'.repeat(51);
      const result = VALIDATION.name.validate(longName, 'Name');
      expect(result).toBe('Name must be less than 50 characters');
    });

    it('should reject name with invalid characters', () => {
      const invalidNames = ['John123', 'Name@', 'Test$'];

      invalidNames.forEach((name) => {
        const result = VALIDATION.name.validate(name, 'Name');
        expect(result).toContain('can only contain letters');
      });
    });

    it('should accept valid names', () => {
      const validNames = [
        'John',
        'Mary-Jane',
        "O'Brien",
        'Jean Paul',
        'José',
        'François',
      ];

      validNames.forEach((name) => {
        const result = VALIDATION.name.validate(name, 'Name');
        expect(result).toBeNull();
      });
    });
  });

  describe('company name validation', () => {
    it('should reject empty company name', () => {
      const result = VALIDATION.companyName.validate('');
      expect(result).toBe('Organization name is required');
    });

    it('should reject company name shorter than 2 characters', () => {
      const result = VALIDATION.companyName.validate('A');
      expect(result).toBe('Organization name must be at least 2 characters');
    });

    it('should reject company name longer than 100 characters', () => {
      const longName = 'A'.repeat(101);
      const result = VALIDATION.companyName.validate(longName);
      expect(result).toBe('Organization name must be less than 100 characters');
    });

    it('should reject company name with invalid characters', () => {
      const invalidNames = ['Company@', 'Test#Corp', 'Name%'];

      invalidNames.forEach((name) => {
        const result = VALIDATION.companyName.validate(name);
        expect(result).toContain('can only contain letters, numbers');
      });
    });

    it('should accept valid company names', () => {
      const validNames = [
        'Tech Corp',
        'ABC-123 Company',
        "Johnson & Sons",
        'Acme Inc.',
        'Company (USA)',
      ];

      validNames.forEach((name) => {
        const result = VALIDATION.companyName.validate(name);
        expect(result).toBeNull();
      });
    });
  });

  describe('company details validation', () => {
    it('should accept empty company details (optional field)', () => {
      const result = VALIDATION.companyDetails.validate('');
      expect(result).toBeNull();
    });

    it('should accept whitespace-only company details', () => {
      const result = VALIDATION.companyDetails.validate('   ');
      expect(result).toBeNull();
    });

    it('should reject details longer than 1000 characters', () => {
      const longDetails = 'A'.repeat(1001);
      const result = VALIDATION.companyDetails.validate(longDetails);
      expect(result).toBe('Company details must be less than 1000 characters');
    });

    it('should accept valid company details', () => {
      const validDetails = [
        'A tech company',
        'We specialize in software development.',
        'Lorem ipsum '.repeat(50), // Under 1000 chars
      ];

      validDetails.forEach((details) => {
        const result = VALIDATION.companyDetails.validate(details);
        expect(result).toBeNull();
      });
    });
  });

  describe('document validation', () => {
    it('should reject null file', () => {
      const result = VALIDATION.document.validate(null);
      expect(result).toBe('Verification document is required');
    });

    it('should reject file larger than 10MB', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      });
      const result = VALIDATION.document.validate(largeFile);
      expect(result).toBe('File size must be 10MB or less');
    });

    it('should reject file with invalid extension', () => {
      const invalidFile = new File(['content'], 'document.txt', {
        type: 'text/plain',
      });
      const result = VALIDATION.document.validate(invalidFile);
      expect(result).toBe('Please upload a PDF or Word document (.pdf, .doc, .docx)');
    });

    it('should reject file with invalid MIME type', () => {
      const invalidFile = new File(['content'], 'document.pdf', {
        type: 'text/plain',
      });
      const result = VALIDATION.document.validate(invalidFile);
      expect(result).toBe('Please upload a PDF or Word document (.pdf, .doc, .docx)');
    });

    it('should accept valid PDF file', () => {
      const validFile = new File(['content'], 'document.pdf', {
        type: 'application/pdf',
      });
      const result = VALIDATION.document.validate(validFile);
      expect(result).toBeNull();
    });

    it('should accept valid DOC file', () => {
      const validFile = new File(['content'], 'document.doc', {
        type: 'application/msword',
      });
      const result = VALIDATION.document.validate(validFile);
      expect(result).toBeNull();
    });

    it('should accept valid DOCX file', () => {
      const validFile = new File(['content'], 'document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const result = VALIDATION.document.validate(validFile);
      expect(result).toBeNull();
    });

    it('should accept DOC file with empty MIME type (browser compatibility)', () => {
      const validFile = new File(['content'], 'document.doc', {
        type: '',
      });
      const result = VALIDATION.document.validate(validFile);
      expect(result).toBeNull();
    });

    it('should accept file under 10MB', () => {
      const validFile = new File(['x'.repeat(5 * 1024 * 1024)], 'document.pdf', {
        type: 'application/pdf',
      });
      const result = VALIDATION.document.validate(validFile);
      expect(result).toBeNull();
    });
  });

  describe('confirm password validation', () => {
    it('should reject empty confirm password', () => {
      const result = VALIDATION.confirmPassword.validate('Password1!', '');
      expect(result).toBe('Please confirm your password');
    });

    it('should reject mismatched passwords', () => {
      const result = VALIDATION.confirmPassword.validate('Password1!', 'Different1!');
      expect(result).toBe('Passwords do not match');
    });

    it('should accept matching passwords', () => {
      const result = VALIDATION.confirmPassword.validate('Password1!', 'Password1!');
      expect(result).toBeNull();
    });
  });

  describe('validation constants', () => {
    it('should have correct email regex', () => {
      expect(VALIDATION.email.regex).toBeInstanceOf(RegExp);
      expect(VALIDATION.email.regex.test('test@example.com')).toBe(true);
      expect(VALIDATION.email.regex.test('invalid')).toBe(false);
    });

    it('should have correct password regex', () => {
      expect(VALIDATION.password.regex).toBeInstanceOf(RegExp);
      expect(VALIDATION.password.regex.test('Password1!')).toBe(true);
      expect(VALIDATION.password.regex.test('weak')).toBe(false);
    });

    it('should have correct name regex', () => {
      expect(VALIDATION.name.regex).toBeInstanceOf(RegExp);
      expect(VALIDATION.name.regex.test("O'Brien")).toBe(true);
      expect(VALIDATION.name.regex.test('Invalid123')).toBe(false);
    });

    it('should have correct document maxSize', () => {
      expect(VALIDATION.document.maxSize).toBe(10 * 1024 * 1024);
    });

    it('should have correct allowed document types', () => {
      expect(VALIDATION.document.allowedTypes).toContain('application/pdf');
      expect(VALIDATION.document.allowedTypes).toContain('application/msword');
    });
  });
});