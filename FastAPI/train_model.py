import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Load data
df = pd.read_csv('modeltraining.py/cleaned_modules.csv')

# Nederlandse stopwoorden
NL_STOPWORDS = [
    'ik', 'je', 'wil', 'willen', 'wilt', 'zou', 'kunnen', 'kan', 'moet', 'moeten',
    'leren', 'leer', 'leert', 'studeren', 'studeer', 'studeert',
    'over', 'aan', 'bij', 'met', 'voor', 'naar', 'op', 'in', 'de', 'het', 'een',
    'ben', 'bent', 'is', 'zijn', 'was', 'waren', 'geweest',
    'hebben', 'heeft', 'had', 'hadden', 'gehad',
    'graag', 'meer', 'ook', 'wel', 'niet', 'maar', 'of', 'en', 'dat', 'die', 'dit',
    'worden', 'wordt', 'word', 'geworden',
    'mijn', 'me', 'mezelf', 'mijzelf',
    'deze', 'dit', 'die', 'dat',
    'wat', 'wanneer', 'waar', 'waarom', 'hoe', 'wie',
    'interesse', 'geïnteresseerd', 'weten', 'kennis', 'te', 'begrijpen'
]

# Train TF-IDF met stopwoorden
tfidf = TfidfVectorizer(
    max_features=300,
    min_df=2,
    max_df=0.8,
    ngram_range=(1, 2),
    sublinear_tf=True,
    stop_words=NL_STOPWORDS
)
tfidf_matrix = tfidf.fit_transform(df['job_text'])

# Save models
import os
os.makedirs('models', exist_ok=True)

joblib.dump(tfidf, 'models/tfidf_vectorizer.pkl')
joblib.dump(tfidf_matrix, 'models/tfidf_matrix.pkl')

print('Complete')
