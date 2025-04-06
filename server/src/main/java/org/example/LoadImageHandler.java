package org.example;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class LoadImageHandler implements Route {

  private ImageFile imageFile1;
  private ImageFile candidateImage;


  public LoadImageHandler(ImageFile imageFile1, ImageFile candidateImage) {
    this.imageFile1 = imageFile1;
    this.candidateImage = candidateImage;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    try {
      //get path of the file being passed in(must be a jpeg or .png
      String imagePath = request.queryParams("imagePath1");
      String candidatePath = request.queryParams("imagePath2");

      if (!imagePath.contains(".jpeg") || !candidatePath.contains(".jpeg")) {
        response.status(400);
        return "{\"error\": \"Image file not loaded. Please enter a file that is a .jpeg\"}";
      }

      this.imageFile1.setFile(imagePath);
      this.candidateImage.setFile(candidatePath);

      HashMap<String, Object> responseMap = new HashMap<String, Object>();
      if (!this.imageFile1.isPathValid() || imagePath.isEmpty()) {
        responseMap.put("result", "error");
        responseMap.put("File Not Found", this.imageFile1.getFilePath());
      }
      if (!this.candidateImage.isPathValid() || candidatePath.isEmpty()) {
        responseMap.put("result", "error");
        responseMap.put("File Not Found", this.candidateImage.getFilePath());
      } else {
        responseMap.put("Loaded Image 1", this.imageFile1.getFilePath());
        responseMap.put("Loaded Image 2", this.candidateImage.getFilePath());
      }
      return new ImageSuccessResponse(responseMap).serialize();
    } catch (Exception e) {
      return new ImageFailureResponse("error_datasource").serialize();
    }
  }

  public record ImageSuccessResponse(String response_type, Map<String, Object> responseMap) {

    public ImageSuccessResponse(Map<String, Object> responseMap) {
      this("success", responseMap);
    }

    String serialize() {
      try {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<ImageSuccessResponse> adapter = moshi.adapter(ImageSuccessResponse.class);
        return adapter.toJson(this);
      } catch (Exception e) {
        e.printStackTrace();
        throw e;
      }
    }
  }

  public record ImageFailureResponse(String response_type) {

    private static String failureResponse;

    public ImageFailureResponse() {
      this(failureResponse);
    }

    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      return moshi.adapter(ImageFailureResponse.class).toJson(this);
    }
  }
}
