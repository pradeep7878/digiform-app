import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

const FillPdfForm = () => {
    const [outputPdf, setOutputPdf] = useState(null);

    const fillPdfFields = async (pdfBytes, fieldData) => {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        fieldData.forEach((data) => {
            const field = form.getField(data.name);
            if (field) {
                try {
                    switch (field.constructor.name) {
                        case "PDFTextField":
                            field.setText(data.value);
                            break;
                        case "PDFCheckBox":
                            if (data.value === true) {
                                field.check();
                            } else {
                                field.uncheck();
                            }
                            break;
                        case "PDFDropdown":
                            field.select(data.value);
                            break;
                        case "PDFRadioGroup":
                            field.select(data.value);
                            break;
                        default:
                            console.log(`Unsupported field type: ${field.constructor.name}`);
                    }
                } catch (error) {
                    console.error(
                        `Error setting field ${data.name} with value ${data.value}: ${error.message}`
                    );
                }
            }
        });

        return pdfDoc.save();
    };

    const handleSubmit = async () => {
        const inputPdfPath = 'KYC_ApplForm_fillable_final.pdf'; // Path to your local PDF file
        const response = await fetch(inputPdfPath);
        const pdfBytes = await response.arrayBuffer();

        const fieldData = [
            { name: "ApplicantName", value: "Ajay Pradeep" },
            { name: "FatherName", value: "Prakash" },
        ];

        try {
            const filledPdfBytes = await fillPdfFields(pdfBytes, fieldData);
            const blob = new Blob([filledPdfBytes], { type: "application/pdf" });
            saveAs(blob, "filled_form.pdf");
            setOutputPdf(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Error filling PDF fields:", error);
        }
    };

    return (
        <div>
            <h1>Fill PDF Form</h1>
            <button onClick={handleSubmit}>Fill PDF</button>
            {outputPdf && (
                <a href={outputPdf} download="filled_form.pdf">
                    Download Filled PDF
                </a>
            )}
        </div>
    );
};

export default FillPdfForm;