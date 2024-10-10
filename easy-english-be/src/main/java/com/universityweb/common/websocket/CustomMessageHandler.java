package com.universityweb.common.websocket;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomMessageHandler {

    private static final Logger log = LogManager.getLogger(CustomMessageHandler.class);
    private static final String ONLINE_USERS_DEST = "/topic/online-users";

    @Autowired private SimpMessagingTemplate messagingTemplate;

    public void sendOnlineUsers(List<String> onlineUsers) {
        log.info("Sending online users to {}", onlineUsers);
        messagingTemplate.convertAndSend(ONLINE_USERS_DEST, onlineUsers);
    }
}
