function generatePdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = getPresentationsData();

    if (!data || !data.presentations || data.presentations.length === 0) {
        alert('No presentation data available to generate PDF.');
        return;
    }

    let yOffset = 10;
    const lineHeight = 6;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;

    data.presentations.forEach((presentation, index) => {
        if (index > 0) {
            doc.addPage();
            yOffset = 10;
        }

        // Add presentation name
        yOffset += lineHeight * 2; // Add extra space after the title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(presentation.name, margin, yOffset);
        yOffset += lineHeight; // Add extra space after the title

        // Draw a horizontal line
        doc.setDrawColor(0); // Set color of the line (black)
        doc.setLineWidth(0.5); // Set line width
        doc.line(margin, yOffset, pageWidth - margin, yOffset); // Draw line
        yOffset += lineHeight; // Adjust space after the line before starting content

        presentation.categories.forEach(category => {
            // Check if we need a new page
            if (yOffset > 280) {
                doc.addPage();
                yOffset = 10;
            }

            doc.setFontSize(11.5);
            doc.setFont(undefined, 'bold');
            doc.text(category.name, margin, yOffset);
            yOffset += lineHeight * 1;

            // Combine details into a single line
            const detailsText = '' + category.details.join(' | ');

            // Calculate the height needed for the text
            doc.setFont(undefined, 'normal');
            doc.setFontSize(11.5);
            const splitText = doc.splitTextToSize(detailsText, contentWidth - 4);
            const boxHeight = splitText.length * lineHeight + 4; // 4 for padding

            // Draw light gray background
            doc.setFillColor(240, 240, 240); // Light gray
            doc.rect(margin, yOffset - 5, contentWidth, boxHeight, 'F');

            // Add text
            doc.setTextColor(0); // Black text
            splitText.forEach((line, lineIndex) => {
                // Check if we need a new page
                if (yOffset > 280) {
                    doc.addPage();
                    yOffset = 10;
                    // Redraw background on new page
                    const remainingHeight = (splitText.length - lineIndex) * lineHeight + 4;
                    doc.setFillColor(240, 240, 240);
                    doc.rect(margin, yOffset - 2, contentWidth, remainingHeight, 'F');
                }

                doc.text(line, margin + 2, yOffset);
                yOffset += lineHeight;
            });

            yOffset += lineHeight; // Add some space between categories
        });
    });

    doc.save('patient_presentation.pdf');
}