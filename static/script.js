const messageBar = document.querySelector("#message-input");
const sendBtn = document.querySelector("#send-btn");
const messageBox = document.querySelector("#message-box");

let API_URL = "https://api.openai.com/v1/chat/completions";
let API_KEY = "your-api-key-here";  // Replace with your actual OpenAI API Key

sendBtn.onclick = function () {
  if (messageBar.value.length > 0) {
    const UserTypedMessage = messageBar.value;
    messageBar.value = ""; // Clear input field

    // User message
    let message = `
      <div class="chat message">
        <img src="img/user.jpg" alt="user-avatar">
        <span>${UserTypedMessage}</span>
      </div>
    `;

    // Bot response placeholder
    let response = `
      <div class="chat response">
        <img src="img/chatbot.jpg" alt="bot-avatar">
        <span class="new">...</span>
      </div>
    `;

    // Insert user message at the bottom
    messageBox.insertAdjacentHTML("beforeend", message);

    // Scroll to the latest message
    messageBox.scrollTop = messageBox.scrollHeight;

    setTimeout(() => {
      // Insert bot response placeholder
      messageBox.insertAdjacentHTML("beforeend", response);

      // Scroll to the latest message
      messageBox.scrollTop = messageBox.scrollHeight;

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: UserTypedMessage }
          ],
        }),
      };

      // Fetch the response from OpenAI API
      fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          const ChatBotResponse = document.querySelector(".response .new");

          // Extract and display the bot's response
          if (data.choices && data.choices[0] && data.choices[0].message) {
            const botReply = data.choices[0].message.content;
            if (botReply.trim() === "") {
              ChatBotResponse.innerHTML = "Sorry, I couldn't generate a response. Please try again.";
            } else {
              ChatBotResponse.innerHTML = botReply;
            }
          } else {
            ChatBotResponse.innerHTML = "Sorry, I couldn't understand that.";
          }

          ChatBotResponse.classList.remove("new");
        })
        .catch((error) => {
          console.error("Error:", error);
          const ChatBotResponse = document.querySelector(".response .new");
          ChatBotResponse.innerHTML = "Oops! An error occurred. Please try again.";
          ChatBotResponse.classList.remove("new");
        });
    }, 100);
  }
};
