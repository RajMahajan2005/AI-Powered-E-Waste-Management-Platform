import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

const getBotResponse = (input, handleFilter, handleSearch) => {
  const text = input.toLowerCase().trim();

  if (text.includes("hello") || text.includes("hi")) return { text: "Hi there! How can I assist you with E-Waste today? 🤖" };
  if (text.includes("e-waste")) return { text: "E-waste is any discarded electronic device. Recycling them is crucial for the environment!" };
  if (text.includes("recycle")) return { text: "You can recycle by selecting a product and scheduling a pickup, or by finding a nearby drop-off center." };
  if (text.includes("buy")) return { text: "Great! You can browse our products on the home page. What are you looking for?" };
  
  if (text.includes("mobile") || text.includes("phone")) {
    handleFilter("Mobile");
    return { text: "Sure, I've filtered the products to show you all available mobiles." };
  }
  if (text.includes("laptop")) {
    handleFilter("Laptop");
    return { text: "Okay, take a look at our current selection of laptops." };
  }
  if (text.includes("search for")) {
    const searchTerm = text.split("search for")[1].trim();
    if (searchTerm) {
      handleSearch(searchTerm);
      return { text: `I'm now searching for "${searchTerm}" for you.` };
    }
  }
  
  return { text: "Sorry, I didn't quite get that. You can ask me to 'show mobiles', 'search for powerbank', or ask about recycling." };
};

function Chatbot({ handleFilter, handleSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! How can I help you today?" }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = { from: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(textToSend, handleFilter, handleSearch);
      setMessages(prev => [...prev, { from: "bot", text: botReply.text }]);
      setIsTyping(false);
    }, 1200);
  };
  
  const quickActions = ["Show me mobiles", "How to recycle?", "Search for batteries"];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.5 }}
            className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border flex flex-col"
            style={{ height: "60vh" }}
          >
            <div className="p-4 bg-green-600 text-white rounded-t-2xl flex justify-between items-center">
              <h3 className="font-bold text-lg">E-Waste Assistant</h3>
              <button onClick={toggleChat} className="hover:opacity-75"><X size={20} /></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <p className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${msg.from === "user" ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
                      {msg.text}
                    </p>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <p className="p-3 rounded-2xl bg-white text-gray-500 rounded-bl-none shadow-sm">
                      <span className="animate-pulse">Bot is typing...</span>
                    </p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
            <div className="p-2 border-t flex flex-wrap gap-2 justify-center">
              {quickActions.map(action => (
                <button key={action} onClick={() => sendMessage(action)} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full hover:bg-green-200 transition">
                  {action}
                </button>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                className="input"
                value={input}
                placeholder="Ask something..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={() => sendMessage()} className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition">
                <Send size={20}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        onClick={toggleChat} 
        className="bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
}

export default Chatbot;