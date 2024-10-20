package com.universityweb.common.security;

import com.universityweb.common.Utils;
import com.universityweb.common.auth.exception.JwtTokenCreationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    public String generateToken(
            String username,
            LocalDateTime current,
            LocalDateTime expiration
    ) {
        Date currentDate = Utils.toDate(current);
        Date expiresDate = Utils.toDate(expiration);

        try {
            Key key = getSignInKey();
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
        Claims claims = buildJwtParser()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            buildJwtParser()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Date getExpiration(String token) {
        return buildJwtParser()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    private JwtParser buildJwtParser() {
        Key key = getSignInKey();
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
