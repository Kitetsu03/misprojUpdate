import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  expense_date: Date,
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
