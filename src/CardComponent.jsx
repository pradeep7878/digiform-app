import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import extractedFields from './extractedJson.js'

const CardComponent = () => {




    const [filePath, setFilePath] = useState('test.txt');
    const [fileContent, setFileContent] = useState('');





    const getFile = async () => {
        try {
            const response = await axios.get(`test.txt`, {
                params: { path: filePath },
                responseType: 'blob', // or 'arraybuffer' if you need to process binary data
            });

            console.log(response)


            postTextFile(response.data)

            console.log(response.config.url)

            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target.result);
            };
            reader.readAsText(response.data); // Adjust according to the file type
        } catch (error) {
            console.error('Error fetching the file:', error);
        }
    };

    console.log(extractedFields)


    const postTextFile = async (response) => {
        console.log(extractedFields)
        const params = {
            file: JSON.stringify(extractedFields),
            filename: "KYC_ApplForm_p.pdf"
        }
        try {

            const result = await axios.post('https://digiform.adraproductstudio.com/select_file', params, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            console.log(result)

        } catch (err) {
            console.log(err)
        }
    }


    console.log(extractedFields)

    const cardsArray = [
        {
            id: 1,
            imgSrc: "https://img.yumpu.com/44915880/1/500x640/please-affix-your-recent-passport-size-photo-application-form-.jpg",
            title: "KYC Form",
            button: "Use",
        },
        // {
        //     id: 2,
        //     imgSrc: "https://img.yumpu.com/44915880/1/500x640/please-affix-your-recent-passport-size-photo-application-form-.jpg",
        //     title: "Loan app",
        //     button: "Use",
        // },
        // {
        //     id: 3,
        //     imgSrc: "https://img.yumpu.com/44915880/1/500x640/please-affix-your-recent-passport-size-photo-application-form-.jpg",
        //     title: "Loan app",
        //     button: "Use",
        // },
        // {
        //     id: 4,
        //     imgSrc: "https://img.yumpu.com/44915880/1/500x640/please-affix-your-recent-passport-size-photo-application-form-.jpg",
        //     title: "Loan app",
        //     button: "Use",
        // },

    ]

    return (
        <>
            <div className="card-component">
                <div className="container my-5 px-5">
                    <div className="row row-cols-lg-4 row-cols-md-3  gap-5">
                        {
                            cardsArray.map((card) => {
                                return (
                                    <React.Fragment key={card.id}>
                                        <div className="card py-2 border-0 rounded-4" style={{ width: "18rem" }}>
                                            <img src={card.imgSrc} className="card-img-top" alt="..." height="300" />
                                            <div className="card-body px-0 py-0">
                                                <h6 className="card-title mb-4 mx-3"  >{card.title}</h6>
                                                <Link to="/multistep-form">
                                                    <div className="px-3">

                                                        <button className="btn brand-color w-100 mb-3" onClick={getFile}>{card.button}</button>
                                                    </div>
                                                    <pre>{fileContent}</pre>

                                                </Link>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default CardComponent
