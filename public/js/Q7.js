function updateDateTime() {
    const now = new Date();
    const day = now.toLocaleDateString(); // Date in MM/DD/YYYY format
    const time = now.toLocaleTimeString(); // Time in HH:MM:SS format
    const dateTimeString = `${day} ${time}`;
    
    document.getElementById('date').innerHTML = dateTimeString;
}

updateDateTime();
setInterval(updateDateTime, 1000); //update every second

function validateCatForm(event) {
    const form = document.forms['catForm'];

    const breedCheckboxes = form.querySelectorAll('input[name="catBreed[]"]');
    const selectedBreeds = Array.from(breedCheckboxes).some(input => input.checked);

    const ageSelect = form.querySelector('select[name="age"]');
    const selectedAge = ageSelect.value.trim();

    const genderRadios = form.querySelectorAll('input[name="gender"]');
    const selectedGender = Array.from(genderRadios).some(input => input.checked);

    const coexistingRadios = form.querySelectorAll('input[name="coexisting"]');
    const selectedCoexisting = Array.from(coexistingRadios).some(input => input.checked);

    // Validation checks
    if (!selectedBreeds) {
        alert('Please select at least one breed.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (selectedAge === '') {
        alert('Please select a preferred age.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (!selectedGender) {
        alert('Please select a preferred gender.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (!selectedCoexisting) {
        alert('Please specify if the cat needs to get along with other dogs, cats, or children.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    return true; // Form is valid
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.forms['catForm'];
    form.addEventListener('submit', function(event) {
        if (!validateCatForm(event)) {
            // If validation fails, stop the form submission
            event.preventDefault();
        }
    });
});

function validateDogForm(event) {
    const form = document.forms['dogForm']; // Access form by name

    // Access form fields
    const breedCheckboxes = form.querySelectorAll('input[name="dogBreed[]"]');
    const selectedBreeds = Array.from(breedCheckboxes).some(input => input.checked);

    const ageSelect = form.querySelector('select[name="age"]');
    const selectedAge = ageSelect.value.trim();

    const genderRadios = form.querySelectorAll('input[name="gender"]');
    const selectedGender = Array.from(genderRadios).some(input => input.checked);

    const coexistingRadios = form.querySelectorAll('input[name="coexisting"]');
    const selectedCoexisting = Array.from(coexistingRadios).some(input => input.checked);

    // Validation checks
    if (!selectedBreeds) {
        alert('Please select at least one breed.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (selectedAge === '') {
        alert('Please select a preferred age.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (!selectedGender) {
        alert('Please select a preferred gender.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (!selectedCoexisting) {
        alert('Please specify if the dog needs to get along with other dogs, cats, or children.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    return true; // Form is valid
}

// Attach event listener
document.addEventListener('DOMContentLoaded', () => {
    const form = document.forms['dogForm'];
    form.addEventListener('submit', function(event) {
        if (!validateDogForm(event)) {
            // If validation fails, stop the form submission
            event.preventDefault();
        }
    });
});

function validateGiveAway(event) {
    const form = document.forms['giveAwayForm'];

    const animalRadio = form.querySelectorAll('input[name="animal"]');
    const selectedAnimal = Array.from(animalRadio).some(input => input.checked);

    const breed = document.getElementById('breed').value.trim();
    const validBreed = /^[A-Za-z ]+$/;

    const ageSelect = form.querySelector('select[name="age"]').value.trim();

    const genderRadios = form.querySelectorAll('input[name="gender"]');
    const selectedGender = Array.from(genderRadios).some(input => input.checked);

    const dogRadio = form.querySelectorAll('input[name="alongDogs"]');
    const alongDogs = Array.from(dogRadio).some(input => input.checked);

    const catRadio = form.querySelectorAll('input[name="alongCats"]');
    const alongCats = Array.from(catRadio).some(input => input.checked);

    const kidsRadio = form.querySelectorAll('input[name="alongKids"]');
    const alongKids = Array.from(kidsRadio).some(input => input.checked);

    const comment = document.getElementById('comments').value.trim();
    const maxLength = 500;

    const firstName = document.getElementById('givenName').value.trim();
    const lastName = document.getElementById('familyName').value.trim();
    const validName = /^[A-Za-z\- ]+$/;

    const email = document.getElementById('ownerEmail').value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!selectedAnimal) {
        alert('Please specify if your pet is a dog or a cat.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (!validBreed.test(breed)) {
        alert('Please enter a valid breed.');
        event.preventDefault();
        return false;
    }
    if (ageSelect === '') {
        alert('Please specify the age of your pet.');
        event.preventDefault(); // Prevent form submission
        return false;
    }
    if (!selectedGender) {
        alert('Please specify the gender of your pet');
        event.preventDefault();
        return false;
    }
    if (!alongDogs) {
        alert('Please specify if your pet gets along with dogs.');
        event.preventDefault();
        return false;
    }
    if (!alongCats) {
        alert('Please specify if your pet gets along with cats.');
        event.preventDefault();
        return false;
    }
    if (!alongKids) {
        alert('Please specify if your pet gets along with kids.');
        event.preventDefault();
        return false;
    }
    if (comment.length === 0 || comment.length > maxLength) {
        alert('Please brag about your pet using a maximum of 500 characters.');
        event.preventDefault();
        return false;
    }
    if (!validName.test(firstName)) {
        alert('Please enter a valid given name.');
        event.preventDefault();
        return false;
    }
    if (!validName.test(lastName)) {
        alert('Please enter a valid family name.');
        event.preventDefault();
        return false;
    }
    if (!validEmail.test(email)) {
        alert('Please enter a valid email address.');
        event.preventDefault();
        return false;
    }

    return true;
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.forms['giveAwayForm'];
    form.addEventListener('submit', function(event) {
        if (!validateGiveAway(event)) {
            // If validation fails, stop the form submission
            event.preventDefault();
        }
    });
});
