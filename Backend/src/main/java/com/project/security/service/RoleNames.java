package com.project.security.service;

public final class RoleNames {

    public static final String USER = "USER";
    public static final String ADMIN = "ADMIN";

    private RoleNames() {
    }

    public static String normalize(String role) {
        if (role == null || role.isBlank()) {
            return USER;
        }
        String value = role.trim().toUpperCase();
        if (value.startsWith("ROLE_")) {
            value = value.substring(5);
        }
        return value.isBlank() ? USER : value;
    }
}
