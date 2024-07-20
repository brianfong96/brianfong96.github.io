let presentationsData = null;

function handleFileSelect(event) {
    return new Promise((resolve, reject) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    presentationsData = JSON.parse(e.target.result);
                    console.log('Data loaded successfully');
                    resolve();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    document.getElementById('checklist-container').innerHTML = '<p>Error parsing JSON file. Please ensure it\'s a valid JSON format.</p>';
                    reject(error);
                }
            };
            reader.onerror = function(e) {
                console.error('Error reading file:', e);
                document.getElementById('checklist-container').innerHTML = '<p>Error reading file. Please try again.</p>';
                reject(e);
            };
            reader.readAsText(file);
        } else {
            reject(new Error('No file selected'));
        }
    });
}

function getPresentationsData() {
    return presentationsData;
}