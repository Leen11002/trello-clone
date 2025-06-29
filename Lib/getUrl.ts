import {storage } from '@/appwrite';
const getUrl=  (image : Image)=>{
    const url =  storage.getFileView(image.bucketId , image.fileId);
    return url;
};

export default getUrl;