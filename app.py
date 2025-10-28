# app.py
from flask import Flask, render_template, request
import joblib
import pandas as pd

app = Flask(__name__)

# Load saved pipeline
pipeline = joblib.load('dt_heart_pipeline.joblib')
preprocessor = pipeline['preprocessor']
model = pipeline['model']

# If you want to display form fields in HTML, you need the names of features
# We'll assume original dataset had these columns (adjust if berbeda)
FEATURES = ['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal']

@app.route('/')
def home():
    return render_template('index.html', features=FEATURES)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Collect inputs from form (all values are strings)
        data = {}
        errors = {}
        
        # Validasi input
        for f in FEATURES:
            value = request.form.get(f)
            if not value or value.strip() == '':
                errors[f] = f"Field {f} harus diisi"
            else:
                data[f] = value.strip()
        
        # Validasi khusus untuk setiap field
        if 'age' in data:
            try:
                age = int(data['age'])
                if age < 1 or age > 120:
                    errors['age'] = "Usia harus antara 1-120 tahun"
            except ValueError:
                errors['age'] = "Usia harus berupa angka"
        
        if 'sex' in data:
            if data['sex'] not in ['0', '1']:
                errors['sex'] = "Jenis kelamin harus 0 (Perempuan) atau 1 (Laki-laki)"
        
        if 'cp' in data:
            if data['cp'] not in ['0', '1', '2', '3']:
                errors['cp'] = "Jenis nyeri dada harus 0-3"
        
        if 'trestbps' in data:
            try:
                trestbps = int(data['trestbps'])
                if trestbps < 50 or trestbps > 300:
                    errors['trestbps'] = "Tekanan darah harus antara 50-300 mmHg"
            except ValueError:
                errors['trestbps'] = "Tekanan darah harus berupa angka"
        
        if 'chol' in data:
            try:
                chol = int(data['chol'])
                if chol < 100 or chol > 600:
                    errors['chol'] = "Kolesterol harus antara 100-600 mg/dl"
            except ValueError:
                errors['chol'] = "Kolesterol harus berupa angka"

        if 'fbs' in data:
            if data['fbs'] not in ['0', '1']:
                errors['fbs'] = "Gula darah puasa harus 0 (<=120 mg/dl) atau 1 (>120 mg/dl)"

        if 'restecg' in data:
            if data['restecg'] not in ['0', '1', '2']:
                errors['restecg'] = "Resting ECG harus 0-2"
        
        if 'thalach' in data:
            try:
                thalach = int(data['thalach'])
                if thalach < 60 or thalach > 220:
                    errors['thalach'] = "Detak jantung harus antara 60-220 bpm"
            except ValueError:
                errors['thalach'] = "Detak jantung harus berupa angka"
        
        if 'exang' in data:
            if data['exang'] not in ['0', '1']:
                errors['exang'] = "Angina induksi latihan harus 0 (Tidak) atau 1 (Ya)"
        
        if 'oldpeak' in data:
            try:
                oldpeak = float(data['oldpeak'])
                if oldpeak < 0 or oldpeak > 10:
                    errors['oldpeak'] = "Depresi ST harus antara 0-10"
            except ValueError:
                errors['oldpeak'] = "Depresi ST harus berupa angka"
        
        if 'slope' in data:
            if data['slope'] not in ['0', '1', '2']:
                errors['slope'] = "Kemiringan segmen ST harus 0-2"
        
        if 'ca' in data:
            if data['ca'] not in ['0', '1', '2', '3']:
                errors['ca'] = "Jumlah pembuluh darah utama harus 0-3"
        
        if 'thal' in data:
            if data['thal'] not in ['0', '1', '2']:
                errors['thal'] = "Thalassemia harus 0-2"
        
        # Jika ada error, kembalikan ke form dengan pesan error
        if errors:
            return render_template('index.html', features=FEATURES, errors=errors, inputs=data)
        
        # Convert to DataFrame
        X = pd.DataFrame([data])
        
        # Convert data types (attempt numeric conversion where possible)
        for col in X.columns:
            try:
                X[col] = pd.to_numeric(X[col])
            except:
                pass
        
        # Preprocess then predict
        X_trans = preprocessor.transform(X)
        pred = model.predict(X_trans)[0]
        proba = model.predict_proba(X_trans)[0].max() if hasattr(model, 'predict_proba') else None
        result = 'Berisiko (1)' if pred==1 else 'Tidak Berisiko (0)'
        
        # Debug: print prediction details
        print(f"Prediction: {pred}, Probability: {proba}, Result: {result}")
        
        return render_template('result.html', result=result, proba=proba, inputs=data)
        
    except Exception as e:
        # Handle unexpected errors
        error_msg = f"Terjadi kesalahan: {str(e)}"
        return render_template('index.html', features=FEATURES, errors={'general': error_msg})

if __name__ == '__main__':
    app.run(debug=True)
