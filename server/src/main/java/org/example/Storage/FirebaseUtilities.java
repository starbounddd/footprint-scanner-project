package org.example.Storage;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.cloud.storage.Blob;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class FirebaseUtilities implements StorageInterface {

  public FirebaseUtilities() throws IOException {
    // Create /resources/ folder with firebase_config.json.json and
    // add your admin SDK from Firebase. see:
    // https://docs.google.com/document/d/10HuDtBWjkUoCaVj_A53IFm5torB_ws06fW3KYFZqKjc/edit?usp=sharing
    String workingDirectory = System.getProperty("user.dir");
    Path firebaseConfigPath =
        Paths.get(workingDirectory, "src", "main", "resources",
            "firebase_config.json");
    //C:\Users\ppeck\Downloads\Projects\footprint-scanner-project\server\src\main\resources\firebase_config.json
    // ^-- if your /resources/firebase_config.json.json exists but is not found,
    // try printing workingDirectory and messing around with this path.
    System.out.println(workingDirectory);
    FileInputStream serviceAccount = new FileInputStream(firebaseConfigPath.toString());

    FirebaseOptions options =
        new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .build();

//    FirebaseOptions options =
//        new FirebaseOptions.Builder()
//            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//            .setStorageBucket("footprint-img-storage.firebasestorage.app") // <-- Add this line
//            .build();

    FirebaseApp.initializeApp(options);
  }

  @Override
  public String uploadImageToStorage(InputStream inputStream, String fileName, String contentType)
      throws IOException {
    String path = "images/" + fileName;

    Blob blob = StorageClient.getInstance().bucket().create(
        path,
        inputStream,
        contentType
    );

    return String.format("https://storage.googleapis.com/%s/%s", blob.getBucket(), blob.getName());
  }

  @Override
  public List<Map<String, Object>> getCollection(String collection_id)
      throws InterruptedException, ExecutionException, IllegalArgumentException {
    if (collection_id == null) {
      throw new IllegalArgumentException("getCollection: uid and/or collection_id cannot be null");
    }

    // gets all documents in the collection 'collection_id' for user 'uid'

    Firestore db = FirestoreClient.getFirestore();
    // 1: Make the data payload to add to your collection
    CollectionReference dataRef = db.collection("users").document("Host").collection(collection_id);

    // 2: Get pin documents
    QuerySnapshot dataQuery = dataRef.get().get();

    // 3: Get data from document queries
    List<Map<String, Object>> data = new ArrayList<>();
    for (QueryDocumentSnapshot doc : dataQuery.getDocuments()) {
      data.add(doc.getData());
    }

    return data;
  }

  @Override
  public void addDocument(String collection_id, String doc_id, Map<String, Object> data)
      throws IllegalArgumentException, ExecutionException, InterruptedException {
    if (collection_id == null || doc_id == null || data == null) {
      throw new IllegalArgumentException(
          "addDocument: uid, collection_id, doc_id, or data cannot be null");
    }
    // adds a new document 'doc_name' to colleciton 'collection_id' for user 'uid'
    // with data payload 'data'.

    // use the guide below to implement this handler
    // - https://firebase.google.com/docs/firestore/quickstart#add_data

    Firestore db = FirestoreClient.getFirestore();
    // 1: Get a ref to the collection that you created
    DocumentReference docRef =
        db.collection("users").document("Host").collection(collection_id).document(doc_id);
    // 2: Write data to the collection ref
    ApiFuture<WriteResult> writeResult = docRef.set(data);

    System.out.println(writeResult.get().getUpdateTime());
  }

  /**
   * @param collection_id
   * @param data
   */
  @Override
  public void addCollection(String collection_id, String doc_id, Map<String, Object> data) {
    try {
      Firestore db = FirestoreClient.getFirestore();
      CollectionReference collectionRef =
          db.collection("users").document("Host").collection(collection_id);

      DocumentReference docRef = collectionRef.document(doc_id);
      docRef.set(data);
      //      userRef.collection(collection_id).document(doc_id).set(data);

    } catch (Exception e) {
      System.out.println("Error while adding collection: " + e.getMessage());
    }
  }

  // clears the collections inside of a specific user.
  @Override
  public void clearUser(String uid) throws IllegalArgumentException {
    if (uid == null) {
      throw new IllegalArgumentException("removeUser: uid cannot be null");
    }
    try {
      // removes all data for user 'uid'
      Firestore db = FirestoreClient.getFirestore();
      // 1: Get a ref to the user document
      DocumentReference userDoc = db.collection("users").document(uid);
      // 2: Delete the user document
      deleteDocument(userDoc);
    } catch (Exception e) {
      System.err.println("Error removing user : " + uid);
      System.err.println(e.getMessage());
    }
  }

  @Override
  public boolean isUserCollection(String uid) throws InterruptedException, ExecutionException {
    if (uid == null) {
      throw new IllegalArgumentException("isUserCollection: uid cannot be null");
    }
    try {
      List<Map<String, Object>> surveyDocs = getCollection("survey");

      if (surveyDocs.isEmpty()) {
        return false;
      } else {
        return true;
      }
    } catch (Exception e) {
      System.out.println("isUserCollection caught an exception");
    }
    return false;
  }

  private void deleteDocument(DocumentReference doc) {
    // for each subcollection, run deleteCollection()
    Iterable<CollectionReference> collections = doc.listCollections();
    for (CollectionReference collection : collections) {
      deleteCollection(collection);
    }
    // then delete the document
    doc.delete();
  }

  // recursively removes all the documents and collections inside a collection
  // https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
  private void deleteCollection(CollectionReference collection) {
    try {

      // get all documents in the collection
      ApiFuture<QuerySnapshot> future = collection.get();
      List<QueryDocumentSnapshot> documents = future.get().getDocuments();

      // delete each document
      for (QueryDocumentSnapshot doc : documents) {
        doc.getReference().delete();
      }

      // NOTE: the query to documents may be arbitrarily large. A more robust
      // solution would involve batching the collection.get() call.
    } catch (Exception e) {
      System.err.println("Error deleting collection : " + e.getMessage());
    }
  }
}
