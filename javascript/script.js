"use strict";
const formEl = document.getElementById("container");
const balanceEl = document.getElementById("balance");
const incomeBalanceEl = document.getElementById("income-balance");
const expenseBalanceEl = document.getElementById("expense-balance");
const transactionEl = document.getElementById("transaction");
const amountEl = document.getElementById("amount");
const historyEl = document.getElementById("history-container");
const btnEl = document.getElementById("btn-add");
const btnRemove = document.getElementById("btn-remove");

//global variable
let balance;
let income;
let expense;
let Transaction = localStorage.getItem("Transaction")
  ? JSON.parse(localStorage.getItem("Transaction"))
  : [];
let isEditing;
let itemToEdit = {};

//function
//init function
const init = () => {
  historyEl.innerHTML = ``;
  transactionEl.value = null;
  amountEl.value = null;
  income = 0;
  balance = 0;
  expense = 0;
  isEditing = false;
  calculateTransaction();
  addTransactionToDom(Transaction);

  balanceEl.innerText = `₹ ${format(Number(balance))}`;
  incomeBalanceEl.innerText = `₹ ${format(Number(income))}`;
  expenseBalanceEl.innerText = `₹ ${format(Number(expense))}`;
};
const addTransactionToDom = (arr) => {
  historyEl.innerHTML = ``;
  arr.forEach((item) => {
    const { id, transaction, amount } = item;

    const listEl = document.createElement("ul");
    listEl.classList.add("list");
    listEl.innerHTML = `<li class="${
      amount > 0 ? "plus" : "minus"
    }">${transaction} <span>₹${amount}</span> <p class="btn-delete" onclick=deleteTransaction(${id}) ><i class="fa-solid fa-trash"></i></p>
    <p class="btn-edit" onclick=editTransaction(${id}) ><i class="fa-regular fa-pen-to-square"></i></p></li>`;
    historyEl.appendChild(listEl);
  });
};
const deleteTransaction = (id) => {
  Transaction = Transaction.filter((item) => item.id != id);
  addTransactionToDom(Transaction);
};
const format = (number) => {
  return number.toLocaleString("en-IN") + ".00";
};

const editTransaction = (id) => {
  isEditing = true;
  itemToEdit = Transaction.find((item) => item.id == id);
  //add data to input element
  transactionEl.value = itemToEdit.transaction;
  amountEl.value = itemToEdit.amount;
  //change the button name
  btnEl.innerText = `Submit Transaction`;
};
const calculateTransaction = () => {
  income = Transaction.filter((item) => item.amount > 0)
    .reduce((prev, curr) => prev + curr.amount, 0)
    .toFixed(2);
  balance = Transaction.reduce((prev, curr) => prev + curr.amount, 0).toFixed(
    2
  );
  expense = Transaction.filter((item) => item.amount < 0)
    .reduce((prev, curr) => prev + curr.amount, 0)
    .toFixed(2);
  balanceEl.innerText = `₹ ${format(Number(balance))}`;
  incomeBalanceEl.innerText = `₹ ${format(Number(income))}`;
  expenseBalanceEl.innerText = `₹ ${format(Number(expense))}`;
};

//event listener
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const transaction = transactionEl.value.trim();
  const amount = Number(amountEl.value.trim());
  if (transaction && amount) {
    if (isEditing) {
      Transaction = Transaction.map((item) => {
        if (item.id == itemToEdit.id) {
          return { ...item, transaction: transaction, amount: amount };
        } else {
          return item;
        }
      });
      isEditing = false;
      itemToEdit = {};
      btnEl.innerText = `Add transaction`;
    } else {
      const newTransaction = {
        id: `${Date.now()}`,
        transaction: transaction,
        amount: amount,
      };
      Transaction.push(newTransaction);
    }
    //add local storage

    localStorage.setItem("Transaction", JSON.stringify(Transaction));

    calculateTransaction();
    addTransactionToDom(Transaction);
    transactionEl.value = null;
    amountEl.value = null;
  } else {
    alert("Enter All values");
  }
});
btnRemove.addEventListener("click", () => {
  localStorage.removeItem("Transaction");
  Transaction = [];
  init();
});

//init
init();
