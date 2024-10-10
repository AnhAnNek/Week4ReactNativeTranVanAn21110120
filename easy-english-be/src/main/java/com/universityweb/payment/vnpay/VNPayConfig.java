package com.universityweb.payment.vnpay;

import jakarta.annotation.PostConstruct;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class VNPayConfig {

    public static final int VND_MULTIPLIER = 100;
    public static String vnpPayUrl;
    public static String vnpTmnCode;
    public static String vnpHashSecret;

    private static final Logger log = LogManager.getLogger(VNPayConfig.class);

    @Value("${third-party.vn-pay.pay-url}")
    private String vnpPayUrlValue;

    @Value("${third-party.vn-pay.tmn-code}")
    private String vnpTmnCodeValue;

    @Value("${third-party.vn-pay.hash-secret}")
    private String vnpHashSecretValue;

    @PostConstruct
    public void init() {
        vnpPayUrl = vnpPayUrlValue;
        vnpTmnCode = vnpTmnCodeValue;
        vnpHashSecret = vnpHashSecretValue;

        log.info("VNPay Config Initialized - Pay URL: {}", vnpPayUrl);
    }

    public static String hashAllFields(Map fields) {
        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(vnpHashSecret,sb.toString());
    }

    public static String hmacSHA512(final String key, final String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            log.error(ex.getMessage());
            return "";
        }
    }

    public static String getServerIp() {
        try {
            String hostname = InetAddress.getLocalHost().getHostName();
            InetAddress inetAddress = InetAddress.getByName(hostname);
            String serverIp = inetAddress.getHostAddress();
            log.info("Server Ip: " + serverIp);
            return serverIp;
        } catch (UnknownHostException e) {
            log.error(e.getMessage());
        }
        return null;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
