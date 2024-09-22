//Edits for future site functionality go here.
document.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("copyright-date");
  const currentDate = new Date();
  const options = { year: 'numeric'};
  dateElement.textContent = currentDate.toLocaleDateString(undefined, options);
});

// Mastheading Animation Event Listener
 document.addEventListener('DOMContentLoaded', function() {
    const mastheadHeading = document.querySelector('.masthead-heading');

    document.addEventListener('mousemove', function(e) {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate the background position based on mouse coordinates
      const xPos = (clientX / innerWidth) * 100;
      const yPos = (clientY / innerHeight) * 100;

      // Update the background position
      mastheadHeading.style.backgroundPosition = `${xPos}% ${yPos}%`;
    });
  });