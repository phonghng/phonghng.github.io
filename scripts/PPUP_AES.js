const PUBLIC_KEY = "04446f4cfc197c1601218f97d5bbce1f7212dceff3126a6cdd0681afdfcc306a58b5267f23e058e8497a0bb9271d9df80455de933d8158e90622077e1f76118936";
const ENCRYPTED_PRIVATE_KEY = "U2FsdGVkX19Ws6BF+5wekTxT5tsjwnPhkdjcR9kBNOW2iu+YZijt5fkTmkgC45joLX7EVnweLvsofsoTsub+ACmfct0ihKbzBTiTQQyDKdvHI1QERdoMiMiP9CxmHAuH";

let file_uploader = document.querySelector("#file_uploader");
let password_input = document.querySelector("#password");
let sign_submit = document.querySelector("#sign_submit");
let verify_submit = document.querySelector("#verify_submit");
let result_span = document.querySelector("#result");

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

const generate_key_pair = password => {
    let key_pair = new KJUR.crypto.ECDSA({ curve: "secp256r1" }).generateKeyPairHex();
    return {
        private_key: key_pair.ecprvhex,
        encrypted_private_key: CryptoJS.AES.encrypt(key_pair.ecprvhex, password).toString(),
        public_key: key_pair.ecpubhex,
        encrypted_public_key: CryptoJS.AES.encrypt(key_pair.ecpubhex, password).toString(),
    };
};

const download_pdf_bytes = (pdf_bytes, file_name) => {
    let pdf_result_url = URL.createObjectURL(new Blob([pdf_bytes], { type: 'application/pdf' }));
    let anchor_element = document.createElement("a");
    anchor_element.href = pdf_result_url;
    anchor_element.download = file_name;
    document.body.appendChild(anchor_element);
    anchor_element.click();
    document.body.removeChild(anchor_element);
    URL.revokeObjectURL(pdf_result_url);
};

const show_result = (text, color_name) => {
    result_span.innerText = text;
    result_span.style.backgroundColor = `var(--${color_name})`;
};

async function sign_PDF(file_input, private_key) {
    let pdf_document = await PDFLib.PDFDocument.load(
        await file_input.files[0].arrayBuffer(),
        { updateMetadata: false }
    );
    pdf_document.setSubject("");
    let signature = new KJUR.crypto.Signature({ alg: "SHA512withECDSA" });
    signature.init({ d: private_key, curve: "secp256r1" });
    signature.updateHex(await get_PDF_hash(await pdf_document.save()));
    pdf_document.setSubject("PPUP-AES:1:" + signature.sign());
    return await pdf_document.save();
}

async function verify_PDF(file_input, public_key) {
    let pdf_document = await PDFLib.PDFDocument.load(
        await file_input.files[0].arrayBuffer(),
        { updateMetadata: false }
    );
    let metadata = pdf_document.getSubject();
    if (!metadata || metadata.length === 0)
        return false;
    let retrieved_signature_hex = metadata.replace("PPUP-AES:1:", "");
    pdf_document.setSubject("");
    let signature = new KJUR.crypto.Signature({ alg: "SHA512withECDSA", prov: "cryptojs/jsrsa" });
    signature.init({ xy: public_key, curve: "secp256r1" });
    signature.updateHex(await get_PDF_hash(await pdf_document.save()));
    return signature.verify(retrieved_signature_hex);
}

document.querySelector("#sign_submit").addEventListener("click", async () => {
    if (file_uploader.files.length == 0)
        return show_result("Vui lòng tải lên tệp PDF!", "CHERRY");
    if (!password_input.value)
        return show_result("Vui lòng nhập mật khẩu!", "CHERRY");
    let private_key;
    try {
        private_key = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(ENCRYPTED_PRIVATE_KEY, password_input.value));
    } catch (error) {
        console.log(error);
        return show_result("Vui lòng kiểm tra lại mật khẩu!", "CHERRY");
    }
    password_input.value = "";
    show_result("Đang kí...", "LEMON");
    let download_filename;
    try {
        download_filename = file_uploader.files[0].name.split(".");
        download_filename[download_filename.length - 2] += " (signed by PPUP-AES)";
        download_filename = download_filename.join(".")
        download_pdf_bytes(await sign_PDF(file_uploader, private_key), download_filename);
        return show_result("Kí thành công, vui lòng kiểm tra tệp đang được tải về!", "LIME");
    } catch (error) {
        console.log(error);
        return show_result("Kí không thành công!", "CHERRY");
    }
});


document.querySelector("#verify_submit").addEventListener("click", async () => {
    if (file_uploader.files.length == 0)
        return show_result("Vui lòng tải lên tệp PDF!", "CHERRY");
    password_input.value = "";
    show_result("Đang xác thực...", "LEMON");
    try {
        if (await verify_PDF(file_uploader, PUBLIC_KEY))
            return show_result("Tệp được kí chuẩn!", "LIME");
        else
            return show_result("Tệp chưa được kí hoặc không được kí chuẩn!", "TOMATO");
    } catch (error) {
        console.log(error);
        return show_result("Xác thực không thành công!", "CHERRY");
    }
});