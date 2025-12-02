// src/utils/pinata.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const API_SECRET = import.meta.env.VITE_PINATA_SECRET_KEY;

export const uploadFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
    });
    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);

    try {
        const res = await axios.post(url, data, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: API_KEY,
                pinata_secret_api_key: API_SECRET,
            }
        });
        // Trả về URL của ảnh
        return "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const uploadJSONToIPFS = async (jsonBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    try {
        const res = await axios.post(url, jsonBody, {
            headers: {
                pinata_api_key: API_KEY,
                pinata_secret_api_key: API_SECRET,
            }
        });
        // Trả về URL của Metadata (dùng link này để Mint)
        return "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash;
    } catch (error) {
        console.log(error);
        return null;
    }
};