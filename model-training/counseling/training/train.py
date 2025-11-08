import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_counseling_model(data_path):
    """
    Train a model to predict counseling type based on student metrics.
    
    Parameters:
    data_path (str): Path to the CSV file containing the dataset
    
    Returns:
    tuple: Trained model, scaler, and training metrics
    """
    try:
        # Load data with headers
        df = pd.read_csv(data_path)
        
        # Verify the data loaded correctly
        print("Data shape:", df.shape)
        print("\nColumns in dataset:", df.columns.tolist())
        
        # Separate features and target
        X = df.drop('counseling_type', axis=1)
        y = df['counseling_type']
        
        # Convert features to numeric, replacing any non-numeric values with NaN
        X = X.apply(pd.to_numeric, errors='coerce')
        
        # Check for any missing values after conversion
        if X.isnull().any().any():
            print("\nWarning: Found missing values after numeric conversion")
            print("Missing values per column:")
            print(X.isnull().sum())
            
            # Fill missing values with column means
            X = X.fillna(X.mean())
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train the model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train_scaled, y_train)
        
        # Save feature names for later use
        feature_names = X.columns.tolist()
        
        # Evaluate the model
        y_pred = model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred)
        
        return model, scaler, feature_names, accuracy, report
        
    except Exception as e:
        print(f"Error during model training: {str(e)}")
        raise

def save_model(model, scaler, feature_names, output_dir='model'):
    """
    Save the trained model and scaler to disk.
    
    Parameters:
    model: Trained RandomForestClassifier
    scaler: Fitted StandardScaler
    feature_names: List of feature names
    output_dir: Directory to save the model files
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Save model, scaler, and feature names
    joblib.dump(model, os.path.join(output_dir, 'counseling_model.joblib'))
    joblib.dump(scaler, os.path.join(output_dir, 'scaler.joblib'))
    joblib.dump(feature_names, os.path.join(output_dir, 'feature_names.joblib'))
    
    print(f"Model saved in {output_dir} directory")

def load_model(model_dir='model'):
    """
    Load the trained model and scaler from disk.
    
    Parameters:
    model_dir: Directory containing the model files
    
    Returns:
    tuple: model, scaler, and feature names
    """
    model = joblib.load(os.path.join(model_dir, 'counseling_model.joblib'))
    scaler = joblib.load(os.path.join(model_dir, 'scaler.joblib'))
    feature_names = joblib.load(os.path.join(model_dir, 'feature_names.joblib'))
    
    return model, scaler, feature_names

def predict_counseling_type(model, scaler, input_data):
    """
    Predict counseling type for new input data.
    
    Parameters:
    model: Trained RandomForestClassifier
    scaler: Fitted StandardScaler
    input_data (list): List of input features
    
    Returns:
    str: Predicted counseling type
    """
    try:
        # Convert input to numpy array and reshape
        input_array = np.array(input_data).reshape(1, -1)
        
        # Scale the input
        input_scaled = scaler.transform(input_array)
        
        # Make prediction
        prediction = model.predict(input_scaled)
        
        return prediction[0]
        
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        raise

# Example usage for training and saving the model
if __name__ == "__main__":
    # Train the model
    model, scaler, feature_names, accuracy, report = train_counseling_model(
        r'..\datasets\studentstress\updated-stressLevelDataset.csv'
    )
    print(f"\nModel Accuracy: {accuracy:.2f}")
    print("\nClassification Report:")
    print(report)
    
    # Save the model
    save_model(model, scaler, feature_names)