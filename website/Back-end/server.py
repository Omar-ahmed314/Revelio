from flask import Flask, render_template, request
from flask_cors import CORS
from io import BytesIO
import cv2

# initialize the application
app = Flask(__name__)

# initialize cors
cors = CORS(app)

# initialize the video buffer
video_buffer = ''

@app.route('/')
def index():
    return 'Hello World'

@app.route('/upload', methods=['POST'])
def upload():
    if request is not None:
        video_buffer.join(request.data)
        # print(request.data)
    video_stream = BytesIO(video_buffer)

    cap = cv2.VideoCapture(video_stream)
    return 'Successful Request'

if __name__ == '__main__':
    app.run(port=3000)