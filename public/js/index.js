//Edits for future site functionality go here.
document.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("copyright-date");
  const currentDate = new Date();
  const options = { year: 'numeric'};
  dateElement.textContent = currentDate.toLocaleDateString(undefined, options);
});