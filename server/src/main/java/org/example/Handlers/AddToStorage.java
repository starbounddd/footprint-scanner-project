package org.example.Handlers;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.HashMap;
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
      JsonObject reqBody = JsonParser.parseString(request.body()).getAsJsonObject();
      String fileName = reqBody.get("imageOneName").getAsString();
      String image = reqBody.get("formData").getAsString();
      String timeStamp = reqBody.get("timeStamp").getAsString();

      JsonObject obj = new JsonObject();
      obj.addProperty("fileName", fileName);
      obj.addProperty("image", image);
      obj.addProperty("timeStamp", timeStamp);

      String id = "id" + this.storage.getCollection("imageData").size() + 1;
      this.storage.addDocument("imageData", id, responseMap);

      responseMap.put("status", "success");
      responseMap.put("response", obj);

    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("status", "error");
      responseMap.put("response", e.getMessage());

    }

    return Utils.toMoshiJson(responseMap);
  }
}

