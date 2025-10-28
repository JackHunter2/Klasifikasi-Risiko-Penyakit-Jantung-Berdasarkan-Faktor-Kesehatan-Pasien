// Heart Disease Classifier - Interactive Features
class HeartDiseaseApp {
    constructor() {
        this.form = document.getElementById('heartForm');
        this.loadingOverlay = null;
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.setupFormValidation();
        this.setupFormInteractions();
        this.setupAnimations();
        this.setupProgressIndicator();
    }

    createLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner"></div>
                <div class="loading-text">Menganalisis data kesehatan...</div>
            </div>
        `;
        document.body.appendChild(this.loadingOverlay);
    }

    showLoading() {
        this.loadingOverlay.classList.add('show');
    }

    hideLoading() {
        this.loadingOverlay.classList.remove('show');
    }

    setupFormValidation() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                this.showValidationErrors();
            } else {
                this.showLoading();
                // Simulate processing time
                setTimeout(() => {
                    this.hideLoading();
                }, 2000);
            }
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${this.getFieldLabel(fieldName)} harus diisi`;
            isValid = false;
        } else if (value) {
            // Specific validations
            switch (fieldName) {
                case 'age':
                    const age = parseInt(value);
                    if (isNaN(age) || age < 1 || age > 120) {
                        errorMessage = 'Usia harus antara 1-120 tahun';
                        isValid = false;
                    }
                    break;
                case 'trestbps':
                    const trestbps = parseInt(value);
                    if (isNaN(trestbps) || trestbps < 50 || trestbps > 300) {
                        errorMessage = 'Tekanan darah harus antara 50-300 mmHg';
                        isValid = false;
                    }
                    break;
                case 'chol':
                    const chol = parseInt(value);
                    if (isNaN(chol) || chol < 100 || chol > 600) {
                        errorMessage = 'Kolesterol harus antara 100-600 mg/dl';
                        isValid = false;
                    }
                    break;
                case 'thalach':
                    const thalach = parseInt(value);
                    if (isNaN(thalach) || thalach < 60 || thalach > 220) {
                        errorMessage = 'Detak jantung harus antara 60-220 bpm';
                        isValid = false;
                    }
                    break;
                case 'oldpeak':
                    const oldpeak = parseFloat(value);
                    if (isNaN(oldpeak) || oldpeak < 0 || oldpeak > 10) {
                        errorMessage = 'Depresi ST harus antara 0-10';
                        isValid = false;
                    }
                    break;
                case 'sex':
                case 'exang':
                case 'fbs':
                    if (!['0', '1'].includes(value)) {
                        errorMessage = 'Pilih opsi yang valid';
                        isValid = false;
                    }
                    break;
                case 'cp':
                    if (!['0', '1', '2', '3'].includes(value)) {
                        errorMessage = 'Pilih jenis nyeri yang valid';
                        isValid = false;
                    }
                    break;
                case 'slope':
                case 'restecg':
                    if (!['0', '1', '2'].includes(value)) {
                        errorMessage = 'Pilih opsi yang valid';
                        isValid = false;
                    }
                    break;
                case 'ca':
                    if (!['0', '1', '2', '3'].includes(value)) {
                        errorMessage = 'Pilih jumlah yang valid';
                        isValid = false;
                    }
                    break;
                case 'thal':
                    if (!['0', '1', '2'].includes(value)) {
                        errorMessage = 'Pilih opsi yang valid';
                        isValid = false;
                    }
                    break;
            }
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    getFieldLabel(fieldName) {
        const labels = {
            'age': 'Usia',
            'sex': 'Jenis Kelamin',
            'cp': 'Jenis Nyeri Dada',
            'trestbps': 'Tekanan Darah Istirahat',
            'chol': 'Kolesterol Serum',
            'fbs': 'Gula Darah Puasa',
            'restecg': 'Resting ECG',
            'thalach': 'Detak Jantung Maksimal',
            'exang': 'Angina Induksi Latihan',
            'oldpeak': 'Depresi ST',
            'slope': 'Kemiringan Segmen ST',
            'ca': 'Jumlah Pembuluh Darah Utama',
            'thal': 'Thalassemia'
        };
        return labels[fieldName] || fieldName;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#e74c3c';
        field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-text';
        errorDiv.textContent = message;
        errorDiv.style.animation = 'fadeIn 0.3s ease-in';
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '#e1e5e9';
        field.style.boxShadow = '';
        
        const existingError = field.parentNode.querySelector('.error-text');
        if (existingError) {
            existingError.remove();
        }
    }

    showValidationErrors() {
        const firstError = document.querySelector('.error-text');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    setupFormInteractions() {
        // Add focus effects
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
                this.updateProgress();
            });

            input.addEventListener('blur', () => {
                input.parentNode.classList.remove('focused');
                this.updateProgress();
            });
        });

        // Add typing effects for number inputs
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.animateTyping(e.target);
                this.updateProgress();
            });
        });

        // Add change effects for select inputs
        const selectInputs = document.querySelectorAll('select');
        selectInputs.forEach(select => {
            select.addEventListener('change', () => {
                this.animateTyping(select);
                this.updateProgress();
            });
        });

        // Add tooltip functionality
        this.setupTooltips();
    }

    setupTooltips() {
        const tooltips = {
            'age': 'Usia pasien dalam tahun. Risiko penyakit jantung meningkat seiring bertambahnya usia.',
            'sex': 'Jenis kelamin pasien. Laki-laki memiliki risiko lebih tinggi terkena penyakit jantung.',
            'cp': 'Jenis nyeri dada yang dialami pasien. Nyeri tipikal sering dikaitkan dengan penyakit jantung.',
            'trestbps': 'Tekanan darah sistolik saat istirahat. Tekanan darah tinggi meningkatkan risiko penyakit jantung.',
            'chol': 'Kadar kolesterol total dalam darah. Kolesterol tinggi dapat menyumbat pembuluh darah.',
            'fbs': 'Gula darah puasa. Diabetes meningkatkan risiko penyakit jantung secara signifikan.',
            'restecg': 'Hasil elektrokardiogram saat istirahat. Kelainan dapat mengindikasikan masalah jantung.',
            'thalach': 'Detak jantung maksimal yang dicapai. Detak jantung abnormal dapat mengindikasikan masalah.',
            'exang': 'Apakah pasien mengalami nyeri dada saat berolahraga. Gejala angina dapat mengindikasikan penyakit jantung.',
            'oldpeak': 'Depresi segmen ST pada EKG. Nilai tinggi mengindikasikan kerusakan otot jantung.',
            'slope': 'Kemiringan segmen ST pada EKG. Kemiringan menurun mengindikasikan masalah jantung.',
            'ca': 'Jumlah pembuluh darah utama yang tersumbat. Semakin banyak, semakin tinggi risikonya.',
            'thal': 'Hasil tes thalassemia. Kelainan darah dapat mempengaruhi kesehatan jantung.'
        };

        Object.keys(tooltips).forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltips[fieldName];
                tooltip.style.cssText = `
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    max-width: 250px;
                    word-wrap: break-word;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-bottom: 5px;
                `;

                field.parentNode.style.position = 'relative';
                field.parentNode.appendChild(tooltip);

                field.addEventListener('mouseenter', () => {
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                });

                field.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                });
            }
        });
    }

    animateTyping(field) {
        field.style.transform = 'scale(1.02)';
        setTimeout(() => {
            field.style.transform = 'scale(1)';
        }, 150);
    }

    setupAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        // Observe form groups
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.animationDelay = `${index * 0.1}s`;
            observer.observe(group);
        });

        // Observe input items on result page
        const inputItems = document.querySelectorAll('.input-item');
        inputItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.animationDelay = `${index * 0.1}s`;
            observer.observe(item);
        });
    }

    setupProgressIndicator() {
        // Add progress indicator for form completion
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-steps';
        progressContainer.innerHTML = `
            <div class="step active">1</div>
            <div class="step">2</div>
            <div class="step">3</div>
            <div class="step">4</div>
        `;

        if (this.form) {
            this.form.insertBefore(progressContainer, this.form.firstChild);
            this.updateProgress();
        }
    }

    updateProgress() {
        const requiredFields = this.form.querySelectorAll('input[required], select[required]');
        const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
        const progress = (filledFields.length / requiredFields.length) * 100;
        
        const steps = document.querySelectorAll('.step');
        const completedSteps = Math.floor(progress / 25);
        
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < completedSteps) {
                step.classList.add('completed');
            } else if (index === completedSteps) {
                step.classList.add('active');
            }
        });
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#667eea'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Confidence bar animation for result page
function animateConfidenceBar() {
    const confidenceFill = document.querySelector('.confidence-fill');
    if (confidenceFill) {
        const width = confidenceFill.style.width;
        confidenceFill.style.width = '0%';
        setTimeout(() => {
            confidenceFill.style.width = width;
        }, 500);
    }
}

