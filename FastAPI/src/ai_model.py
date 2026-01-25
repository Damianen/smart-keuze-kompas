import os
import re
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


# Pad-locaties
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_CSV = os.path.join(BASE_DIR, "modeltraining.py", "cleaned_modules.csv")


_tfidf = None
_tfidf_matrix = None
_modules_df = None


def _load_artifacts():
	"""Laad TF-IDF vectorizer, matrix en dataset."""
	global _tfidf, _tfidf_matrix, _modules_df
	if _tfidf is None:
		_tfidf = joblib.load(os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl"))
	if _tfidf_matrix is None:
		_tfidf_matrix = joblib.load(os.path.join(MODELS_DIR, "tfidf_matrix.pkl"))
	if _modules_df is None:
		_modules_df = pd.read_csv(DATA_CSV)


# Nederlandse stopwoorden - moet synchroon zijn met train_model.py
NL_STOPWORDS = [
    'ik', 'je', 'jij', 'jou', 'wil', 'willen', 'wilt', 'zou', 'kunnen', 'kan', 'moet', 'moeten',
    'leren', 'leer', 'leert', 'studeren', 'studeer', 'studeert',
    'over', 'aan', 'bij', 'met', 'voor', 'naar', 'op', 'in', 'de', 'het', 'een',
    'ben', 'bent', 'is', 'zijn', 'was', 'waren', 'geweest',
    'hebben', 'heeft', 'had', 'hadden', 'gehad',
    'graag', 'meer', 'ook', 'wel', 'niet', 'maar', 'of', 'en', 'dat', 'die', 'dit',
    'worden', 'wordt', 'word', 'geworden',
    'mijn', 'me', 'mezelf', 'mijzelf',
    'deze', 'dit', 'die', 'dat',
    'wat', 'wanneer', 'waar', 'waarom', 'hoe', 'wie',
    'interesse', 'geïnteresseerd', 'weten', 'kennis', 'te', 'begrijpen',
    'werken', 'werk', 'werkt', 'gewerkt',
    'doen', 'doe', 'doet', 'gedaan',
    'maken', 'maak', 'maakt', 'gemaakt',
    'gaan', 'ga', 'gaat', 'gegaan',
    'komen', 'kom', 'komt', 'gekomen',
    'zien', 'zie', 'ziet', 'gezien',
    'geven', 'geef', 'geeft', 'gegeven',
    'vinden', 'vind', 'vindt', 'gevonden',
    'denken', 'denk', 'denkt', 'gedacht',
    'zeggen', 'zeg', 'zegt', 'gezegd',
    'veel', 'hele', 'erg', 'heel', 'zo', 'dus', 'dan', 'als', 'omdat', 'want',
    'enzo', 'enzovoort', 'etcetera', 'etc',
    'iets', 'iemand', 'ergens', 'altijd', 'nooit', 'soms', 'vaak', 'misschien',
    'ja', 'nee', 'nou', 'hoor', 'toch', 'gewoon', 'even', 'nog', 'al', 'hier', 'daar',
    'nu', 'straks', 'later', 'vandaag', 'morgen', 'gisteren',
    'worden', 'werd', 'werden',
    'door', 'zonder', 'vanaf', 'tot', 'om', 'rond', 'tussen', 'tijdens'
]

def _basic_clean(text: str) -> str:
	"""Simpel schoonmaken: lower, verwijder digits/punctuatie/extra spaties en filter stopwoorden."""
	t = (text or "").lower()
	t = re.sub(r"\d+", " ", t)
	t = re.sub(r"[^\w\s]", " ", t)
	t = re.sub(r"\s+", " ", t).strip()
	# Filter stopwoorden eruit
	words = t.split()
	words = [w for w in words if w not in NL_STOPWORDS]
	return " ".join(words)


def _normalize(arr: np.ndarray) -> np.ndarray:
	if arr.size == 0:
		return arr
	min_v = np.min(arr)
	max_v = np.max(arr)
	if max_v - min_v == 0:
		return np.zeros_like(arr)
	return (arr - min_v) / (max_v - min_v)


def recommend(student_text: str, limit: int = 5):
	

	# 4.1 Student Profile
	_load_artifacts()
	cleaned = _basic_clean(student_text)
	student_vec = _tfidf.transform([cleaned])

	# 4.2 NLP verwerken 
	print(f"Studentprofiel vector shape: {student_vec.shape}")
	print(f"TF-IDF matrix shape: {_tfidf_matrix.shape}")

	# 4.3 Similarity scores
	sim = cosine_similarity(student_vec, _tfidf_matrix)[0]
	print(f"\nSimilarity scores berekend voor {len(sim)} modules")
	print(f"Hoogste score: {sim.max():.4f}")
	print(f"Gemiddelde score: {sim.mean():.4f}")

	# Populariteit 
	if "popularity_score" in _modules_df.columns:
		pop = _modules_df["popularity_score"].fillna(0).astype(float).values
	else:
		pop = np.zeros(len(sim))
	pop_norm = _normalize(pop)

	# 4.4 Hybrid score 
	w_content = 0.8
	w_popularity = 0.2
	hybrid = w_content * sim + w_popularity * pop_norm

	k = max(1, int(limit))
	top_idx = np.argsort(hybrid)[-k:][::-1]

	feature_names = _tfidf.get_feature_names_out()
	student_dense = student_vec.toarray()[0]

	results = []
	for idx in top_idx:
		row = _modules_df.iloc[idx]
		module_vec = _tfidf_matrix[idx].toarray()[0]
		overlap = student_dense * module_vec

		
		nz = np.nonzero(overlap)[0]
		if nz.size > 0:
			ranked = nz[np.argsort(np.abs(overlap[nz]))[::-1]]
			top_terms = [feature_names[i] for i in ranked[:5]]
		else:
			top_terms = []

		
		if top_terms:
			# Gebruik alle termen uit top_terms
			if len(top_terms) == 1:
				terms_str = top_terms[0]
			elif len(top_terms) == 2:
				terms_str = f"{top_terms[0]} en {top_terms[1]}"
			else:
				terms_str = ", ".join(top_terms[:-1]) + f" en {top_terms[-1]}"
			reason_text = f"Deze module behandelt {terms_str} - onderwerpen die bij je interesses passen."
		else:
			reason_text = "Deze module past bij je profiel."

		results.append({
			"id": int(row.get("id", idx)),
			"name": row.get("name", "Unknown"),
			"level": row.get("level"),
			"location": row.get("location"),
			"estimated_difficulty": int(row.get("estimated_difficulty", 0)) if pd.notna(row.get("estimated_difficulty")) else None,
			"content_score": float(round(sim[idx], 4)),
			"popularity_score": float(round(pop_norm[idx], 4)),
			"hybrid_score": float(round(hybrid[idx], 4)),
			"reason_text": reason_text,
		})

	return results

