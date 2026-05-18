document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");
  let currentActivities = {};

  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove("hidden");

    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  }

  function renderActivities(activities) {
    activitiesList.innerHTML = "";
    activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

    Object.entries(activities).forEach(([name, details]) => {
      const activityCard = document.createElement("article");
      activityCard.className = "activity-card";
      activityCard.dataset.activityName = name;

      const spotsLeft = details.max_participants - details.participants.length;
      const participantItems = details.participants.length
        ? details.participants
          .map(
            (participant) => `
              <li class="participant-item">
                <span class="participant-email">${participant}</span>
                <button
                  type="button"
                  class="delete-participant-btn"
                  data-activity-name="${name}"
                  data-participant-email="${participant}"
                  aria-label="Remove ${participant} from ${name}"
                  title="Unregister participant"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </li>
            `
          )
          .join("")
        : '<li class="participant-empty">No participants yet</li>';

      activityCard.innerHTML = `
        <div class="activity-card-header">
          <h4>${name}</h4>
          <span class="availability-pill">${spotsLeft} spots left</span>
        </div>
        <p>${details.description}</p>
        <p><strong>Schedule:</strong> ${details.schedule}</p>
        <section class="participants-section">
          <h5>Participants</h5>
          <ul class="participants-list">
            ${participantItems}
          </ul>
        </section>
      `;

      activitiesList.appendChild(activityCard);

      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      activitySelect.appendChild(option);
    });
  }

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities", { cache: "no-store" });
      const activities = await response.json();

      currentActivities = activities;
      renderActivities(activities);
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        const participants = currentActivities[activity]?.participants || [];
        if (!participants.includes(email)) {
          currentActivities[activity].participants = [...participants, email];
        }

        renderActivities(currentActivities);
        showMessage(result.message, "success");
        signupForm.reset();
      } else {
        showMessage(result.detail || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("Failed to sign up. Please try again.", "error");
      console.error("Error signing up:", error);
    }
  });

  activitiesList.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest(".delete-participant-btn");
    if (!deleteButton) {
      return;
    }

    const { activityName, participantEmail } = deleteButton.dataset;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activityName)}/participants?email=${encodeURIComponent(participantEmail)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        currentActivities[activityName].participants = currentActivities[activityName].participants.filter(
          (email) => email !== participantEmail
        );

        renderActivities(currentActivities);
        showMessage(result.message, "success");
      } else {
        showMessage(result.detail || "Unable to unregister participant.", "error");
      }
    } catch (error) {
      showMessage("Failed to unregister participant. Please try again.", "error");
      console.error("Error unregistering participant:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