// Print functionality
function printResults() {
    window.print();
}

// Sample data functionality
function fillSampleData() {
    const sampleData = {
        // Data contoh untuk pasien berisiko tinggi
        'high_risk': {
            'age': '65',
            'sex': '1',
            'cp': '3',
            'trestbps': '180',
            'chol': '350',
            'fbs': '1',
            'restecg': '2',
            'thalach': '120',
            'exang': '1',
            'oldpeak': '3.5',
            'slope': '0',
            'ca': '3',
            'thal': '2'
        },
        // Data contoh untuk pasien berisiko rendah
        'low_risk': {
            'age': '35',
            'sex': '0',
            'cp': '0',
            'trestbps': '110',
            'chol': '180',
            'fbs': '0',
            'restecg': '0',
            'thalach': '180',
            'exang': '0',
            'oldpeak': '0.5',
            'slope': '2',
            'ca': '0',
            'thal': '0'
        },
        // Data contoh untuk pasien berisiko sedang
        'medium_risk': {
            'age': '55',
            'sex': '1',
            'cp': '1',
            'trestbps': '140',
            'chol': '250',
            'fbs': '0',
            'restecg': '1',
            'thalach': '150',
            'exang': '0',
            'oldpeak': '1.5',
            'slope': '1',
            'ca': '1',
            'thal': '1'
        }
    };

    // Tampilkan dialog pilihan
    const choice = confirm(
        'Pilih jenis data contoh:\n\n' +
        'OK = Data Berisiko Tinggi (65 tahun, pria, gejala berat)\n' +
        'Cancel = Data Berisiko Rendah (35 tahun, wanita, sehat)'
    );

    const dataType = choice ? 'high_risk' : 'low_risk';
    const data = sampleData[dataType];

    // Isi form dengan data contoh
    Object.keys(data).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.value = data[fieldName];
            
            // Trigger change event untuk update progress
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Animasi saat mengisi
            field.style.transform = 'scale(1.05)';
            field.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                field.style.transform = 'scale(1)';
                field.style.backgroundColor = '';
            }, 300);
        }
    });

    // Update progress indicator
    setTimeout(() => {
        const app = new HeartDiseaseApp();
        app.updateProgress();
    }, 100);

    // Tampilkan notifikasi
    showNotification(
        `Data contoh ${choice ? 'berisiko tinggi' : 'berisiko rendah'} telah diisi!`, 
        'success'
    );

    // Scroll ke atas form
    document.querySelector('.form-container').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Share functionality
