import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

function FillablePDFForm() {
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const pdfUrl = '/path/to/your/fillable_pdf.pdf'; // Replace with your PDF URL
            const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            // Fill form fields with data
            form.getTextFields().forEach((field) => {
                if (field.getName()) {
                    field.setText('Your data here');
                }
            });

            const modifiedPdfBytes = await pdfDoc.save();
            setPdfData(new Uint8Array(modifiedPdfBytes));
        };

        fetchData();
    }, []);

    return (
        <div>
            {pdfData && (
                <Document file={{ data: pdfData }}>
                    <Page pageNumber={1} />
                </Document>
            )}
        </div>
    );
}

export default FillablePDFForm;