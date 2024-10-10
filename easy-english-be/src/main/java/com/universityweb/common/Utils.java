package com.universityweb.common;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class Utils {
    public static Date toDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public LocalDateTime toLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    /**
     * Converts a string representing milliseconds since epoch to a LocalDateTime.
     *
     * @param millisStr the string representing milliseconds since epoch
     * @return LocalDateTime object corresponding to the given milliseconds
     * @throws IllegalArgumentException if the input string is not a valid long
     */
    public static LocalDateTime convertMillisToLocalDateTime(String millisStr) {
        if (millisStr == null || millisStr.isEmpty()) {
            throw new IllegalArgumentException("Input string cannot be null or empty");
        }

        try {
            long millis = Long.parseLong(millisStr);
            Instant instant = Instant.ofEpochMilli(millis);
            return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid input: " + millisStr, e);
        }
    }
}
