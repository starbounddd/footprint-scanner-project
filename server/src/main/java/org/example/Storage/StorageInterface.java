package org.example.Storage;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface StorageInterface {

  void addDocument(String collection_id, String doc_id, Map<String, Object> data)
      throws ExecutionException, InterruptedException;

  void addCollection(String collection_id, String doc_id, Map<String, Object> data);

  List<Map<String, Object>> getCollection(String collection_id)
      throws InterruptedException, ExecutionException;

  void clearUser(String uid) throws InterruptedException, ExecutionException;

  boolean isUserCollection(String uid) throws InterruptedException, ExecutionException;
}
