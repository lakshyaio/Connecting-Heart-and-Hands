document.addEventListener('DOMContentLoaded', function() {
    // Get the NGO ID from the query parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const ngoId = urlParams.get('id');

    // Fetch NGO details based on the ID
    fetch('/models/ngos.json') // Assuming JSON file is served from the server
        .then(response => response.json())
        .then(data => {
            const ngo = data.find(item => item.id == ngoId); // Find the NGO with the matching ID
            if (ngo) {
                // Update the About Us section with the NGO's details
                const aboutUs = document.querySelector('.about-us');
                const ngoDetails = `
                    <h2>${ngo.name}</h2>
                    <p><strong>Description:</strong> ${ngo.About}</p>
                    <p><strong>Website:</strong> <a href="${ngo.website}" target="_blank">${ngo.website}</a></p>
                `;
                aboutUs.innerHTML = ngoDetails; // Append NGO details to the about-us div
            } else {
                console.error(`NGO with ID ${ngoId} not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching NGO details:', error);
});
});
