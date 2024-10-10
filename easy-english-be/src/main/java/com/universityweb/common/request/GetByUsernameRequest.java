package com.universityweb.common.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GetByUsernameRequest extends ListRequest {
    private String username;

    public GetByUsernameRequest(int page, int size, String username) {
        super(page, size);
        this.username = username;
    }
}
