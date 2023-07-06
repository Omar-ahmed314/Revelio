from flask import Flask, render_template, request
from flask_cors import CORS
from io import BytesIO
import cv2
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np

# initialize the application
app = Flask(__name__)

# initialize cors
cors = CORS(app)

@app.route('/')
def index():
    return 'Hello World'

@app.route('/upload', methods=['POST'])
def upload():
    if request is not None:
        with open(request.headers['File-Name'], 'ab') as file:
            file.write(request.data)
        
    return 'Successful Request'

@app.route('/analyze', methods=['GET'])
def analyze():
    if request is not None:
        pass
        
    return 'Successful Analyze'

if __name__ == '__main__':
    app.run(port=8080)