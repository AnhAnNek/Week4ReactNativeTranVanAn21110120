package com.universityweb.notification;

import com.universityweb.common.auth.entity.User;
import com.universityweb.common.auth.service.auth.AuthService;
import com.universityweb.common.request.GetByUsernameRequest;
import com.universityweb.common.response.ErrorResponse;
import com.universityweb.notification.response.NotificationResponse;
import com.universityweb.notification.request.SendNotificationRequest;
import com.universityweb.notification.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private static final Logger log = LogManager.getLogger(NotificationController.class);
    private final NotificationService notificationService;
    private final AuthService authService;

    @Operation(
            summary = "Get Notifications by Username",
            description = "Retrieves all notifications associated with a specific user identified by their username.",
            responses = {
                    @ApiResponse(
                            description = "List of notifications retrieved successfully.",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = NotificationResponse.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @GetMapping("/get-by-username/{username}")
    public ResponseEntity<Page<NotificationResponse>> getNotificationsByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("Fetching notifications for user: {}", username);
        authService.checkAuthorization(username);

        GetByUsernameRequest request = new GetByUsernameRequest(page, size, username);
        Page<NotificationResponse> notificationsPage =
                notificationService.getNotificationsByUsername(request);
        log.info("Retrieved {} notifications for user: {}", notificationsPage.getSize(), username);
        return ResponseEntity.ok(notificationsPage);
    }

    @Operation(
            summary = "Send a notification",
            description = "Send a notification message to a specific user.",
            responses = {
                    @ApiResponse(description = "Notification sent successfully.", responseCode = "201",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = NotificationResponse.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            })
    @PostMapping("/send")
    public ResponseEntity<NotificationResponse> send(
            @RequestBody SendNotificationRequest request
    ) {
        log.info("Send notification: `{}` to username: `{}`", request.message(), request.username());
        NotificationResponse savedNotificationDTO = notificationService.send(request);
        log.info("Notification sent successfully with id: {}", savedNotificationDTO.getId());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedNotificationDTO);
    }

    @Operation(
            summary = "Mark Notification as Read",
            description = "Updates the status of a notification to indicate that it has been read.",
            responses = {
                    @ApiResponse(
                            description = "Notification marked as read successfully.",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = String.class))),
                    @ApiResponse(
                            description = "Internal server error.",
                            responseCode = "500",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ErrorResponse.class)))
            }
    )
    @PutMapping("/mark-as-read/{id}")
    public ResponseEntity<String> markAsRead(
            @PathVariable("id") Long notificationId
    ) {
        log.info("Marking notification as read with ID: {}", notificationId);
        User user = notificationService.getUserByNotificationId(notificationId);
        authService.checkAuthorization(user.getUsername());

        notificationService.markAsRead(notificationId);
        log.info("Notification with ID: {} marked as read", notificationId);
        return ResponseEntity.ok("Mark as read successfully");
    }
}
