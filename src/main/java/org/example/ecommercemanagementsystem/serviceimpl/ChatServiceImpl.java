package org.example.ecommercemanagementsystem.serviceimpl;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import org.example.ecommercemanagementsystem.service.ChatService;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    private final OpenAIClient client;

    public ChatServiceImpl() {
        this.client = OpenAIOkHttpClient.fromEnv();
    }

    @Override
    public String getAIResponse(String message) {

        ResponseCreateParams params = ResponseCreateParams.builder()
                .model(ChatModel.GPT_5_2)
                .input(message)
                .build();

        Response response = client.responses().create(params);

        return response.output().stream()
                .flatMap(item -> item.message().stream())
                .flatMap(messageItem -> messageItem.content().stream())
                .flatMap(content -> content.outputText().stream())
                .map(outputText -> outputText.text())
                .findFirst()
                .orElse("Sorry, I could not generate a response.");
    }
}