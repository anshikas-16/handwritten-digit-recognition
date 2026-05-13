from flask import Flask, render_template, request, jsonify
import numpy as np
import base64
from PIL import Image, ImageOps
import io
import tensorflow as tf

app = Flask(__name__)
model = tf.keras.models.load_model('model/mnist_cnn.keras')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    image_data = data['image'].split(',')[1]
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes)).convert('L')
    image = ImageOps.invert(image)
    image = image.resize((28, 28))
    image_array = np.array(image).astype('float32') / 255.0
    image_array = image_array.reshape(1, 28, 28, 1)
    prediction = model.predict(image_array)
    digit = int(np.argmax(prediction))
    confidence = float(np.max(prediction)) * 100
    return jsonify({'digit': digit, 'confidence': round(confidence, 2)})

if __name__ == '__main__':
    app.run(debug=True)