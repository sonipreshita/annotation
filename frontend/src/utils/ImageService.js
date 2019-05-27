
const extensionType = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG'];

export function checkImageTypeAndSize(imageData) {
    let response;
    let [file] = imageData;
    let fileName = file.name;
    let getExt = fileName.split('.').pop();

    if (extensionType.includes(getExt)) {
        response = { success: true }
    } else {
        response = { success: false, message: 'Invalid image type.' }
    }

    return response;
}
