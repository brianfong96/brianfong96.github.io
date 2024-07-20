let currentPresentationIndex = 0;

console.log('main.js loaded');

function initializeApp() {
    console.log('Initializing app');
    const fileInput = document.getElementById('fileInput');
    const generatePdfBtn = document.getElementById('generatePdfBtn');

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelectAndRender);
        console.log('Event listener added to fileInput');
    } else {
        console.error('File input element not found');
    }

    if (generatePdfBtn) {
        generatePdfBtn.addEventListener('click', generatePdf);
        console.log('Event listener added to generatePdfBtn');
    } else {
        console.error('Generate PDF button not found');
    }
}

async function handleFileSelectAndRender(event) {
    console.log('File selected');
    await handleFileSelect(event);
    renderCurrentPresentation();
    updateNavigation();
}

function renderCurrentPresentation() {
    const data = getPresentationsData();
    if (data && data.presentations && data.presentations.length > 0) {
        renderPresentation(data.presentations[currentPresentationIndex]);
    } else {
        const container = document.getElementById('checklist-container');
        if (container) {
            container.innerHTML = '<p>No presentations available.</p>';
        }
    }
}

function nextPresentation() {
    const data = getPresentationsData();
    if (data && data.presentations && currentPresentationIndex < data.presentations.length - 1) {
        currentPresentationIndex++;
        renderCurrentPresentation();
        updateNavigation();
    }
}

function previousPresentation() {
    if (currentPresentationIndex > 0) {
        currentPresentationIndex--;
        renderCurrentPresentation();
        updateNavigation();
    }
}

function getCurrentPresentationIndex() {
    return currentPresentationIndex;
}

// Initialize the app after the page has loaded
document.addEventListener('DOMContentLoaded', initializeApp);