import { Client, Account, ID, Avatars, Databases, Query, Storage } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.abhinav.Aora",
  projectId: "6629120ed3ccea8ef61e",
  databaseId: "66291b8e9bb504feef5b",
  userCollectionId: "66291bba44a01be32411",
  videoCollectionId: "66291bea3c50d798e70c",
  storageId: "66291da00edcda06ac1e",
};

const {endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId} = config;
// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};
export async function getAccount() {
    try {
      const currentAccount = await account.get();
        // console.log("appwrite.js > getAccount() -->",currentAccount)
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
    //   console.log("appwrite.js > getCurrentUser() > currentAccount -->",currentAccount)
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      )

      // console.log("appwrite.js > getCurrentUser() > currentUser -->",currentUser)
  
      if (!currentUser){ 
        console.log("appwrite.js > currentUser is not available")
        throw Error;
    }
    //   console.log("getCurrentUser() -->",currentUser.documents[0]);
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  export const getAllPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc('$createdAt')]
      )

      return posts.documents;
    } catch (error) {
      console.log("lib > appwrite.js > getAllPosts");
      throw new Error(error)
    }
  }

  export const getLatestPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc('$createdAt', Query.limit(7))]
      )

      return posts.documents;
    } catch (error) {
      console.log("lib > appwrite.js > getAllPosts");
      throw new Error(error)
    }
  }

  export const searchPosts = async (query) => {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.search('title', query)]
      )

      return posts.documents;
    } catch (error) {
      console.log("lib > appwrite.js > searchPosts");
      throw new Error(error)
    }
  }

  export const getUserPosts = async (userId) => {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.equal('creator', userId)]
      )

      return posts.documents;
    } catch (error) {
      console.log("lib > appwrite.js > searchPosts");
      throw new Error(error)
    }
  }

  export const signOut = async () =>{
    try {
      const session = await account.deleteSession('current');
      return session;
    } catch (error) {
      console.log("appwrite > signOut");
      throw new Error(error);
    }
  }

  export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
      if(type === 'video'){
        fileUrl =  storage.getFileView(storageId, fileId);
      }
      else if(type === 'image'){
        fileUrl =  storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
      }
      else{
        throw new Error('Invalid file type')
      }

      if(!fileUrl) throw Error;

      return fileUrl;

    } catch (error) {
      console.log("appwrite.js > getFilePreview ",error);
    }
  }

  export const uplaodFile = async (file, type) => {
    if(!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

  //   const asset = {
  //     name: file.fileName,
  //     type: file.mimeType,
  //     size: file.fileSize,
  //     uri: file.uri
  // };

    try {
      const uploadedFile = await storage.createFile(
        storageId,
        ID.unique(),
        asset
      );

      if (!uploadedFile || !uploadedFile.$id) {
        throw new Error('Invalid response from storage.createFile');
    }
      const fileUrl = await getFilePreview(uploadedFile.$id, type);

      return fileUrl;
    } catch (error) {
      console.log("appwrite.js > uploadFile", error);
      throw new Error(error);
    }

  }

  export const createVideo = async (form)=> {
    try {
      //first uploading the video and thumnail(image) to the appwrite storage (not database, in database we will be uploading the url of the image and video), after that along with other fields like title, prompt, we will be uplading the whole set to the database
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uplaodFile(form.thumbnail, 'image'),
        uplaodFile(form.video, 'video'),
      ])

      const newPost = await databases.createDocument(
        databaseId, videoCollectionId, ID.unique(), {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      )

      return newPost;
    } catch (error) {
      console.log("appwrite > createVideo", error);
      throw new Error(error);
    }
  }