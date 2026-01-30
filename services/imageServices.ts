import { CLOUDINARY_CLOUDE_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/constants";
import { ResponseProps } from "@/types";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDE_NAME}/image/upload`


export const uploadFileToCloudinary = async (
    file: any,
    folderName: string
): Promise<ResponseProps> => {
    try {
        if (!file) return { success: true, data: null };

        // already uploaded file url
        if (typeof file === "string")
            return { success: true, data: file };

        if (file && file.uri) {
            return new Promise((resolve) => {
                const formData = new FormData();
                
                // File data
                const fileData: any = {
                    uri: file.uri,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                };

                formData.append('file', fileData);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                formData.append('folder', folderName);

                console.log('Upload details:', {
                    cloudName: CLOUDINARY_CLOUDE_NAME,
                    preset: CLOUDINARY_UPLOAD_PRESET,
                    folder: folderName,
                    fileUri: file.uri,
                });

                fetch(CLOUDINARY_API_URL, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(response => {
                    console.log('Response status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data);
                    if (data.secure_url) {
                        resolve({ success: true, data: data.secure_url });
                    } else if (data.error) {
                        resolve({ success: false, msg: data.error.message });
                    } else {
                        resolve({ success: false, msg: 'Upload failed' });
                    }
                })
                .catch(error => {
                    console.log('Fetch error:', error);
                    resolve({ success: false, msg: error.message || 'Network error' });
                });
            });
        }

        return { success: true, data: null }
    } catch (error: any) {
        console.log("got error uploading file: ", error);
        return { 
            success: false, 
            msg: error.message || "Could not upload file" 
        };
    }
};


export const getAvatarPath = (file: any, isGroup: boolean = false) => {
    if (file && typeof file == "string") return file;

    if (file && typeof file == "object" && file.uri) return file.uri;

    if (isGroup) return require('../assets/images/default_group_avatar.png');

    return require("../assets/images/defaultAvatar.png")
}