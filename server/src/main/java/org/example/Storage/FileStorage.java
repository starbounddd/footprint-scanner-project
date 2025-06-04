package org.example.Storage;

import java.io.File;
import java.util.HashMap;
import java.util.List;

public class FileStorage {

  /**
   * This is the FileStorage class which represents the storage of the file data. This class holds
   * the hashmap that maps file name to its parsed data and the filepath of the loaded csv
   */
  private static FileStorage instance = null; // singleton pattern in use!!

  private String filePath;
  private final HashMap<String, List<List<String>>> fileMap = new HashMap<>();

  /**
   * This is the constructor for the FileStorage class which initializes the filepath to null
   */
  private FileStorage() {
    this.filePath = null;
  }

  /**
   * This is the getInstance method which returns the instance of the FileStorage class. If the
   * instance is null, a new instance is created.
   *
   * @return the instance of the FileStorage class
   */
  public static synchronized FileStorage getInstance() {
    if (instance == null) {
      instance = new FileStorage();
    }
    return instance;
  }

  /**
   * This is the getFilePath method which returns the filepath of the loaded csv
   *
   * @return the filepath of the loaded csv
   */
  public synchronized String getFilePath() {
    return filePath;
  }

  /**
   * This is the setFilePath method which sets the filepath of the loaded csv
   *
   * @param filePath is the filepath of the loaded csv
   */
  public synchronized void setFilePath(String filePath) {
    this.filePath = filePath;
  }

  /**
   * This is the doesFileExist method which checks if the file exists
   *
   * @return true if the file exists, false otherwise
   */
  public synchronized boolean doesFileExist() {
    File file = new File(filePath);
    boolean exists = file.exists();

    if (!exists) { // in place to avoid storing an improper file path in this class
      this.filePath = null;
      return false;
    }
    return true;
  }

  /**
   * This is the addFile method which adds the file data to the hashmap
   *
   * @param filePath is the filepath of the file
   * @param fileData is the data of the file
   */
  public synchronized void addFile(String filePath, List<List<String>> fileData) {
    fileMap.put(filePath, fileData);
  }

  /**
   * This is the checkFile method which checks if the file exists in the hashmap
   *
   * @param filePath is the filepath of the file
   * @return true if the file exists in the hashmap, false otherwise
   */
  public synchronized boolean checkFile(String filePath) {
    return this.fileMap.containsKey(filePath);
  }

  /**
   * This is the getFile method which returns the file data
   *
   * @param filePath is the filepath of the file
   * @return the file data
   */
  public synchronized List<List<String>> getFile(String filePath) {
    return fileMap.get(filePath);
  }

  /**
   * This is the isFileLoaded method which checks if the file is loaded
   *
   * @return true if the file is loaded, false otherwise
   */
  public boolean isFileLoaded() {
    return this.filePath != null;
  }

  /**
   * This method clears the hashmap and sets the filepath to an empty string
   */
  public void clear() {
    this.fileMap.clear();
    this.filePath = "";
  }
}
