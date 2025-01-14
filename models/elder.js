document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const ngoList = document.getElementById('ngoList');
    let ngos = []; // Define ngos array outside fetch

    // Fetch ngos from JSON
    fetch('/models/ngos.json') // Assuming JSON file is served from the server
        .then(response => response.json())
        .then(data => {
            ngos = data; 
            displayEldersRelatedNGOs(ngos); // Display all NGOs with elders-related descriptions initially
        })
        .catch(error => {
            console.error('Error fetching ngos:', error);
        });

    function displayEldersRelatedNGOs(ngos) {
        ngoList.innerHTML = '';
        const eldersRelatedNGOs = ngos.filter(ngo => ngo.description.toLowerCase().includes('elder'));
        eldersRelatedNGOs.forEach(ngo => {
            const ngoCard = `
                <div class="ngo">
                    <h3>${ngo.name}</h3>
                    <p><strong>Description:</strong> ${ngo.description}</p>
                    <p><strong>Contact:</strong> ${ngo.contact}</p>
                    <p><strong>Website:</strong> <a href="${ngo.website}" target="_blank">${ngo.website}</a></p>
                    <a class="donate-button" href="/views/donatenow.html?id=${ngo.id}">Donate Now</a> <!-- Updated Donate Now button with NGO's ID as query parameter -->                </div>
            `;
            ngoList.insertAdjacentHTML('beforeend', ngoCard);
        });
        document.querySelectorAll('.ngo').forEach(ngoCard => {
            ngoCard.addEventListener('click', () => {
                const ngoId = ngoCard.dataset.id; // Get the ID of the clicked NGO
                // Redirect to donatenow.html with the NGO's ID as a query parameter
                window.location.href = `/views/donatenow.html?id=${ngoId}`;
            });
     });
    }

    function searchNGOs() {
        const searchQuery = searchBar.value.trim().toLowerCase();
        if (searchQuery === '') {
            displayEldersRelatedNGOs(ngos); // Display all Elders-related NGOs if search bar is empty
            return;
        }
        const filteredNGOs = ngos.filter(ngo => 
            ngo.name.toLowerCase().includes(searchQuery) || // Check NGO name
            ngo.description.toLowerCase().includes(searchQuery) || // Check description
            ngo.tags.some(tag => tag.toLowerCase().includes(searchQuery)) // Check tags
        );
        displayEldersRelatedNGOs(filteredNGOs);
    }

    searchButton.addEventListener('click', searchNGOs);

    searchBar.addEventListener('input', searchNGOs);
});
