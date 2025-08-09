package com.VRX_zMigGit_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.VRX_zMigGit_backend.model.LoginModel;
import com.VRX_zMigGit_backend.service.LoginService;

@RestController
@CrossOrigin
public class LoginController {

    @Autowired
    LoginService loginService;

    @GetMapping("/")
    public String greet(){
        return "VRN zMigGit";
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginPage(@RequestBody Map<String, String> data){
        LoginModel loginModel = loginService.loginPage(data.get("username"));

        StringBuilder msg = new StringBuilder();

        if (data.get("username").equals(loginModel.getUsername())){
            if(data.get("password").equals(loginModel.getPassword())){
                msg.append( "Role :" + loginModel.getRole());
                msg.append( "\nUsername :" + loginModel.getUsername());
            }else{
                msg.append("The password that you've entered is incorrect.");
            }
        }else{
            msg.append("Incorrect username or password.");
        }

        return ResponseEntity.ok(msg.toString());
    }
}
