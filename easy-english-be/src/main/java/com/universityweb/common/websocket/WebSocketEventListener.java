package com.universityweb.common.websocket;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;
import java.util.Map;

@Component
public class WebSocketEventListener {

    private static final Logger log = LogManager.getLogger(WebSocketEventListener.class);

    @Autowired private CustomMessageHandler messageHandler;

    @EventListener
    public void handleWebsocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        log.info("Received a new web socket connection, sessionId: `{}`", headerAccessor.getSessionId());
    }

    @EventListener
    public void handleWebsocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        OnlineUserStore onlineUserStore = OnlineUserStore.getIns();
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();

        String senderUsername = (String) sessionAttributes.get("senderUsername");

        if (senderUsername == null) {
            return;
        }

        String sessionId = headerAccessor.getSessionId();
        log.info("User Disconnected: `{}`, sessionId: `{}`", senderUsername, sessionId);
        removeSessionAttributes(sessionAttributes, "senderUsername", "conversationId");

        onlineUserStore.remove(senderUsername, sessionId);
        List<String> onlineUsers = onlineUserStore.getOnlineUsers();
        messageHandler.sendOnlineUsers(onlineUsers);
    }

    private void removeSessionAttributes(Map<String, Object> sessionAttributes, String... attributes) {
        log.info("Before user disconnect: `{}`", sessionAttributes);
        for (String attribute : attributes) {
            sessionAttributes.remove(attribute);
        }
        log.info("After user disconnect: `{}`", sessionAttributes);
    }
}
