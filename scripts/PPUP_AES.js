const ENCRYPTED_PUBLIC_KEY = "U2FsdGVkX1/K+QOZ63UW/77t9hUFdp4hFc43W+IglaQHFIfM6A+2d/fzRt4SUuTQsK1F7ReYsKHTDlEsOj+AnQiYfRqG8n3sQo4YKEM89pXnrI+phhzfLAZpUMa4tDllS2nBtl27h1IikRHwuDmXgEJoC3XmEb+bXsEaMgO0xZJ02PxCWmfZHPLhCDazJT9Q/v4O8ClPCTBShQjjmf44mA==";
const ENCRYPTED_PRIVATE_KEY = "U2FsdGVkX1/VktgahU4JOnRsAtu0yhT9lxov1zdCJ+yGXHsrcgfloa5dovhXzJtXIktVFG8vcoeoAujj90w3VFw1VSYV8AR2N3VaqSstvfDY8PucULmhFhi0UHNZ4T22";

const get_PDF_hash = async array_buffer => {
    const hash = new KJUR.crypto.MessageDigest({ alg: "sha512", prov: "cryptojs" });
    hash.updateHex(
        Array.prototype.map.call(
            new Uint8Array(array_buffer),
            x => ('00' + x.toString(16)).slice(-2)
        ).join("")
    );
    return hash.digest();
};

const generate_key_pair = () => {
    let key_pair = new KJUR.crypto.ECDSA({ curve: "secp256r1" }).generateKeyPairHex();
    return { private: key_pair.ecprvhex, public: key_pair.ecpubhex };
};

const download_pdf_bytes = pdf_bytes => {
    let pdf_result_url = URL.createObjectURL(new Blob([pdf_bytes], { type: 'application/pdf' }));
    let anchor_element = document.createElement("a");
    anchor_element.href = pdf_result_url;
    anchor_element.download = "PPUP-AES.pdf";
    document.body.appendChild(anchor_element);
    anchor_element.click();
    document.body.removeChild(anchor_element);
    URL.revokeObjectURL(pdf_result_url);
};

async function sign_PDF(file_input, private_key, public_key) {
    let pdf_document = await PDFLib.PDFDocument.load(await file_input.files[0].arrayBuffer());
    let signature = new KJUR.crypto.Signature({ alg: "SHA512withECDSA" });
    signature.init({ d: private_key, curve: "secp256r1" });
    signature.updateHex(await get_PDF_hash(pdf_document));
    pdf_document.setKeywords(["PPUP-AES:" + signature.sign()]);
    return await pdf_document.save();
}

async function verify_PDF(file_input, private_key, public_key) {
    let pdf_document = await PDFLib.PDFDocument.load(await file_input.files[0].arrayBuffer());
    let metadata = pdfDoc.getKeywords();
    if (!metadata || metadata.length === 0)
        return false;
    let retrieved_signature_hex = metadata.replace("PPUP-AES:", "");
    pdf_document.setKeywords([]);
    let signature = new KJUR.crypto.Signature({ alg: "SHA512withECDSA", prov: "cryptojs/jsrsa" });
    signature.init({ xy: public_key, curve: "secp256r1" });
    signature.updateHex(await get_PDF_hash(pdf_document));
    return signature.verify(retrieved_signature_hex);
}

var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

// download_pdf_bytes(sign_PDF(...))

document.getElementById('signPdf').addEventListener('click', () => sign_PDF(document.getElementById('upload')));

//document.getElementById('verifyPdf').addEventListener('click', async () => );