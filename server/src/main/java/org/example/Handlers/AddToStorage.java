package org.example.Handlers;

import org.example.ImageFile;
import org.example.Storage.StorageInterface;
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
    String fileName = request.queryParams("imageFile");

    return null;
  }
}
