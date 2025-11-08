# import torch
# from transformers import RobertaTokenizer, RobertaModel
# import torch.nn as nn
# import os

# # Define the model architecture
# class RobertaRegressor(nn.Module):
#     def __init__(self, model_name="roberta-base", dropout_rate=0.1):
#         super().__init__()
#         self.roberta = RobertaModel.from_pretrained(model_name)
#         hidden_size = self.roberta.config.hidden_size

#         self.regressor = nn.Sequential(
#             nn.Linear(hidden_size, 512),
#             nn.GELU(),
#             nn.Dropout(dropout_rate),
#             nn.Linear(512, 128),
#             nn.GELU(),
#             nn.Dropout(dropout_rate),
#             nn.Linear(128, 1)
#         )

#     def forward(self, input_ids, attention_mask):
#         outputs = self.roberta(input_ids=input_ids, attention_mask=attention_mask)
#         sequence_output = outputs.last_hidden_state[:, 0, :]
#         return self.regressor(sequence_output)

# def load_model(model_path):
#     if not os.path.exists(model_path):
#         raise FileNotFoundError(f"Model file '{model_path}' not found.")
    
#     device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
#     model = RobertaRegressor()
#     checkpoint = torch.load(model_path, map_location=device)
    
#     state_dict = checkpoint.get("model_state_dict", checkpoint)
#     model.load_state_dict(state_dict)
#     model.to(device)
#     model.eval()
#     return model, device

# def analyze_text(text, model, tokenizer, device):
#     encoding = tokenizer(
#         text,
#         padding="max_length",
#         truncation=True,
#         max_length=128,
#         return_tensors="pt"
#     )
    
#     input_ids = encoding["input_ids"].to(device)
#     attention_mask = encoding["attention_mask"].to(device)

#     with torch.no_grad():
#         output = model(input_ids, attention_mask=attention_mask)

#     score = output.cpu().numpy()[0][0]
#     return score

# # def main():
# #     model_path = "best_roberta_model.pth"  # Ensure this path is correct
# #     tokenizer_path = "./roberta_tokenizer"  # Adjust this path to your local tokenizer directory

# #     if not os.path.exists(tokenizer_path):
# #         raise FileNotFoundError(f"Tokenizer path '{tokenizer_path}' not found.")

# #     tokenizer = RobertaTokenizer.from_pretrained(tokenizer_path)
# #     model, device = load_model(model_path)

# #     while True:
# #         text = input("\nEnter text to analyze (or 'quit' to exit): ")
# #         if text.lower() == 'quit':
# #             break

# #         score = analyze_text(text, mo
