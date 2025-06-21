package org.example;

import static spark.Spark.after;
import static spark.Spark.before;
import static spark.Spark.options;
import static spark.Spark.get;

import java.io.IOException;
import org.example.Handlers.AddToStorage;
import org.example.Handlers.LoadImageHandler;
import org.example.Handlers.NImageScanHandler;
import org.example.Handlers.RunScannerHandler;
import org.example.Handlers.ViewImageHandler;
import org.example.Storage.FirebaseUtilities;
import org.example.Storage.StorageInterface;
import spark.Spark;

public class Server {

  public static void main(String[] args) {
    int port = 6464;
    Spark.port(port);

    // Handle CORS preflight requests
    options("/*", (request, response) -> {
      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }
      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }
      return "OK";
    });

    before((request, response) -> {
      response.header("Access-Control-Allow-Origin", "http://localhost:3000");
      response.header("Access-Control-Allow-Credentials", "true");
      response.header("Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept, Authorization");
      response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    });

    ImageFile imageFile1 = new ImageFile();
    ImageFile candidateImage = new ImageFile();

    StorageInterface firebaseUtils;

    try {
      firebaseUtils = new FirebaseUtilities();

      Spark.get("loadimage", new LoadImageHandler(imageFile1, candidateImage));
      Spark.get("viewimage", new ViewImageHandler(imageFile1));
      Spark.get("viewimage2", new ViewImageHandler(candidateImage));
      Spark.get("runscanner", new RunScannerHandler(imageFile1, candidateImage));
      Spark.post("loadToStorage", new AddToStorage(firebaseUtils));
      Spark.post("scanMultiple", new NImageScanHandler());

      Spark.init();
      Spark.awaitInitialization();

      System.out.println("Server started at http://localhost:" + port);
    } catch (IOException e) {
      e.printStackTrace();
      System.err.println(
          "Error: Could not initialize Firebase. Likely due to firebase_config.json not being found. Exiting.");
      System.exit(1);
    }
  }
}