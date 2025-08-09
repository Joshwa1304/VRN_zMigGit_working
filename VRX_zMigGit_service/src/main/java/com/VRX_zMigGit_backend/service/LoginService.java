package com.VRX_zMigGit_backend.service;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.VRX_zMigGit_backend.model.LoginModel;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;

@Service
public class LoginService {

    @Value("${spring.data.mongodb.uri}")
    private String uri;

    // @Value("${spring.data.mongodb.database}")
    // private String dbName;

    public LoginModel loginPage(String inputUsername) {

        LoginModel login = new LoginModel();
        MongoClient client = MongoClients.create(uri);
        MongoDatabase db = client.getDatabase("credential");
        MongoCollection<Document> collection = db.getCollection("credential");
        FindIterable<Document> docs = collection.find(Filters.eq("username", inputUsername));
        Document doc = docs.first();

        if (doc != null) {
                login.setUsername(doc.getString("username"));
                login.setPassword(String.valueOf(doc.get("password")));
                login.setRole(doc.getString("role"));
            }

        return login;
    }
}
