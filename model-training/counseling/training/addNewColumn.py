import pandas as pd

# Load the dataset
df = pd.read_csv(r'..\datasets\studentstress\StressLevelDataset.csv')

# Add the 'counseling_type' column with default empty values
df['counseling_type'] = ''

# Define the function to assign counseling type based on criteria
def assign_counseling_type(row):
    # Therapy Counseling
    if row['stress_level'] >= 4 and row['sleep_quality'] <= 2 and row['anxiety_level'] >= 4:
        return 'Therapy'
    
    # School Counseling
    elif row['stress_level'] <= 3 and row['academic_performance'] >= 3 and row['social_support'] >= 3:
        return 'School Counseling'
    
    # Family Counseling
    elif row['stress_level'] >= 4 and row['mental_health_history'] == 1 and row['self_esteem'] <= 2:
        return 'Family Counseling'
    
    # Career Counseling
    elif row['future_career_concerns'] >= 4 and row['academic_performance'] <= 3 and row['study_load'] >= 3:
        return 'Career Counseling'
    
    # Stress Management Counseling
    elif row['stress_level'] >= 4 and row['headache'] >= 3 and row['sleep_quality'] <= 2:
        return 'Stress Management Counseling'
    
    # Social Support Counseling
    elif row['social_support'] <= 2 and row['peer_pressure'] >= 4:
        return 'Social Support Counseling'
    
    # Health and Wellness Counseling
    elif row['stress_level'] <= 3 and row['headache'] >= 3 and row['sleep_quality'] <= 2:
        return 'Health and Wellness Counseling'
    
    # Extracurricular Engagement Counseling
    elif row['extracurricular_activities'] <= 2 and row['peer_pressure'] >= 3 and row['study_load'] >= 3:
        return 'Extracurricular Engagement Counseling'
    
    # Bullying Intervention Counseling
    elif row['bullying'] >= 4 and row['social_support'] <= 2:
        return 'Bullying Intervention Counseling'
    
    # Academic Achievement Counseling
    elif row['stress_level'] <= 3 and row['academic_performance'] >= 4 and row['study_load'] >= 3:
        return 'Academic Achievement Counseling'
    
    # General Counseling (fallback for any case that doesn't fit)
    else:
        return 'General Counseling'

# Apply the function to assign the counseling type to each row
df['counseling_type'] = df.apply(assign_counseling_type, axis=1)

# Save the updated dataset to a new CSV file
df.to_csv('updated_dataset.csv', index=False)

print("Counseling types have been added and saved in 'updated_dataset.csv'.")
