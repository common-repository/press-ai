export const sendMessage = async (conversation) => {
    // Remove timestamp field from each message in the conversation array
    const conversationWithoutTimestamp = conversation.conversation.map((message) => {
        const { timestamp, ...messageWithoutTimestamp } = message;
        return messageWithoutTimestamp;
    });

    const response = await fetch('/wp-json/pressai/v1/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation: conversationWithoutTimestamp }),
    });

    return await response.json();
};


