import pickle
import numpy as np
from Feature_Extraction import *

class FDA:
    
    def __init__(self):
        self.model_path = '../Models'
        
        with open(self.model_path + '/deepfake_model.pkl', 'rb') as file:
            self.deepfake_model = pickle.load(file)

        with open(self.model_path + '/face2face_model.pkl', 'rb') as file:
            self.face2face_model = pickle.load(file)
        
        with open(self.model_path + '/faceswap_model.pkl', 'rb') as file:
            self.faceswap_model = pickle.load(file)

        with open(self.model_path + '/neuraltextures_model.pkl', 'rb') as file:
            self.neuraltextures_model = pickle.load(file)

    def predict(self, video_capture):
        # initiate feature extraction model
        feature_extraction = Feature_Extraction()

        # initialize the results vectors
        result_vectors = {
            'deepfake'      : [],
            'face2face'     : [],
            'faceswap'      : [],
            'neuraltextures': []
        }

        total_frames_vector = []

        # initialize voting vector
        votes_vectors = {
            'deepfake'      : -1,
            'face2face'     : -1,
            'faceswap'      : -1,
            'neuraltextures': -1
        }

        while video_capture.isOpened():
            # read the video frame by frame
            ret, frame = video_capture.read()
            if ret != True:
                break
            face = detect_face(frame)
            # extract the feature vector
            azi_line = feature_extraction.fit(face)
            total_frames_vector.append(azi_line)
        
        result_vectors['deepfake']  = self.deepfake_model.predict(total_frames_vector)
        result_vectors['face2face'] = self.face2face_model.predict(total_frames_vector)
        result_vectors['faceswap']  = self.faceswap_model.predict(total_frames_vector)
        result_vectors['neuraltextures'] = self.neuraltextures_model.predict(total_frames_vector)

        # frames number
        frames_size = len(result_vectors['deepfake'])

        for model_name in result_vectors.keys():
            total_voting = np.array(result_vectors[model_name]).sum()
            voting_result = 1 if total_voting > (frames_size // 2) else 0
            votes_vectors[model_name] = voting_result

        return votes_vectors