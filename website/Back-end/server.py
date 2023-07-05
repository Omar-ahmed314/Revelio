from flask import Flask, render_template, request
from flask_cors import CORS
from io import BytesIO
import cv2
import matplotlib.pyplot as plt
import numpy as np

# initialize the application
app = Flask(__name__)

# initialize cors
cors = CORS(app)

# initialize the video buffer
video_buffer = BytesIO(None)

# decode video
def decodeVideo(bytes_io):
    # Convert BytesIO to numpy array
    byte_array = np.frombuffer(bytes_io.getvalue(), dtype=np.uint8)

    # Decode the numpy array as a video
    video = cv2.imdecode(byte_array, cv2.IMREAD_UNCHANGED)

    return video

# play video
def playVideo(video):
    for frame in video:
        cv2.imshow('Frame', frame)
        cv2.waitKey(1)
    cv2.destroyAllWindows()

@app.route('/')
def index():
    return 'Hello World'

@app.route('/upload', methods=['POST'])
def upload():
    if request is not None:
        # video_buffer.join(request.data)
        # with open('newFile.mp4', 'ab') as file:
        #     file.write(request.data)
        video_buffer.write(request.data)
        
    return 'Successful Request'

@app.route('/analyze', methods=['GET'])
def analyze():
    if request is not None:
        video = decodeVideo(video_buffer)
        playVideo(video)
        
    return 'Successful Analyze'

if __name__ == '__main__':
    app.run(port=8080)