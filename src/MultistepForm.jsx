import React, { useEffect, useState } from 'react'
import Header from './Header';
import { Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { FiUpload } from "react-icons/fi";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { BsFiletypePdf } from "react-icons/bs";
import extractedFields from './extractedJson';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';
import { saveAs } from "file-saver";





pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;




const MultistepForm = () => {


    const pdfUrl = 'KYC_ApplForm_fillable_final.pdf'; // Replace with your PDF URL

    const [showFieldOne, setShowFieldOne] = useState(false)
    const [showFieldTwo, setShowFieldTwo] = useState(false)
    const [showFieldThree, setShowFieldThree] = useState(false)
    // const [pdfUrl, setPdfUrl] = useState(require('../src/assets/KYC_ApplForm.pdf'))

    useEffect(() => {
        setShowFieldOne(true)
    }, [])




    var currentStep = 1;
    var updateProgressBar;

    function displayStep(stepNumber) {

        console.log(stepNumber)

        if (stepNumber === 1) {
            setShowFieldOne(true)
            setShowFieldTwo(false)
            setShowFieldThree(false)
        } else if (stepNumber === 2) {
            setShowFieldOne(false)
            setShowFieldTwo(true)
            setShowFieldThree(false)
        } else if (stepNumber === 3) {
            setShowFieldOne(false)
            setShowFieldTwo(false)
            setShowFieldThree(true)
        }

        if (stepNumber >= 1 && stepNumber <= 3) {
            document.querySelector(".step-" + currentStep).style.display = "none";
            document.querySelector(".step-" + stepNumber).style.display = "block";
            currentStep = stepNumber;
            updateProgressBar();
        }
    }

    updateProgressBar = function () {
        var progressPercentage = ((currentStep - 1) / 2) * 100;
        document.querySelector(".progress-bar").style.width = progressPercentage + "%";
    }
    document.addEventListener("DOMContentLoaded", function () {
        var multiStepForm = document.getElementById("multi-step-form");
        var steps = multiStepForm.querySelectorAll(".step");
        for (var i = 1; i < steps.length; i++) {
            steps[i].style.display = "none";
        }

        var nextButtons = document.querySelectorAll(".next-step");
        nextButtons.forEach(function (button) {

            console.log(button)

            button.addEventListener("click", function () {

                console.log("next")

                if (currentStep < 3) {




                    document.querySelector(".step-" + currentStep).classList.add("animate__animated", "animate__fadeOutLeft");
                    currentStep++;
                    setTimeout(function () {
                        var steps = document.querySelectorAll(".step");
                        steps.forEach(function (step) {
                            step.classList.remove("animate__animated", "animate__fadeOutLeft");
                            step.style.display = "none";
                        });
                        document.querySelector(".step-" + currentStep).style.display = "block";
                        document.querySelector(".step-" + currentStep).classList.add("animate__animated", "animate__fadeInRight");
                        updateProgressBar();
                    }, 500);
                }
            });
        });

        var prevButtons = document.querySelectorAll(".prev-step");
        prevButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                if (currentStep > 1) {
                    document.querySelector(".step-" + currentStep).classList.add("animate__animated", "animate__fadeOutRight");
                    currentStep--;
                    setTimeout(function () {
                        var steps = document.querySelectorAll(".step");
                        steps.forEach(function (step) {
                            step.classList.remove("animate__animated", "animate__fadeOutRight");
                            step.style.display = "none";
                        });
                        document.querySelector(".step-" + currentStep).style.display = "block";
                        document.querySelector(".step-" + currentStep).classList.add("animate__animated", "animate__fadeInLeft");
                        updateProgressBar();
                    }, 500);
                }
            });
        });


    });



    const [numPages, setNumPages] = useState(Number);
    const [pageNumber, setPageNumber] = useState(1);
    const [documentAadhar, setDocumentAadhar] = useState(null)
    const [documentPan, setDocumentPan] = useState(null)
    const [documentsUploaded, setDocumentsUploaded] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [fieldKeys, setFieldKeys] = useState("")

    let allValues = []

    const [pdfData, setPdfData] = useState(null);


    const [responseData, setResponseData] = useState([])

    function onDocumentLoadSuccess(pdf) {
        setNumPages(pdf?.numPages);
    }

    const handleCardClick = (e, value) => {
        if (value === "aadhaarCard") {
            document.getElementById("aadhaarCard").click()
            console.log('aadhaar')
        }
        else if (value === "panCard") {
            document.getElementById("panCard").click()
            console.log('panCard')
        }
        // else{
        //     document.getElementById("other").click()
        //     console.log('other')
        // }

    }



    const handleAadhaarCardUpload = (e) => {
        const file = e.target.files[0]
        console.log(file)

        setDocumentAadhar(e.target.files[0]);
    }

    const handlePanCardUpload = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setDocumentPan(e.target.files[0])
    }




    // const handleCardUpload = async (e, value) => {
    //     var formData = new FormData();



    //     const config = {
    //         headers: {
    //             "content-type": "multipart/formdata",
    //         }
    //     }

    //     const requiredParams = {
    //         filename: "KYC_ApplForm_p.pdf"
    //     }

    //     if (value === "aadhaarCard") {
    //         setDocumentAadhar(e.target.files[0]);
    //         const file = e.target.files[0]
    //         formData.append("aadhar", file);
    //     }
    //     else if (value === "panCard") {
    //         setDocumentPan(e.target.files[0])
    //         const file = e.target.files[0];
    //         formData.append("pan", file);

    //     }

    //     console.log(documentAadhar)
    //     console.log(documentPan)


    //     if (documentAadhar !== null && documentPan !== null) {
    //         (async () => { await updatePDF(formData, requiredParams, config) })()
    //     }

    // }

    // const updatePDF = async (formData, requiredParams, config) => {
    //     alert("Hai")
    //     try {
    //         await axios.post('https://digiform.adraproductstudio.com/update_pdf', formData, requiredParams, config)
    //             .then((response) => {
    //                 console.log(response)
    //                 if (response.data.error_code === 0) {
    //                     console.log("Uploaded successfully")
    //                 } else {
    //                     console.log("Not uploaded")
    //                 }
    //             }).catch((err) => {
    //                 console.log(err)
    //             })


    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    const handleDocumentsUpload = async (e) => {
        setUploading(true)


        if (documentAadhar !== null && documentPan !== null) {

            const formData = new FormData()
            formData.append("aadhar", documentAadhar);
            formData.append("pan", documentPan)
            formData.append("filename", "KYC_ApplForm_p.pdf")


            const config = {
                headers: {
                    "content-type": "multipart/formdata",
                }
            }


            try {

                await axios.post('https://digiform.adraproductstudio.com/update_pdf', formData, config)
                    .then((response) => {
                        console.log(response)
                        if (response.data.error_code === 0) {
                            console.log(response)
                            setUploading(false)
                            setDocumentsUploaded(true)
                            setResponseData(response.data.data.combined_json)
                            toast.success(response.data.message)
                            getKeysFunction(response.data.data.combined_json);



                        } else {
                            setUploading(false)
                            toast.error(response.data.message)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })


            } catch (err) {
                console.log(err)
            }

        }
    }

console.log(responseData)


    const responseMapResult = responseData.map((value,index) => {
        
    })


    const getKeysFunction = async (APIResponse) => {


        function findCommonKeys(extractedFields, responseData) {
            // Collect all unique keys from both arrays
            const keysSet1 = new Set(extractedFields.flatMap(obj => Object.keys(obj)));
            const keysSet2 = new Set(responseData.flatMap(obj => Object.keys(obj)));
        
            // Find the intersection of the keys
            const commonKeys = [...keysSet1].filter(key => keysSet2.has(key));
        
            return commonKeys;
        }
        
        // Example usage:
        const array1 = [
            { name: "John", fruit: 30, city: "New York" },
            { name: "Alice", fruit: 25, city: "Los Angeles" }
        ];
        
        const array2 = [
            { name: "John", age: 30, profession: "Engineer" },
            { name: "Alice", age: 25, profession: "Doctor" }
        ];
        
        const commonKeys = findCommonKeys(extractedFields, responseData);
        console.log("Common keys:", commonKeys);






        extractedFields.map((fieldKey, index) => {

        })


        const isSubsetResult = isSubset(extractedFields, APIResponse);
        const commonElements = findCommonElements(extractedFields, APIResponse);
        const hasCommon = haveAnyCommonElements(extractedFields, APIResponse);
        const uniqueElements = findUniqueElements(extractedFields, APIResponse);


        // console.log(isSubsetResult)
        // console.log(commonElements)
        // console.log(hasCommon)
        // console.log(uniqueElements)

        // console.log(Object.keys(APIResponse))
        // console.log(Object.keys(APIResponse).length)


        // const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
        // const pdfDoc = await PDFDocument.load(existingPdfBytes);
        // const form = pdfDoc.getForm();

        // // Fill form fields with data
        // form.getTextFields().forEach((field) => {
        //     if (field.getName()) {
        //         field.setText('Your data here');
        //     }
        // });

        // const modifiedPdfBytes = await pdfDoc.save();
        // setPdfData(new Uint8Array(modifiedPdfBytes));
    }

    function isSubset(subArray, mainArray) {
        return subArray.every(element => mainArray.includes(element));
    }

    function findCommonElements(arr1, arr2) {
        return arr1.filter(element => arr2.includes(element));
    }

    function haveAnyCommonElements(arr1, arr2) {
        return arr1.some(element => arr2.includes(element));
    }

    function findUniqueElements(arr1, arr2) {
        const uniqueToArr1 = arr1.filter(element => !arr2.includes(element));
        const uniqueToArr2 = arr2.filter(element => !arr1.includes(element));
        return { uniqueToArr1, uniqueToArr2 };
    }

    const fillPDfData = async (fieldValues) => {
        try {
            const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();
            const textFields = form.getFields().filter(field => field.constructor.name === 'PDFTextField');

            textFields.forEach((field) => {
                console.log(field.getName())
            });

            // console.log(textFields.length)

            var applicantName = form.getTextField("ApplicantName")

            applicantName.getText('')
            applicantName.setText("Test")



            console.log(applicantName)



            const pdfBytes = await pdfDoc.save();
        } catch (error) {
            console.error('Error filling PDF data:', error);
        }
    };



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

    // const handleSubmit = async () => {
    //     const inputPdfPath = 'KYC_ApplForm_fillable_final.pdf'; // Path to your local PDF file
    //     const response = await fetch(inputPdfPath);
    //     const pdfBytes = await response.arrayBuffer();

    //     const fieldData = [
    //         // { name: extractedFields[1].name, value: responseData[0].ApplicantName },
    //         // { name: "Gender", value: "Male"},
    //         // {
    //             extractedFields.filter((value,index) => {
    //                 return value.name === responseData.map((v,i) => console.log(v))
    //             })
    //         // }
    //     ];

    //     try {
    //         const filledPdfBytes = await fillPdfFields(pdfBytes, fieldData);
    //         const blob = new Blob([filledPdfBytes], { type: "application/pdf" });
    //         // saveAs(blob, "filled_form.pdf");
    //         setOutputPdf(URL.createObjectURL(blob));
    //     } catch (error) {
    //         console.error("Error filling PDF fields:", error);
    //     }
    // };

    const handleSubmit = async () => {
        const inputPdfPath = 'KYC_ApplForm_fillable_final.pdf'; // Path to your local PDF file
        
        // Fetch original data from the API
        // const responseData = await fetchOriginalData();
        
        // Fetch the PDF file
        const response = await fetch(inputPdfPath);
        const pdfBytes = await response.arrayBuffer();
    
        // Map data from API response to extracted fields
        const fieldData = extractedFields.map(field => {
            const value = responseData.find(obj => obj.hasOwnProperty(field.name));
            return {
                ...field,
                value: value ? value[field.name] : ""
            };
        });
    
        try {
            // Fill PDF fields with the mapped data
            const filledPdfBytes = await fillPdfFields(pdfBytes, fieldData);
            
            // Create a blob from filled PDF bytes
            const blob = new Blob([filledPdfBytes], { type: "application/pdf" });
            
            // Set output PDF as a URL
            setOutputPdf(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Error filling PDF fields:", error);
        }
    };
    


    return (
        <>
            <section className="multistep-form-component">
                <Header />
                <div className="multistep-form-container rounded-5">
                    <div className="container  p-0 ">
                        <div className="card border-0 rounded-5">
                            <div className="row px-3">
                                <div className="col-lg-6 multistep-left-container py-5 px-3">
                                    <div className='position-relative'>
                                        <div className='preview-container pb-3'>
                                            <p className="ms-3">
                                                Page {pageNumber} of {numPages}
                                            </p>
                                            {
                                                numPages > 1 ?
                                                    <div className="d-flex justify-content-between mx-3">
                                                        <div className='d-flex'>

                                                        </div>
                                                        <div>
                                                            <button type="button" disabled={responseData.length === 0 ? "disabled" : "" } className="btn border border-brand-color btn-primary" data-bs-toggle="modal" data-bs-target="#pdfModal" onClick={handleSubmit} >
                                                                Preview
                                                            </button>
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>

                                        <div className='multistep-form-bottom-container'>
                                            {/* {pdfData && (
                                                <Document file={{ data: pdfData }} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                                                    <Page 
                                                        pageNumber={pageNumber}
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                    />
                                                </Document>
                                            )} */}
                                            <Document file="KYC_ApplForm_fillable_final.pdf" onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                                                <Page
                                                    pageNumber={pageNumber}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                />

                                            </Document>



                                           


                                        </div>

                                        <div className='pages-container pt-3'>

                                            {
                                                numPages > 1 ?
                                                    <div className="d-flex justify-content-between mx-3">
                                                        <div className='d-flex'>
                                                            <div>
                                                                <button type='button' className={pageNumber === 1 ? 'btn btn-secondary border border-brand-color candidate-right-side-btn pe-none  me-3' : 'btn btn-transparent border border-brand-color candidate-right-side-btn me-3'} onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : pageNumber)}><GrLinkPrevious /></button>
                                                            </div>
                                                            <div >
                                                                <button type='button' className={pageNumber === numPages ? 'btn btn-secondary border border-brand-color candidate-right-side-btn pe-none ' : 'btn btn-transparent border border-brand-color candidate-right-side-btn'} onClick={() => setPageNumber(pageNumber < numPages ? pageNumber + 1 : pageNumber)}><GrLinkNext /></button>
                                                            </div>
                                                        </div>
                                                        <div>

                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                    {/* <PdfComponent /> */}




                                    {/* <!-- Modal --> */}
                                    <div className="modal fade vh-100" id="pdfModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog  modal-xl ">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="staticBackdropLabel">PDF Preview</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body pdf-iframe-container">
                                                    <iframe
                                                        title="PDF Viewer"
                                                        src={outputPdf}
                                                        width="100%"
                                                        height=""
                                                        className="h-100 "
                                                        frameBorder="0"
                                                    />
                                                </div>
                                                {/* <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary">Understood</button>
                                        </div> */}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-6 my-5  multistep-right-container position-relative start-25 ">
                                    <div className=' w-100 mt-5 px-5'>
                                        <div className="progress px-1 " style={{ height: '5px' }} >
                                            <div className="progress-bar" role="progressbar" style={{ width: "0%" }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                        <div className="step-container d-flex justify-content-between ">
                                            <div className="step-circle" onClick={() => displayStep(1)}>1</div>
                                            <div className="step-circle" onClick={() => displayStep(2)}>2</div>
                                            <div className="step-circle" onClick={() => displayStep(3)}>3</div>
                                        </div>
                                        <hr />
                                    </div>

                                    <div className='w-100 px-5'>
                                        <form id="multi-step-form ">
                                            <div className={`step step-1 ${showFieldOne === true ? "d-block mt-5" : "d-none"}`}>
                                                <h4>Document checklist</h4>
                                                <div className="mb-3">
                                                    <label htmlFor="field1" className="form-label text-grey">Please upload the following documents</label>
                                                    <div>
                                                        <div className="container-fluid mt-4 mx-auto">
                                                            <div className="row mb-2">
                                                                <div className="col-lg-6 my-3">
                                                                    <div className="card h-100 border-0 shadow rounded-3 py-3 cup" onClick={(e) => handleCardClick(e, "aadhaarCard")}>


                                                                        {/* <div className="p-3 pb-4 uploaded-resume-container d-flex ">
                                                                                <div>
                                                                                    <BsFiletypePdf className="pdf-icon text-danger me-3 fs-1 mb-2" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="resume-name mb-1">hi</p>
                                                                                
                                                                                </div>
                                                                            </div> */}



                                                                        {
                                                                            documentAadhar === null ?
                                                                                <div className="card-body d-flex align-items-center"  >
                                                                                    <p className='mb-0 mx-3'><FiUpload className='fs-3' /></p>
                                                                                    <p className='mb-0' >Aadhaard card</p>
                                                                                    <input type="file" hidden id='aadhaarCard' name='aadhaarCard' onChange={(e) => handleAadhaarCardUpload(e)} />
                                                                                </div>
                                                                                :
                                                                                <div className="card-body d-flex align-items-center"  >

                                                                                    {
                                                                                        uploading ?
                                                                                            <div class="d-flex justify-content-center">
                                                                                                <div class="spinner-border text-warning me-4" role="status">
                                                                                                    <span class="visually-hidden">Loading...</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <p className='mb-0 mx-3'><BsFiletypePdf className='fs-3 text-danger' /></p>
                                                                                    }
                                                                                    <p className='mb-0' >Aadhaar card</p>
                                                                                </div>
                                                                        }


                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6 my-3">
                                                                    <div className="card h-100 border-0 shadow rounded-3 py-3 cup " onClick={(e) => handleCardClick(e, "panCard")}>

                                                                        {
                                                                            documentPan === null ?
                                                                                <div className="card-body d-flex align-items-center"  >
                                                                                    <p className='mb-0 mx-3'><FiUpload className='fs-3' /></p>
                                                                                    <p className='mb-0'>PAN card</p>
                                                                                    <input type="file" hidden id='panCard' onChange={(e) => handlePanCardUpload(e)} />
                                                                                </div>
                                                                                :
                                                                                <div className="card-body d-flex align-items-center"  >

                                                                                    {
                                                                                        uploading ?
                                                                                            <div class="d-flex justify-content-center">
                                                                                                <div class="spinner-border text-warning me-4 " role="status">
                                                                                                    <span class="visually-hidden">Loading...</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <p className='mb-0 mx-3'><BsFiletypePdf className='fs-3 text-danger' /></p>

                                                                                    }
                                                                                    <p className='mb-0'>PAN card</p>
                                                                                </div>
                                                                        }


                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mb-3">
                                                                <div className="col-lg-6 my-3">
                                                                    {/* <div className="card h-100 border-0 shadow rounded-3 py-3 cup" onClick={(e) => handleCardClick(e,"other")}>
                                                                        <div className="card-body d-flex align-items-center">
                                                                            <p className='mb-0 mx-3'><FiUpload className='fs-3' /></p>
                                                                            <p className='mb-0'>Other</p>
                                                                            <input type="file" hidden id='other' onChange={(e) => handleCardUpload(e,"other")}/>
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                                <div className="col-lg-6 my-3">
                                                                    {/* <div className="card h-100 border-0 shadow rounded-3 py-3 cup" onClick={(e) => handleIdentityCardUpload(e)}>
                                                                        <div className="card-body d-flex align-items-center">
                                                                            <p className='mb-0 mx-3'><FiUpload className='fs-3' /></p>
                                                                            <p className='mb-0'>Identity card</p>
                                                                            <input type="file" hidden id='identityCard' />
                                                                        </div>
                                                                    </div> */}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>


                                                </div>
                                                <div className='mt-5 text-end '>
                                                    {
                                                        documentAadhar === null || documentPan === null || documentsUploaded === false ?
                                                            <button type="button" disabled={documentAadhar === null || documentPan === null || uploading === true ? "disabled" : ""} className="btn btn-success next-step w-25" onClick={(e) => handleDocumentsUpload(e)}>{uploading === true ? "Please wait" : "Upload"}</button>
                                                            :
                                                            <button type="button" className="btn btn-primary next-step w-25" onClick={() => displayStep(2)}>Next</button>
                                                    }
                                                </div>

                                            </div>



                                            <div className={`step step-2 ${showFieldTwo === true ? "d-block" : "d-none"}`}>
                                                <div>
                                                    <label htmlFor="field1" className="form-label text-grey mt-5">There are few questions that need to be answered. We will call your number ending +91-XXXXX XXX91 registered with your aadhaar card to complete your form </label>
                                                    <div>
                                                        <div className="container-fluid mt-4 mx-auto">
                                                            <div className="row mb-2">

                                                                <div className="mb-3">
                                                                    <label htmlFor="phoneNumber" className="form-label">Enter your mobile number</label>
                                                                    <input type="number" className="form-control" id="phoneNumber" name='phoneNumber' aria-describedby="phoneNumber" />
                                                                </div>

                                                                <button type="button" className="btn btn-success w-25 mx-3">Call now</button>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mt-5 text-end '>

                                                    <button type="button" className="btn btn-primary prev-step" onClick={() => displayStep(1)}>Previous</button>
                                                    <button type="button" className="btn btn-primary next-step ms-3" onClick={() => displayStep(3)}>Next</button>
                                                </div>
                                            </div>



                                            <div className={`step step-3 ${showFieldThree === true ? "d-block" : "d-none"}`}>
                                                <label htmlFor="field1" className="form-label text-grey mt-5">Please check and verify the form before download</label>
                                                <div>
                                                    <div className="container-fluid mt-4 mx-auto">
                                                        <div className="row mb-2">

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='mt-5 text-end'>

                                                    <button type="button" className="btn btn-primary prev-step" onClick={() => displayStep(2)}>Previous</button>
                                                    <button type="submit" className="btn btn-success ms-3">Submit</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Toaster />

            </section>
        </>
    )
}

export default MultistepForm
