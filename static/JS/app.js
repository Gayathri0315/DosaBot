const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "";

const context = [
  {
    role: "system",
    content: `You are OrderBot, an automated service to collect orders for a street dosa. 
    You first greet the customer, then collect the order, 
    and then ask if it's a pickup or delivery. 
    You wait to collect the entire order, then summarize it and check for a final, all amounts are in Rupees. 
    If the customer wants to add anything else, make sure to clarify all options, extras, and sizes uniquely 
    identify the item from the menu.
    If it's a delivery, ask for an address. 
    Finally, collect the payment for all the orders.
    Make sure that the payment is made by the customer.
    Respond in a short, very conversational friendly style.
    
    The menu includes:
    Masala dosa - 12.95, 10.05
    Onion dosa - 10.95, 9.25
    Plain dosa - 9.10, 8.75
    Ravva dosa - 11.95, 9.75
    Onion Ravva dosa - 12.50, 16.00
    Pesarattu - 4.50, 3.50

    Chutneys:
    Coconut chutney
    Sambar
    Ginger chutney
    Pudhina chutney

    Drinks:
    Tea - 3.00
    Coffee - 3.00
    Bottled water - 5.00`,
  },
];

let chatHistory = [...context];

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = input.value;
  input.value = "";

  messages.innerHTML += `<div class="message user-message">
  <img src="static/user.png" alt="user icon"> <span>${message}</span>
  </div>`;

  chatHistory.push({ role: "user", content: message });

  // Use axios library to make a POST request to the OpenAI API
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      prompt: chatHistory.map((msg) => msg.content).join("\n"),
      model: "text-davinci-003",
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const chatbotResponse = response.data.choices[0].text.trim();

  chatHistory.push({ role: "system", content: chatbotResponse });

  messages.innerHTML += `<div class="message bot-message">
  <img src="static/chatbot.png" alt="bot icon"> <span>${chatbotResponse}</span>
  </div>`;

  // Scroll to the bottom of the messages
  messages.scrollTop = messages.scrollHeight;
});
