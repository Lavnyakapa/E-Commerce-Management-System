package org.example.ecommercemanagementsystem.controller;

import org.example.ecommercemanagementsystem.dto.ChatRequest;
import org.example.ecommercemanagementsystem.dto.ChatResponse;
import org.example.ecommercemanagementsystem.service.ChatService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest request) {

        String response =
                chatService.getAIResponse(request.getMessage());

        return ResponseEntity.ok(
                new ChatResponse(response)
        );
    }
}