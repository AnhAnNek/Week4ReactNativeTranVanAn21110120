package com.universityweb.common.security;

import com.universityweb.common.Utils;
import com.universityweb.common.auth.exception.JwtTokenCreationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;

@Component
public class JwtGenerator implements Serializable {
    private static final Logger log = LogManager.getLogger(JwtGenerator.class);
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    public String generateToken(
            String username,
            LocalDateTime current,
            LocalDateTime expiration
    ) {
        Date currentDate = Utils.toDate(current);
        Date expiresDate = Utils.toDate(expiration);

        try {
            String token = Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(currentDate)
                    .setExpiration(expiresDate)
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
            log.info("New accessToken: {}", token);
            return token;
        } catch (Exception e) {
            throw new JwtTokenCreationException("Cannot create JWT tokenStr, error: " + e.getMessage());
        }
    }

    public String getUsernameFromJwt(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Date getExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
