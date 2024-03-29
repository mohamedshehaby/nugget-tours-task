"use strict";

const cities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Shubra El-Kheima",
  "Port Said",
  "Suez",
  "Luxor",
  "Asyut",
  "Ismailia",
  "Mansoura",
  "Tanta",
  "Beni Suef",
  "Faiyum",
  "Sohag",
  "Hurghada",
  "Zagazig",
];

const nationalities = [
  { nationality: "Egyptian", flag: "eg" },
  { nationality: "American", flag: "us" },
  { nationality: "British", flag: "gb" },
  { nationality: "French", flag: "fr" },
  { nationality: "German", flag: "de" },
  { nationality: "Spanish", flag: "es" },
  { nationality: "Italian", flag: "it" },
  { nationality: "Chinese", flag: "cn" },
  { nationality: "Japanese", flag: "jp" },
  { nationality: "Indian", flag: "in" },
];

// Function to set min date and initial value for date inputs
function setupDateInputs(inputs) {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  inputs.forEach((input) => {
    input.min = formattedDate;
    input.value = formattedDate;
  });
}

// Function to create city suggestions
function createCitySuggestions(input, suggestions) {
  const value = input.value;
  const suggestionsList = input.parentNode.querySelector(".form__suggestions");
  suggestionsList.innerHTML = "";
  if (!value) return;
  const filteredSuggestions = suggestions.filter((city) =>
    city.toLowerCase().startsWith(value.toLowerCase()),
  );
  filteredSuggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement("li");
    suggestionElement.textContent = suggestion;
    suggestionElement.classList.add("form__suggestion");
    suggestionElement.addEventListener("click", function () {
      input.value = suggestion;
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(suggestionElement);
  });
}

// Function to create nationality suggestions
function createNationalitySuggestions(input, suggestions) {
  const value = input.value.trim().toLowerCase();
  const suggestionsList = input.parentNode.querySelector(".form__suggestions");
  const nationalityFlag = document.querySelector(".form__nationality-flag");
  nationalityFlag.src = "";
  suggestionsList.innerHTML = "";

  if (!value) return;

  const nationalityFlagBaseURL = "https://flagsapi.com/";
  const nationalityFlagSizeSmall = "/flat/16.png";
  const nationalityFlagSizeLarge = "/flat/32.png";

  suggestions.forEach((suggestion) => {
    const nationality = suggestion.nationality.toLowerCase();

    if (nationality.startsWith(value)) {
      const suggestionElement = document.createElement("li");
      suggestionElement.classList.add("form__suggestion");

      const flagImg = document.createElement("img");
      flagImg.alt = suggestion.flag;
      flagImg.src =
        nationalityFlagBaseURL +
        suggestion.flag.toUpperCase() +
        nationalityFlagSizeSmall;

      const suggestionText = document.createElement("span");
      suggestionText.textContent = suggestion.nationality;

      suggestionElement.appendChild(flagImg);
      suggestionElement.appendChild(suggestionText);

      suggestionElement.addEventListener("click", function () {
        input.value = suggestion.nationality;
        nationalityFlag.src =
          nationalityFlagBaseURL +
          suggestion.flag.toUpperCase() +
          nationalityFlagSizeLarge;
        suggestionsList.innerHTML = "";
      });

      suggestionsList.appendChild(suggestionElement);
    }
  });
}

// Function to calculate checkout date based on checkin date and nights
function calculateCheckoutDate(checkinDate, nights) {
  const checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(checkoutDate.getDate() + parseInt(nights));
  return checkoutDate.toISOString().split("T")[0];
}

// Function to update nights based on checkin and checkout dates
function updateNights(checkinInput, checkoutInput, nightsInput) {
  const checkinDate = new Date(checkinInput.value);
  const checkoutDate = new Date(checkoutInput.value);
  const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);
  nightsInput.value = nights > 0 ? nights : 0;
}

function openModal(modal) {
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const checkinInput = document.querySelector(".form__input--checkin");
  const checkoutInput = document.querySelector(".form__input--checkout");
  const nightsInput = document.querySelector(".form__input--nights");
  const cityInput = document.querySelector(".form__input--city");
  const nationalityInput = document.querySelector(".form__input--nationality");
  const modal = document.querySelector(".modal");
  const modalClose = document.querySelector(".modal__close");
  const advancedSearch = document.querySelector(
    ".form__button--advanced-search",
  );

  setupDateInputs(dateInputs);

  cityInput.addEventListener("input", function (e) {
    createCitySuggestions(e.target, cities);
  });

  nationalityInput.addEventListener("input", function (e) {
    createNationalitySuggestions(e.target, nationalities);
  });

  nightsInput.addEventListener("input", function () {
    if (nightsInput.value <= 0) nightsInput.value = 0;
    checkoutInput.value = calculateCheckoutDate(
      checkinInput.value,
      nightsInput.value,
    );
  });

  checkoutInput.addEventListener("input", function () {
    updateNights(checkinInput, checkoutInput, nightsInput);
  });

  advancedSearch.addEventListener("click", openModal.bind(null, modal));

  modalClose.addEventListener("click", closeModal.bind(null, modal));

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal(modal);
  });
});
