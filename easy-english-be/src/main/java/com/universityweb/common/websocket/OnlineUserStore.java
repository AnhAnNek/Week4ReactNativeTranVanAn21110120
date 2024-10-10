package com.universityweb.common.websocket;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class OnlineUserStore {
    private static volatile OnlineUserStore ins;
    private final Map<String, Set<String>> activeSessions;

    public synchronized static OnlineUserStore getIns() {
        if (ins == null) {
            ins = new OnlineUserStore();
        }
        return ins;
    }

    private OnlineUserStore() {
        activeSessions = new ConcurrentHashMap<>();
    }

    public void add(String username, String sessionId) {
        Set<String> sessionIds = new HashSet<>();
        if (!activeSessions.containsKey(username)) {
            sessionIds.add(sessionId);
        } else {
            sessionIds = activeSessions.get(username);
            sessionIds.add(sessionId);
        }
        activeSessions.put(username, sessionIds);
    }

    public void remove(String username, String sessionId) {
        if (activeSessions.containsKey(username)) {
            Set<String> sessionIds = activeSessions.get(username);
            sessionIds.remove(sessionId);

            if (sessionIds.isEmpty()) {
                activeSessions.remove(username);
            }
        }
    }

    public boolean isOnline(String username) {
        return activeSessions.containsKey(username);
    }

    public ArrayList<String> getOnlineUsers() {
        return new ArrayList<>(activeSessions.keySet());
    }
}
