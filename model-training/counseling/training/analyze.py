import pandas as pd
import numpy as np

def analyze_value_ranges(csv_path):
    """
    Analyzes the range of values in each numeric column of a CSV file.
    
    Parameters:
    csv_path (str): Path to the CSV file
    
    Returns:
    dict: Dictionary containing range information for each numeric column
    """
    # Read the CSV file with headers
    df = pd.read_csv(csv_path)
    
    # Initialize dictionary to store results
    ranges = {}
    
    # Analyze each column
    for column in df.columns:
        try:
            # Try to convert column to numeric, skip if not possible
            numeric_data = pd.to_numeric(df[column], errors='coerce')
            
            # Check if column has any numeric values
            if not numeric_data.isna().all():
                # Get statistics for numeric data
                stats = {
                    'min': numeric_data.min(),
                    'max': numeric_data.max(),
                    'mean': numeric_data.mean(),
                    'median': numeric_data.median(),
                    'unique_values': sorted(numeric_data.dropna().unique().tolist()),
                    'value_count': len(numeric_data.dropna().unique()),
                }
                ranges[column] = stats
                
        except Exception as e:
            print(f"Error processing column {column}: {str(e)}")
            continue
    
    return ranges

def print_ranges(ranges):
    """
    Prints the range analysis in a formatted way.
    
    Parameters:
    ranges (dict): Dictionary containing range information
    """
    print("\nValue Ranges Analysis:")
    print("=" * 50)
    
    for column, stats in ranges.items():
        print(f"\nColumn: {column}")
        print("-" * 30)
        print(f"Minimum value: {stats['min']}")
        print(f"Maximum value: {stats['max']}")
        print(f"Mean value: {stats['mean']:.2f}")
        print(f"Median value: {stats['median']:.2f}")
        print(f"Number of unique values: {stats['value_count']}")
        print("Unique values:", stats['unique_values'])

if __name__ == "__main__":
    try:
        # Replace with your CSV file path
        csv_path = r'..\datasets\studentstress\updated-stressLevelDataset.csv'
        
        # Analyze the ranges
        ranges = analyze_value_ranges(csv_path)
        
        # Print the results
        print_ranges(ranges)
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")