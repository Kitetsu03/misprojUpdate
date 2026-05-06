import Expense from "./expense.model.js";

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { createExpense };
