import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "../styles/SupportChatbot.css";
import {useLocation} from "react-router-dom";

interface Message {
    sender: "bot" | "user";
    text: string;
}

const SupportChatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    const [messages, setMessages] = useState<Message[]>([
        {
            sender: "bot",
            text: "Hi! 👋 Welcome to Customer Support. How can I help you?",
        },
    ]);

    const [input, setInput] = useState("");

    const getBotResponse = (message: string): string => {
        const text = message.toLowerCase();

        if (text.includes("order")) {
            return "You can view your orders from the 'My Orders' section.";
        }

        if (text.includes("cart")) {
            return "You can add products to your cart using the 'Add to Cart' button and view them from the cart icon.";
        }

        if (text.includes("wishlist")) {
            return "You can add products to your wishlist by clicking the ❤️ icon on a product.";
        }

        if (
            text.includes("return") ||
            text.includes("refund")
        ) {
            return "For returns or refunds, please contact our customer support team with your order number.";
        }

        if (text.includes("delivery")) {
            return "Your delivery status can be checked from the 'My Orders' section.";
        }

        if (text.includes("payment")) {
            return "We support online payment options available during checkout.";
        }

        if (
            text.includes("hello") ||
            text.includes("hi")
        ) {
            return "Hello! 👋 How can I help you today?";
        }

        return "I'm sorry, I didn't understand that. You can ask me about orders, cart, wishlist, delivery, payment, returns, or refunds.";
    };

    const sendMessage = () => {
        if (!input.trim()) {
            return;
        }

        const userMessage = input.trim();

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: userMessage,
            },
        ]);

        setInput("");

        setTimeout(() => {
            const response = getBotResponse(userMessage);

            setMessages((previous) => [
                ...previous,
                {
                    sender: "bot",
                    text: response,
                },
            ]);
        }, 500);
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            {!open && (
                <button
                    className="chatbot-button"
                    onClick={() => setOpen(true)}
                    title="Customer Support"
                >
                    <MessageCircle size={26} />
                </button>
            )}

            {open && (
                <div className="chatbot-container">

                    <div className="chatbot-header">
                        <div>
                            <strong>Customer Support</strong>
                            <span>Online</span>
                        </div>

                        <button
                            className="chatbot-close"
                            onClick={() => setOpen(false)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">

                        {messages.map(
                            (message, index) => (
                                <div
                                    key={index}
                                    className={
                                        message.sender === "user"
                                            ? "message user-message"
                                            : "message bot-message"
                                    }
                                >
                                    {message.text}
                                </div>
                            )
                        )}

                    </div>

                    <div className="chatbot-input">

                        <input
                            type="text"
                            value={input}
                            placeholder="Type your message..."
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            onClick={sendMessage}
                            title="Send"
                        >
                            <Send size={18} />
                        </button>

                    </div>

                </div>
            )}
        </>
    );
};

export default SupportChatbot;