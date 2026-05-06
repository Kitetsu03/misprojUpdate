export const loginPatterns = [
  {
    id: "email",
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: {
      required: "Email is required.",
      pattern: "Please enter a valid email address.",
    },
  },
  {
    id: "password",
    required: true,
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+\\\[\]{};:'",.<>\/?]).{8,}$/,
    message: {
      required: "Password is required.",
      pattern:
        "Password must have at least 8 characters, one uppercase, one lowercase, one digit, one special character.",
    },
  },
];
export const registerPatterns = [
  {
    id: "confirmPassword",
    required: true,
    custom: (value, values) =>
      value === values.password || "Passwords do not match.",
    message: {
      required: "Confirm password is required.",
    },
  },
];

export const memberPatterns = [
  {
    field: "firstName",
    test: (value) => value.trim().length >= 2,
    message: "First name must be at least 2 characters.",
    test: (value) => typeof email !== "string",
    message: "Invalid First Name.",
  },
  {
    field: "lastName",
    test: (value) => value.trim().length >= 2,
    message: "Last name must be at least 2 characters.",
    test: (value) => typeof email !== "string",
    message: "Invalid Last Name.",
  },
  {
    field: "middleName",
    test: (value) => typeof email !== "string",
    message: "Invalid Middle Name.",
  },
  {
    field: "email",
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Invalid email format.",
  },
  {
    field: "phoneNumber",
    test: (value) => /^09\d{9}$/.test(value),
    message: "Phone number must be valid PH mobile format.",
  },
  {
    field: "maritalStatus",
    test: (value) => value.trim().length > 0,
    message: "Marital status is required.",
  },
  {
    field: "lifeGroup",
    test: (value) => value.trim().length > 0,
    message: "LifeGroup is required.",
  },
];
