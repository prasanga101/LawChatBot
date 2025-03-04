from flask import Flask, render_template, request, jsonify
from transformers import AutoTokenizer, AutoModelForCausalLM

app = Flask(__name__)

# Initialize the GPT model
tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2")
model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2")

# Context for the chatbot
context = "A legal notary, who writes legal documents for clients and Explains it to clients in a very simple manner."

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.form['user_input']
    
    # Combine the context and user input
    prompt = context + "\nUser: " + user_input + "\nAI:"
    
    # Tokenize and generate a response
    inputs = tokenizer.encode(prompt, return_tensors="pt")
    outputs = model.generate(inputs, max_length=500, pad_token_id=tokenizer.eos_token_id, no_repeat_ngram_size=2)
    
    # Decode and clean the response
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    response = response.replace(context + "\nUser: " + user_input + "\nAI:", "").strip()
    
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
