function renderPresentation(presentation) {
    const container = document.getElementById('checklist-container');
    container.innerHTML = '';

    const presentationElement = document.createElement('div');
    presentationElement.className = 'presentation';

    const heading = document.createElement('h2');
    heading.textContent = presentation.name;
    presentationElement.appendChild(heading);

    presentation.categories.forEach(category => {
        presentationElement.appendChild(renderCategory(category));
    });

    container.appendChild(presentationElement);
}

function renderCategory(category) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category';

    const categoryName = document.createElement('h3');
    categoryName.textContent = category.name;
    categoryElement.appendChild(categoryName);

    const detailsList = document.createElement('ul');
    const listItem = document.createElement('li');
    listItem.innerHTML = category.details.join(' | ');
    detailsList.appendChild(listItem);

    categoryElement.appendChild(detailsList);
    return categoryElement;
}

function updateNavigation() {
    const navContainer = document.getElementById('presentation-navigation');
    const data = getPresentationsData();
    const currentIndex = getCurrentPresentationIndex();

    navContainer.innerHTML = '';

    if (data.presentations.length > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = previousPresentation;
        prevButton.disabled = currentIndex === 0;

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = nextPresentation;
        nextButton.disabled = currentIndex === data.presentations.length - 1;

        const indexDisplay = document.createElement('span');
        indexDisplay.textContent = `${currentIndex + 1} / ${data.presentations.length}`;

        navContainer.appendChild(prevButton);
        navContainer.appendChild(indexDisplay);
        navContainer.appendChild(nextButton);
    }
}