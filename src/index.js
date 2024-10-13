// Function to display ramen details when an image is clicked
const handleClick = (ramen) => {
  // Select elements to display ramen details
  const detailImage = document.querySelector('.detail-image');
  const nameDisplay = document.querySelector('.name');
  const restaurantDisplay = document.querySelector('.restaurant');
  const ratingDisplay = document.getElementById('rating-display');
  const commentDisplay = document.getElementById('comment-display');

  // Update the DOM with selected ramen details
  detailImage.src = ramen.image;
  nameDisplay.textContent = ramen.name;
  restaurantDisplay.textContent = ramen.restaurant;
  ratingDisplay.textContent = ramen.rating;
  commentDisplay.textContent = ramen.comment;

  // Pre-fill the edit form with current ramen details for updating
  document.getElementById('edit-rating').value = ramen.rating;
  document.getElementById('edit-comment').value = ramen.comment;

  // Store the ramen ID in the edit form for future updates
  document.getElementById('edit-ramen').dataset.ramenId = ramen.id;
};

// Function to add a new ramen via form submission
const addSubmitListener = () => {
  const form = document.getElementById('new-ramen');

  // Ensure the form exists before adding an event listener
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the default form submission behavior

      const newRamen = {
        name: form.name.value,
        restaurant: form.restaurant.value,
        image: form.image.value,
        rating: Number(form.rating.value), // Ensure rating is a number
        comment: form['new-comment'].value,
      };

      // Display the new ramen in the menu
      displayNewRamen(newRamen);

      // Send a POST request to add the new ramen to the server
      fetch('http://localhost:3000/ramens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRamen),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to add new ramen');
          }
          return response.json();
        })
        .then(data => {
          console.log('New ramen added:', data);
          form.reset(); // Clear the form fields after submission
        })
        .catch(error => {
          console.error('Error adding new ramen:', error);
        });
    });
  } else {
    console.error('New ramen form not found!');
  }
};

// Function to display a new ramen image in the menu
const displayNewRamen = (ramen) => {
  const ramenMenu = document.getElementById('ramen-menu');
  const ramenImage = document.createElement('img');
  ramenImage.src = ramen.image;
  ramenImage.alt = ramen.name;

  // Add click event to the ramen image
  ramenImage.addEventListener('click', () => handleClick(ramen));
  ramenMenu.appendChild(ramenImage);
};

// Function to fetch and display all ramen from the server
const displayRamens = () => {
  fetch('http://localhost:3000/ramens')
    .then(response => response.json())
    .then(ramens => {
      // Display each ramen in the menu
      ramens.forEach(ramen => displayNewRamen(ramen));

      // Automatically display details of the first ramen
      if (ramens.length > 0) {
        handleClick(ramens[0]);
      }
    })
    .catch(error => console.error('Error fetching ramens:', error));
};

// Function to handle updates to ramen details
const addUpdateListener = () => {
  const editForm = document.getElementById('edit-ramen');

  // Ensure the edit form exists before adding an event listener
  if (editForm) {
    editForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission

      const ramenId = editForm.dataset.ramenId; // Get ramen ID for updating
      const updatedRamen = {
        rating: Number(editForm.rating.value),
        comment: editForm['edit-comment'].value,
      };

      // Send a PATCH request to update the ramen in the server
      fetch(`http://localhost:3000/ramens/${ramenId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRamen),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update ramen');
          }
          return response.json();
        })
        .then(data => {
          console.log('Ramen updated:', data);
          // Re-display the updated ramen details on the page
          const ramenToUpdate = { ...data, image: document.querySelector('.detail-image').src }; // Retain image source
          handleClick(ramenToUpdate);
        })
        .catch(error => {
          console.error('Error updating ramen:', error);
        });
    });
  } else {
    console.error('Edit form element not found!');
  }
};

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  displayRamens(); // Fetch and display all ramens
  addSubmitListener(); // Add listener for new ramen form
  addUpdateListener(); // Add listener for editing ramen
});

// Export functions for testing purposes
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  addUpdateListener,
};
