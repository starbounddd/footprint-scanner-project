package org.example.Handlers;

import com.machinezoo.sourceafis.FingerprintImage;
import com.machinezoo.sourceafis.FingerprintImageOptions;
import com.machinezoo.sourceafis.FingerprintMatcher;
import com.machinezoo.sourceafis.FingerprintTemplate;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import org.example.ImageFile;
import spark.Request;
import spark.Response;
import spark.Route;

public class RunScannerHandler implements Route {

  private ImageFile imageFile;
  private ImageFile candidateImage;

  public RunScannerHandler(ImageFile imageFile, ImageFile candidateImage) {
    this.imageFile = imageFile;
    this.candidateImage = candidateImage;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    /*
    It is recommended to specify image DPI via dpi(double), because SourceAFIS is not scale-invariant.
    You can find image DPI in sensor documentation.
     500dpi is the most common resolution. SourceAFIS ignores any DPI stored in images themselves.
     */
    try {
      
      Path filePath1 = Paths.get(this.imageFile.getFilePath());
      Path filePath2 = Paths.get(this.candidateImage.getFilePath());
      var probe = new FingerprintTemplate(
          new FingerprintImage(
              Files.readAllBytes(filePath1),
              new FingerprintImageOptions()
                  .dpi(500)));

      var candidate = new FingerprintTemplate(
          new FingerprintImage(
              Files.readAllBytes(filePath2),
              new FingerprintImageOptions()
                  .dpi(500)));

      //must crop to underneath big toe

      double score = new FingerprintMatcher(probe)
          .match(candidate);

      boolean matches = score >= 40;

      HashMap<String, Object> responseMap = new HashMap<>();
      if (matches) {
        responseMap.put("success",
            "Match Found! With a score of " + score + ", the two footprints are similar");
      } else {
        responseMap.put("success",
            "Match Not Found.  With a score of " + score + ", the two footprints are not similar");
      }
      return new ScannerSuccessResponse(responseMap).serialize();

    } catch (Exception e) {
      e.printStackTrace();
      return new ScannerFailureResponse("error_scanning").serialize();
    }

  }

  public record ScannerSuccessResponse(String response_type, Map<String, Object> responseMap) {

    public ScannerSuccessResponse(Map<String, Object> responseMap) {
      this("success", responseMap);
    }

    String serialize() {
      try {
        Moshi moshi = new Moshi.Builder().build();
        JsonAdapter<ScannerSuccessResponse> adapter = moshi.adapter(
            ScannerSuccessResponse.class);
        return adapter.toJson(this);
      } catch (Exception e) {
        e.printStackTrace();
        throw e;
      }
    }
  }

  public record ScannerFailureResponse(String response_type) {

    private static String failureResponse;

    public ScannerFailureResponse() {
      this(failureResponse);
    }

    String serialize() {
      Moshi moshi = new Moshi.Builder().build();
      return moshi.adapter(ScannerFailureResponse.class).toJson(this);
    }
  }
}
