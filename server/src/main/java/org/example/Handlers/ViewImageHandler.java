package org.example.Handlers;

import com.squareup.moshi.Moshi;
import org.example.ImageFile;
import spark.Request;
import spark.Response;
import spark.Route;

public class ViewImageHandler implements Route {

  private ImageFile imageFile;

  public ViewImageHandler(ImageFile imageFile) {
    this.imageFile = imageFile;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    response.header("Access-Control-Allow-Origin", "*");
    if (!this.imageFile.isPathValid()) {
      response.status(400);
      return "{\"error\": \"Image file not loaded. Please load the image first using /loadimage\"}";
    }
    try {
      byte[] imageData = this.imageFile.getImageData(); // You need to implement this in ImageFile
      response.raw().setContentType("image/jpeg"); // or "image/jpeg" depending on your file
      response.raw().getOutputStream().write(imageData);
      response.raw().getOutputStream().flush();
    } catch (Exception e) {
      e.printStackTrace();
      return new ViewImageHandler.ImageFailureResponse("error_datasource").serialize();
    }
    System.out.println(response.raw());
    return response.raw();

  }

  public record ImageFailureResponse(String response_type) {

    private static String failureResponse;

    public ImageFailureResponse() {
      this(failureResponse);
    }

    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      return moshi.adapter(ViewImageHandler.ImageFailureResponse.class).toJson(this);
    }
  }


}
