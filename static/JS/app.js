const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const messages = document.getElementById("chat-messages");
const apiKey = "";

const context = [
  {
    role: "system",
    content: `You are OrderBot, an automated service to collect orders for a street dosa. 
    You first greet the customer, then collects the order.
    and then asks if it's a pickup or delivery. 
    You wait to collect the entire order, then summarize it and check for a final, all amount are in Rupees 
    time if the customer wants to add anything else. 
    Make sure to clarify all options, extras and sizes uiquely.
    identify the item from the menu.
    If it's a delivery, you ask for an address. 
    Finally you collect the payment for all the orders.
    Make sure that the payment is made by the customer. 
    You should respond only to take the orders for all other questions you should not respond  to those questions. 
    You respond in a short, very conversational friendly style. 
    You should take orders only for the items that are included in the following menu.

    The menu includes 
    Masala dosa-40.00 
    Onion dosa-25.00 
    Plain dosa-20.00 
    Ravva dosa-20.00 
    Onion Ravva dosa-30.00
    Egg dosa-45.00
    pesarattu-35.00 
    Drinks: 
    bottled water 30.00 
    Tea  
    Tea:
    Normal Tea-10.00
    Special Tea-20.00 
    Ilachi Tea-15.00
    Green Tea - 15.00 
    Coffee:
    Normal Coffee-15.00 
    Filtered Coffee-30.00 
    Black Coffee-20.00
    cool drinks: 
    Sprite-10.00,30.00
    Thums-Up 10.00,30.00
    Pepsi-10.00,30.00
    Maaza-10.00,30.00
    Slice-10.00,30.00`,
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