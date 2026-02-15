export const VALIDATION = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    validate: (email: string) => {
      if (!email) return "Email is required";
      if (email.length > 254) return "Email must be less than 254 characters";
      if (!VALIDATION.email.regex.test(email))
        return "Please enter a valid email address (e.g., hr@agency.com)";
      return null;
    },
  },
  password: {
    minLength: 8,
    maxLength: 128,
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    validate: (password: string) => {
      if (!password) return "Password is required";
      if (password.length < 8)
        return "Password must be at least 8 characters long";
      if (password.length > 128)
        return "Password must be less than 128 characters";
      if (!/[a-z]/.test(password))
        return "Password must contain at least one lowercase letter";
      if (!/[A-Z]/.test(password))
        return "Password must contain at least one uppercase letter";
      if (!/\d/.test(password))
        return "Password must contain at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        return "Password must contain at least one special character";
      return null;
    },
  },
  name: {
    minLength: 1,
    maxLength: 50,
    regex: /^[\p{L}\s\-']+$/u,
    validate: (name: string, fieldName: string) => {
      if (!name || !name.trim()) return `${fieldName} is required`;
      if (name.trim().length > 50)
        return `${fieldName} must be less than 50 characters`;
      if (!VALIDATION.name.regex.test(name)) {
        return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
      }
      return null;
    },
  },
  companyName: {
    minLength: 2,
    maxLength: 100,
    regex: /^[\p{L}\p{N}\s\-'&.,()]+$/u,
    validate: (companyName: string) => {
      if (!companyName || !companyName.trim())
        return "Organization name is required";
      if (companyName.trim().length < 2)
        return "Organization name must be at least 2 characters";
      if (companyName.trim().length > 100)
        return "Organization name must be less than 100 characters";
      if (!VALIDATION.companyName.regex.test(companyName)) {
        return "Organization name can only contain letters, numbers, spaces, and basic punctuation";
      }
      return null;
    },
  },
  companyDetails: {
    maxLength: 1000,
    validate: (details: string) => {
      // Optional field - only validate if provided
      if (!details || !details.trim()) return null;
      if (details.trim().length > 1000)
        return "Company details must be less than 1000 characters";
      return null;
    },
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    validate: (file: File | null) => {
      if (!file) return "Verification document is required";

      // Check file size
      if (file.size > VALIDATION.document.maxSize) {
        return "File size must be 10MB or less";
      }

      // Check file extension
      const fileName = file.name.toLowerCase();
      const hasValidExtension = VALIDATION.document.allowedExtensions.some(
        (ext) => fileName.endsWith(ext),
      );
      if (!hasValidExtension) {
        return "Please upload a PDF or Word document (.pdf, .docx)";
      }

      // Check MIME type (may be empty for some .doc files, so allow empty)
      if (file.type && !VALIDATION.document.allowedTypes.includes(file.type)) {
        return "Please upload a PDF or Word document (.pdf, .docx)";
      }

      return null;
    },
  },
  confirmPassword: {
    validate: (password: string, confirmPassword: string) => {
      if (!confirmPassword) return "Please confirm your password";
      if (password !== confirmPassword) return "Passwords do not match";
      return null;
    },
  },
};
