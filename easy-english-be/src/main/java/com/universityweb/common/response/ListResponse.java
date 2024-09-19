package com.universityweb.common.response;

import java.util.List;

public record ListResponse<T>(
        List<T> list,
        int page,
        int totalPages
) {}
