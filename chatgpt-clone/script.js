document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContainer = document.getElementById('messages');
    const inputContainer = document.getElementById('inputContainer');
    
    let isFirstMessage = true;
    
    // Initialize highlight.js for code syntax highlighting
    hljs.highlightAll();
    
    // Focus input on page load
    userInput.focus();
    
    // Send message when clicking button or pressing Enter
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        // Move input to bottom after first message
        if (isFirstMessage) {
            inputContainer.classList.remove('centered');
            inputContainer.classList.add('bottom');
            isFirstMessage = false;
            
            // Add welcome message
            setTimeout(() => {
                const welcomeMessage = `Hello! I'm an advanced ChatGPT clone with code generation capabilities. I can:
                
- Answer questions
- Generate code in multiple languages
- Explain programming concepts
- Simulate code execution (frontend only)

Try asking me to write code in JavaScript, Python, Java, C++, or other languages!`;
                addMessage(welcomeMessage, 'bot');
            }, 500);
        } else {
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate bot response after a delay
            setTimeout(() => {
                // Remove typing indicator
                removeTypingIndicator();
                
                // Generate response based on user input
                const response = generateAdvancedResponse(message);
                addMessage(response.content, 'bot', response.code, response.language);
                
                // If there's executable JavaScript code, add a run button
                if (response.language === 'javascript' && response.code) {
                    setTimeout(() => {
                        addRunButton(response.code);
                    }, 100);
                }
            }, 1500 + Math.random() * 2000);
        }
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message message-bot';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        typingIndicator.id = 'typing-indicator';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            messagesContainer.removeChild(typingIndicator);
        }
    }
    
    function addMessage(text, sender, code = null, language = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${sender}`;
        
        const avatarIcon = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        let codeBlock = '';
        if (code) {
            codeBlock = `
                <pre><code class="language-${language}">${escapeHtml(code)}</code></pre>
                <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
            `;
        }
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                ${avatarIcon}
            </div>
            <div class="message-content">
                <p>${formatTextWithLinks(text)}</p>
                ${codeBlock}
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Re-run highlight.js for any new code blocks
        if (code) {
            hljs.highlightAll();
        }
    }
    
    function addRunButton(code) {
        const lastMessage = messagesContainer.lastElementChild;
        if (!lastMessage) return;
        
        const preElement = lastMessage.querySelector('pre');
        if (!preElement) return;
        
        const runButton = document.createElement('button');
        runButton.className = 'copy-btn';
        runButton.style.right = '70px';
        runButton.textContent = 'Run';
        runButton.onclick = function() {
            executeJavaScript(code);
        };
        
        preElement.appendChild(runButton);
    }
    
    function executeJavaScript(code) {
        try {
            // Create a safe execution environment
            const originalConsoleLog = console.log;
            let output = '';
            
            // Override console.log to capture output
            console.log = function() {
                const args = Array.from(arguments);
                output += args.join(' ') + '\n';
                originalConsoleLog.apply(console, arguments);
            };
            
            // Execute the code
            new Function(code)();
            
            // Restore original console.log
            console.log = originalConsoleLog;
            
            // Show execution results
            if (output) {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'execution-result';
                resultDiv.innerHTML = `<strong>Execution output:</strong><pre>${escapeHtml(output.trim())}</pre>`;
                
                const messageContent = messagesContainer.lastElementChild.querySelector('.message-content');
                if (messageContent) {
                    messageContent.appendChild(resultDiv);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            }
        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'execution-result';
            errorDiv.innerHTML = `<strong>Error:</strong><pre>${escapeHtml(error.message)}</pre>`;
            
            const messageContent = messagesContainer.lastElementChild.querySelector('.message-content');
            if (messageContent) {
                messageContent.appendChild(errorDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }
    
    function generateAdvancedResponse(userMessage) {
        // Convert to lowercase for easier matching
        const lowerMessage = userMessage.toLowerCase();
        
        // Programming language detection
        const languages = {
            javascript: ['javascript', 'js', 'ecmascript'],
            python: ['python', 'py'],
            java: ['java'],
            cpp: ['c++', 'cpp'],
            csharp: ['c#', 'c sharp'],
            php: ['php'],
            ruby: ['ruby', 'rb'],
            go: ['go', 'golang'],
            rust: ['rust'],
            swift: ['swift'],
            kotlin: ['kotlin'],
            typescript: ['typescript', 'ts']
        };
        
        let detectedLanguage = null;
        for (const [lang, keywords] of Object.entries(languages)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                detectedLanguage = lang;
                break;
            }
        }
        
        // Response templates
        const response = {
            content: '',
            code: null,
            language: null
        };
        
        // Handle code generation requests
        if (detectedLanguage || 
            lowerMessage.includes('code') || 
            lowerMessage.includes('write') || 
            lowerMessage.includes('example') || 
            lowerMessage.includes('how to')) {
            
            response.language = detectedLanguage || 'javascript';
            
            // Generate appropriate code based on language and request
            response.code = generateCodeExample(response.language, userMessage);
            
            if (response.code) {
                response.content = `Here's a ${response.language} code example based on your request:\n\n${getCodeExplanation(response.language, userMessage)}`;
            } else {
                response.content = `I can generate ${response.language} code examples. Could you be more specific about what you need?`;
            }
        } 
        // Handle general questions
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response.content = "Hello! I'm an advanced ChatGPT clone. You can ask me technical questions or request code examples in various programming languages.";
        } 
        else if (lowerMessage.includes('how are you')) {
            response.content = "I'm just a demo interface, but I'm functioning well! How can I assist you with programming today?";
        } 
        else if (lowerMessage.includes('your name')) {
            response.content = "I'm CodeGPT, a frontend demo of a ChatGPT-like interface with code generation capabilities.";
        } 
        else if (lowerMessage.includes('thank')) {
            response.content = "You're welcome! Let me know if you need help with anything else.";
        } 
        else if (lowerMessage.includes('what is') || lowerMessage.includes('explain')) {
            response.content = getTechnicalExplanation(userMessage);
        }
        else {
            // Default response for unrecognized queries
            response.content = "I'm a simulated programming assistant. In a real implementation, I would analyze your question and provide a detailed response. Try asking me to write code or explain a programming concept!";
        }
        
        return response;
    }
    
    function generateCodeExample(language, request) {
        const lowerRequest = request.toLowerCase();
        
        // Common code examples for each language
        const examples = {
            javascript: {
                default: `// JavaScript Hello World
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
                fibonacci: `// JavaScript Fibonacci sequence
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`,
                sort: `// JavaScript array sorting
const numbers = [5, 2, 9, 1, 5, 6];
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 2, 5, 5, 6, 9]`
            },
            python: {
                default: `# Python Hello World
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
                fibonacci: `# Python Fibonacci sequence
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))  # 55`,
                sort: `# Python list sorting
numbers = [5, 2, 9, 1, 5, 6]
numbers.sort()
print(numbers)  # [1, 2, 5, 5, 6, 9]`
            },
            java: {
                default: `// Java Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println(greet("World"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
                fibonacci: `// Java Fibonacci sequence
public class Fibonacci {
    public static void main(String[] args) {
        System.out.println(fibonacci(10)); // 55
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`
            },
            cpp: {
                default: `// C++ Hello World
#include <iostream>
#include <string>

std::string greet(std::string name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << greet("World") << std::endl;
    return 0;
}`,
                fibonacci: `// C++ Fibonacci sequence
#include <iostream>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    std::cout << fibonacci(10) << std::endl; // 55
    return 0;
}`
            }
        };
        
        // Determine which example to use based on request
        let exampleType = 'default';
        if (lowerRequest.includes('fibonacci')) {
            exampleType = 'fibonacci';
        } else if (lowerRequest.includes('sort') || lowerRequest.includes('array')) {
            exampleType = 'sort';
        }
        
        return examples[language]?.[exampleType] || examples[language]?.default || null;
    }
    
    function getCodeExplanation(language, request) {
        const explanations = {
            javascript: "This JavaScript example demonstrates a common programming pattern. The code is ready to run in any JavaScript environment like a browser console or Node.js.",
            python: "This Python example shows idiomatic Python code. You can run this in any Python interpreter or save it to a .py file.",
            java: "This Java example follows standard Java conventions. Remember that Java requires the code to be in a file with the same name as the public class.",
            cpp: "This C++ example demonstrates basic C++ syntax. C++ code needs to be compiled before execution."
        };
        
        return explanations[language] || "This code example demonstrates a common pattern in the requested language.";
    }
    
    function getTechnicalExplanation(question) {
        const lowerQuestion = question.toLowerCase();
        
        if (lowerQuestion.includes('variable') || lowerQuestion.includes('var')) {
            return "A variable is a named storage location in a program's memory that holds data. In most languages, you declare variables with a specific type (like number, string) or with dynamic typing (like in JavaScript or Python).";
        }
        
        if (lowerQuestion.includes('function') || lowerQuestion.includes('method')) {
            return "A function is a reusable block of code that performs a specific task. Functions can accept parameters and return values. They help organize code and avoid repetition.";
        }
        
        if (lowerQuestion.includes('loop') || lowerQuestion.includes('for') || lowerQuestion.includes('while')) {
            return "Loops allow you to execute a block of code repeatedly. Common types are 'for' loops (when you know iterations in advance) and 'while' loops (when continuation depends on a condition).";
        }
        
        if (lowerQuestion.includes('object') || lowerQuestion.includes('class')) {
            return "Objects are instances of classes that encapsulate data (properties) and behavior (methods). Object-oriented programming (OOP) is a paradigm based on this concept.";
        }
        
        if (lowerQuestion.includes('array') || lowerQuestion.includes('list'))) {
            return "An array (or list) is a data structure that stores multiple values in a single variable. Elements are accessed by their index (position in the array).";
        }
        
        return "This appears to be a technical question. In a real implementation, I would analyze it and provide a detailed explanation. Try asking about specific programming concepts!";
    }
    
    // Helper functions
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function formatTextWithLinks(text) {
        // Simple URL detection and linking
        return text.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    }
});

// Global function for copy button
function copyToClipboard(button) {
    const codeBlock = button.previousElementSibling;
    if (!codeBlock) return;
    
    const range = document.createRange();
    range.selectNode(codeBlock);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    
    window.getSelection().removeAllRanges();
}