function shareResults() {
    if (navigator.share) {
        const result = document.querySelector('.prediction-title').textContent;
        const confidence = document.querySelector('.confidence-text')?.textContent || '';
        
        navigator.share({
            title: 'Hasil Prediksi Risiko Penyakit Jantung',
            text: `Hasil prediksi: ${result} ${confidence}`,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback for browsers that don't support Web Share API
        const result = document.querySelector('.prediction-title').textContent;
        const confidence = document.querySelector('.confidence-text')?.textContent || '';
        const text = `Hasil Prediksi Risiko Penyakit Jantung:\n${result}\n${confidence}\n\nDapatkan prediksi di: ${window.location.origin}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Hasil telah disalin ke clipboard!', 'success');
            }).catch(() => {
                showNotification('Gagal menyalin hasil', 'error');
            });
        } else {
            // Fallback: show text in prompt
            prompt('Salin teks berikut untuk membagikan hasil:', text);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HeartDiseaseApp();
    
    // Animate confidence bar on result page
    animateConfidenceBar();
    
    // Add print button functionality
    const printBtn = document.querySelector('button[onclick="window.print()"]');
    if (printBtn) {
        printBtn.addEventListener('click', printResults);
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .form-group.focused label {
        color: #667eea;
        transform: translateY(-2px);
    }
    
    .notification {
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    }
`;
document.head.appendChild(style);
