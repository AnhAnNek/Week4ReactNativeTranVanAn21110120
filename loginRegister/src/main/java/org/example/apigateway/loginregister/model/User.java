package org.example.apigateway.loginregister.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Table(name = "users")
@Entity
@Getter
@Setter
public class User {
    @Id
    @Column(name = "email")
    private String email;
    @Column(name = "password")
    private String password;

}
