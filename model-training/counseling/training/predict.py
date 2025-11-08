import joblib
import os
import numpy as np

def predict_with_saved_model(input_data, model_dir='model'):
    """
    Load the saved model and make predictions with probabilities
    
    Parameters:
    input_data (list): List of input features
    model_dir (str): Directory containing the saved model
    
    Returns:
    tuple: Predicted counseling type and probabilities dictionary
    """
    try:
        # Load the model and scaler
        model = joblib.load(os.path.join(model_dir, './counseling_model.joblib'))
        scaler = joblib.load(os.path.join(model_dir, './scaler.joblib'))
        feature_names = joblib.load(os.path.join(model_dir, './feature_names.joblib'))
        
        # Verify input data length matches feature count
        if len(input_data) != len(feature_names):
            raise ValueError(f"Expected {len(feature_names)} features but got {len(input_data)}")
        
        # Convert input to numpy array and reshape
        input_array = np.array(input_data).reshape(1, -1)
        
        # Scale the input
        input_scaled = scaler.transform(input_array)
        
        # Get prediction and probabilities
        prediction = model.predict(input_array)[0]
        probabilities = model.predict_proba(input_array)[0]
        
        # Create a dictionary of counseling types and their probabilities
        counseling_types = model.classes_
        probability_dict = {ctype: prob for ctype, prob in zip(counseling_types, probabilities)}
        
        return prediction, probability_dict
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        raise

# Example usage
if __name__ == "__main__":
    # Example input data
    sample_input = [9,23,1,24,4,3,1,0,1,2,4,3,1,2,3,3,0,1,0,1,2]
    
    # Make prediction
    prediction, probabilities = predict_with_saved_model(sample_input)
    
    print("\nPrediction Results:")
    print("=" * 50)
    print(f"\nPredicted Counseling Type: {prediction}")
    print("\nProbability for each counseling type:")
    print("-" * 40)
    
    # Sort probabilities by value in descending order
    sorted_probs = dict(sorted(probabilities.items(), key=lambda x: x[1], reverse=True))
    
    # Print probabilities as percentages
    for counseling_type, probability in sorted_probs.items():
        percentage = probability * 100
        print(f"{counseling_type}: {percentage:.2f}%")