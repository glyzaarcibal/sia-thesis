# from .inference import load_model, analyze_text
# from transformers import RobertaTokenizer

# # Load model and tokenizer
# model_path = "best_roberta_model.pth"
# tokenizer = RobertaTokenizer.from_pretrained("roberta_tokenizer")
# model, device = load_model(model_path)

# # Analyze text
# def sentiment_analysis(text_input):
#     text = text_input
#     score = analyze_text(text, model, tokenizer, device)
#     print(f"Anxiety Score: {score:.2f}")

#     return score