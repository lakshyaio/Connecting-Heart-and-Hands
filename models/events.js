document.addEventListener("DOMContentLoaded", function() {
    fetch('/models/events.json')
    .then(response => response.json())
    .then(data => {
        const eventsContainer = document.getElementById('eventsContainer');

        data.forEach(event => {
            let eventCard = createEventCard(event);
            eventsContainer.appendChild(eventCard);
        });
    })
    .catch(error => console.error('Error fetching events:', error));

    function createEventCard(event) {
        let eventCard = document.createElement('div');
        eventCard.className = 'event';

        let imageDiv = document.createElement('div');
        imageDiv.className = 'event-image';
        let image = document.createElement('img');
        image.src = event.image;
        image.alt = event.title;
        imageDiv.appendChild(image);

        let detailsDiv = document.createElement('div');
        detailsDiv.className = 'event-details';

        let title = document.createElement('h2');
        title.textContent = event.title;

        let time = document.createElement('p');
        time.innerHTML = `<strong>Time:</strong> ${event.time}`;

        let ngoName = document.createElement('p');
        ngoName.innerHTML = `<strong>NGO Name:</strong> ${event.ngoName}`;

        let place = document.createElement('p');
        place.innerHTML = `<strong>Place:</strong> ${event.place}`;

        let description = document.createElement('p');
        description.innerHTML = `<strong>Description:</strong> ${event.description}`;

        let volunteerButton = document.createElement('a');
        volunteerButton.href = event.volunteerLink;
        volunteerButton.className = 'button';
        volunteerButton.textContent = 'Volunteer Now';

        detailsDiv.appendChild(title);
        detailsDiv.appendChild(time);
        detailsDiv.appendChild(ngoName);
        detailsDiv.appendChild(place);
        detailsDiv.appendChild(description);
        detailsDiv.appendChild(volunteerButton);

        eventCard.appendChild(imageDiv);
        eventCard.appendChild(detailsDiv);

        return eventCard;
   }
});
