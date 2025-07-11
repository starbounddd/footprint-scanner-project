package org.example.Handlers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.machinezoo.sourceafis.FingerprintImage;
import com.machinezoo.sourceafis.FingerprintImageOptions;
import com.machinezoo.sourceafis.FingerprintMatcher;
import com.machinezoo.sourceafis.FingerprintTemplate;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;
import org.example.Handlers.RunScannerHandler.ScannerSuccessResponse;
import org.example.Handlers.Subject.Subject;
import spark.Request;
import spark.Response;
import spark.Route;

public class NImageScanHandler implements Route {

  private HashMap<String, Object> responseMap;

  @Override
  public Object handle(Request request, Response response) throws Exception {
    this.responseMap = new HashMap<String, Object>();
    response.type("application/json");
    // Enable multipart handling
    request.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("/tmp"));

    try {
      Part probePart = request.raw().getPart("probeImage");
      if (probePart == null) {
        return new RunScannerHandler.ScannerFailureResponse("Probe image not found").serialize();
      }

      byte[] probeBytes = probePart.getInputStream().readAllBytes();
      var probe = new FingerprintTemplate(
          new FingerprintImage(
              probeBytes,
              new FingerprintImageOptions().dpi(500)));

      // Get all candidate files
      Collection<Part> parts = request.raw().getParts();
      ArrayList<Subject> subjects = new ArrayList<>();
      int idx = 0;
      for (Part part : parts) {
        if ("files".equals(part.getName())) {
          byte[] candidateBytes = part.getInputStream().readAllBytes();
          FingerprintTemplate newCandidateTemplate = new FingerprintTemplate(
              new FingerprintImage(
                  candidateBytes,
                  new FingerprintImageOptions().dpi(500)));
          // Use submitted file name as identifier
          Subject newSubject = new Subject(idx++, part.getSubmittedFileName(),
              newCandidateTemplate);
          subjects.add(newSubject);
        }
      }

      ArrayList<Subject> matchingSubjects = identifyN(probe, subjects);
      for (Subject subject : matchingSubjects) {
        this.responseMap.put(String.valueOf(subject.id()), subject.name());
      }

      if (!matchingSubjects.isEmpty()) {
        System.out.println("Match Found! The following matches were found:" + matchingSubjects);
      } else {
        this.responseMap.put("success",
            "Match Not Found. The following matches were not found");
      }
      return new RunScannerHandler.ScannerSuccessResponse(this.responseMap).serialize();

    } catch (IOException e) {
      e.printStackTrace();
      return new RunScannerHandler.ScannerFailureResponse("error").serialize();
    }
  }

  private Subject identifyOne(FingerprintTemplate probe, Iterable<Subject> candidates) {
    var matcher = new FingerprintMatcher(probe);
    Subject match = null;
    double max = Double.NEGATIVE_INFINITY;
    for (var candidate : candidates) {
      double similarity = matcher.match(candidate.template());
      if (similarity > max) {
        max = similarity;
        match = candidate;
      }
    }
    double threshold = 40;
    return max >= threshold ? match : null;
  }

  private ArrayList<Subject> identifyN(FingerprintTemplate probe, Iterable<Subject> candidates) {
    var matcher = new FingerprintMatcher(probe);
    ArrayList<Subject> matches = new ArrayList<>();
    double threshold = 40;
    for (var candidate : candidates) {
      double similarity = matcher.match(candidate.template());
      System.out.println("Score for " + candidate + ": " + similarity);
      if (similarity > threshold) {
        matches.add(candidate);
      }
    }
    return matches;
  }
}
