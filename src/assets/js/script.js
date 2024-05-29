//reachout form
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("consultationForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      var form = event.target;
      var isValid = form.checkValidity();
      if (isValid) {
        submitForm(form);
      } else {
        alert("Please fill out all required fields.");
      }
    });
});

function submitForm(form) {
  var formData = new FormData(form);
  fetch(form.action, {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      if (response.ok) {
        alert("Form submitted successfully!");
        form.reset();
      } else {
        throw new Error("Form submission failed!");
      }
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert(
        "An error occurred while submitting the form. Please try again later."
      );
    });
}


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
  var x = document.getElementById("nav");
  if (x.className === "nav") {
    x.className += " responsive";
  } else {
    x.className = "nav";
  }
}