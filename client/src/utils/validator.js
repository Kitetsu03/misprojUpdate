// const validateAll = (values = {}, patterns = []) => {
//   const errorMessages = [];

//   patterns.forEach((pattern) => {
//     const value = values[pattern.id]?.trim() || "";

//     if (pattern.required && value.length === 0) {
//       errorMessages.push(pattern.message.required);
//       return;
//     }

//     if (value && !pattern.pattern.test(value)) {
//       errorMessages.push(pattern.message.pattern);
//     }
//     if (pattern.custom) {
//       const result = pattern.custom(value, values);
//       if (result !== true) {
//         errorMessages.push(result);
//       }
//     }
//   });

//   return errorMessages;
// };

// export default validateAll;

const validateAll = (values = {}, patterns = []) => {
  const errorMessages = [];

  patterns.forEach((pattern) => {
    const rawValue = values[pattern.id];
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    // Required check
    if (pattern.required && (!value || value.length === 0)) {
      errorMessages.push(pattern.message.required);
      return;
    }

    // Regex check
    if (value && pattern.pattern && !pattern.pattern.test(value)) {
      errorMessages.push(pattern.message.pattern);
    }

    // Custom validation
    if (pattern.custom) {
      const result = pattern.custom(value, values);
      if (result !== true) {
        errorMessages.push(result);
      }
    }
  });

  return errorMessages;
};

export default validateAll;
