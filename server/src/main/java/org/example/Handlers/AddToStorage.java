package org.example.Handlers;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.InputStream;
import java.sql.Blob;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;
import org.example.ImageFile;
import org.example.Storage.StorageInterface;
import org.example.Storage.Utils;
import spark.Request;
import spark.Response;
import spark.Route;

public class AddToStorage implements Route {

  private StorageInterface storage;
  private ImageFile imageFile;

  public AddToStorage(StorageInterface storage) {
    this.storage = storage;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    HashMap<String, Object> responseMap = new HashMap<>();
    try {
      response.type("application/json");
      request.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("/tmp"));
      Part filePart = request.raw().getPart("file");
      String fileName = request.raw().getPart("file").getSubmittedFileName();
      InputStream fileContent = filePart.getInputStream();
      String contentType = filePart.getContentType();
      String timeStamp = request.queryParams("timeStamp");

//      String fileName = request.queryParams("imageName") + "_" + System.currentTimeMillis();

//      String publicUrl = this.storage.uploadImageToStorage(fileContent, fileName, contentType);

      Map<String, Object> metadata = new HashMap<>();
      metadata.put("fileName", fileName);
//      metadata.put("imageUrl", publicUrl);
      metadata.put("timestamp", System.currentTimeMillis());

//      this.storage.addDocument("imageData", fileName, metadata);

      responseMap.put("status", "success");
//      responseMap.put("url", publicUrl);

      JsonObject obj = new JsonObject();
      obj.addProperty("fileName", fileName);

      obj.addProperty("timeStamp", timeStamp);

      String id = "id" + this.storage.getCollection("imageData").size() + 1;
      this.storage.addDocument("imageData", id, responseMap);

      responseMap.put("status", "success");
      responseMap.put("response", obj);
      System.out.println(imageFile);

    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("status", "error");
      responseMap.put("response", e.getMessage());

    }

    return Utils.toMoshiJson(responseMap);
  }
}

