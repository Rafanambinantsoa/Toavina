import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useData } from "../context/DataProvider";
import '../styles/projects/chatbot.css';

const ChatMessage = ({ message }) => (
    <div className={`budget-chatbot-message ${message.isBot ? 'bot' : 'user'}`}>
        <div className={`budget-chatbot-bubble ${message.isBot ? 'bot' : 'user'}`}>
            <p>{message.content}</p>
            {message.budget && (
                <div className="budget-chatbot-budget-info">
                    <div className="budget-chatbot-budget-item">
                        Budget prévu: €{message.budget.predicted}
                    </div>
                    <div className="budget-chatbot-budget-item">
                        Budget réel: €{message.budget.actual}
                    </div>
                </div>
            )}
        </div>
    </div>
);

const BudgetChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const { messageData } = useData();
    const [messages, setMessages] = useState(messageData || []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsAnimating(true);
        // Wait for animation to complete before removing from DOM
        setTimeout(() => {
            setIsOpen(false);
            setIsAnimating(false);
        }, 250); // Match this with animation duration
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            content: inputMessage,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                content: "D'après mon analyse, voici quelques suggestions d'optimisation budgétaire pour ce projet:",
                isBot: true,
                timestamp: new Date(),
                budget: {
                    predicted: 150000,
                    actual: 180000
                }
            };

            setMessages(prev => [...prev, botResponse]);
        }, 1000);

        setInputMessage('');
    };

    return (
        <div className="budget-chatbot-container">
            {!isOpen && !isAnimating && (
                <div className="budget-chatbot-button">
                    <button
                        className="budget-chatbot-icon"
                        onClick={handleOpen}
                    >
                        <MessageCircle />
                    </button>
                </div>
            )}

            {(isOpen || isAnimating) && (
                <div className={`budget-chatbot-window ${isAnimating ? 'exiting' : 'entering'}`}>
                    <div className="budget-chatbot-header">
                        <h2 className="budget-chatbot-title">Optimisation Budgétaire</h2>
                        <button
                            className="budget-chatbot-close"
                            onClick={handleClose}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="budget-chatbot-messages">
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                    </div>

                    <div className="budget-chatbot-input-area">
                        <form onSubmit={handleSubmit} className="budget-chatbot-form">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Posez une question sur le budget..."
                                className="budget-chatbot-input"
                            />
                            <button type="submit" className="budget-chatbot-send">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetChatbot;