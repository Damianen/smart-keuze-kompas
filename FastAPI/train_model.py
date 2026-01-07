import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Load data
df = pd.read_csv('modeltraining.py/cleaned_modules.csv')

# Train TF-IDF
tfidf = TfidfVectorizer(
    max_features=300,
    min_df=2,
    max_df=0.8,
    ngram_range=(1, 2),
    sublinear_tf=True
)
tfidf_matrix = tfidf.fit_transform(df['job_text'])

# Save models
import os
os.makedirs('models', exist_ok=True)

joblib.dump(tfidf, 'models/tfidf_vectorizer.pkl')
joblib.dump(tfidf_matrix, 'models/tfidf_matrix.pkl')

print('Complete')
