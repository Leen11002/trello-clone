 import {ID , storage } from '@/appwrite';

 const uploadImage= async(file : File)=>{
    if(!file) return;
    const fileUploaded= await storage.createFile(
        "67b88c690004606034ef",
        ID.unique(),
        file,
    )
    return fileUploaded;
 }
 export default uploadImage