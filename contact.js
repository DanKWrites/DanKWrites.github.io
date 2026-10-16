// Sends the contact form in the background so visitors stay on your site
// (without this file, the form still works, but visitors land on the form service's own page).
(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (!form) {
    return;
  }

  var button = form.querySelector("button[type='submit']");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    button.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending...";

    fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (!data.success) {
          throw new Error("Form service reported a problem");
        }
        form.reset();
        status.textContent = "Thank you! Your message has been sent.";
      })
      .catch(function () {
        status.className = "form-status error";
        status.textContent = "Sorry, something went wrong. Please try again in a moment.";
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
