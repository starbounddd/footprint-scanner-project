package org.example;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ImageFile {

  private File imageFile;

  public ImageFile(){
    this.imageFile = null;
  }

  public ImageFile(String imageName) {
    this.imageFile = new File(imageName);
  }

  /**
   * Method to retrieve file path of the loaded file
   *
   * @return file path
   */
  public String getFilePath() {
    return this.imageFile.getPath();
  }

  public String getFileName(){
    return this.imageFile.getName();
  }

  /**
   * Method to change the loaded file
   *
   * @param fileName new file to change to
   */
  public void setFile(String fileName) {
    this.imageFile = new File(fileName);
  }

  /**
   * Check if the loaded file exists
   *
   * @return boolean representing if the file is valid
   */
  public boolean isPathValid() {
    return this.imageFile != null && this.imageFile.exists();
  }

  public byte[] getImageData() throws IOException {
    return Files.readAllBytes(Paths.get(this.getFilePath()));
  }


}
