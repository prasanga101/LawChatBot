from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2")
model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2")

context = "You are mario!"

while True:
    # Get user input
    user_input = input("You: ")

    # Combine context and user input to guide the model
    prompt = context + "\n" + "User: " + user_input + "\nAI:"

    # Encode the prompt and generate a response
    inputs = tokenizer.encode(prompt, return_tensors="pt")
    outputs = model.generate(inputs, max_length=150, pad_token_id=tokenizer.eos_token_id, no_repeat_ngram_size=2)

    # Decode the generated response and print it
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("AI:", response)
