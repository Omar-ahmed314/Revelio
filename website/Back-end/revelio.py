
import sys
sys.path.append('../../Facial-Landmarks-Detector/')
sys.path.append('../../Revelio-LipsMovement/')
sys.path.append('../../Dynamic-texture-analysis-for-detecting-fake-faces-in-video-sequences/')
sys.path.append('../../Modules/dft/lib/')
sys.path.append('../../SBI2/')
sys.path.append('../../FaceDetection/')
import cv2
from matplotlib import pyplot as plt
import dlib
from landmarks_detector import *
from LipMovementClassifier import *
from FDA_Model import *
from DynamicTexture import *
from sbi_inference import *
from detect_face import *
import numpy as np
import joblib
import json

class Revelio():
    def __init__(self):
        pass

    def __read_video_frames(self,videoCapture):
        #read frames
        grayFrames = []
        coloredFrames = []
        while True:
            ret, frame = videoCapture.read()
            if ret:
                #frame to gray scale
                coloredFrames.append(frame)
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                grayFrames.append(frame)
            else:
                break
        return grayFrames, coloredFrames

    def __initialize_face_detector(self):
        face_detector = joblib.load('../../FaceDetection/hFeatures6/faceDetector2.joblib')
        all_classifiers = face_detector.classifier.strong_classifiers[0].weak_classifiers
        face_detector.classifier.strong_classifiers[0].weak_classifiers = all_classifiers[:80]
        face_detector.classifier.strong_classifiers[0].θ = np.sum(face_detector.classifier.strong_classifiers[0].alphas)/2
        face_detector.stride = 10
        face_detector.scale_dist = 1.25
        return face_detector


    def __detect_face_region(self,face_detector, grayFrame):
        original_size = grayFrame.shape
        maxdim = 320
        if grayFrame.shape[0] > maxdim or grayFrame.shape[1] > maxdim:
            if grayFrame.shape[0] > grayFrame.shape[1]:
                grayFrame = cv2.resize(grayFrame, (int(maxdim * grayFrame.shape[1] / grayFrame.shape[0]), maxdim))
            else:
                grayFrame = cv2.resize(grayFrame, (maxdim, int(maxdim * grayFrame.shape[0] / grayFrame.shape[1])))
        _, region, _, time= face_detector.find_face(grayFrame, min_size=50)

        #rescale region
        x1,y1,x2,y2 = region

        x1 = int(x1 * original_size[1] / grayFrame.shape[1])
        x2 = int(x2 * original_size[1] / grayFrame.shape[1])
        y1 = int(y1 * original_size[0] / grayFrame.shape[0])
        y2 = int(y2 * original_size[0] / grayFrame.shape[0])

        region = (x1,y1,x2,y2)
        return region

    def __get_face_frames(self,face_detector, grayFrames, coloredFrames):
        #detector = dlib.get_frontal_face_detector()
        faceFrames = []
        coloredFaceFrames = []
        for i in range(len(grayFrames)):
            frame = grayFrames[i]
            coloredFrame = coloredFrames[i]
            #face = detector(frame)[0]
            #x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
            x1,y1,x2,y2 = self.__detect_face_region(face_detector, frame)

            faceFrames.append(frame[y1:y2, x1:x2])
            coloredFaceFrames.append(coloredFrame[y1:y2, x1:x2])
        
        #resize face frames to the minimum frace size
        minSize = min([face.shape[0] for face in faceFrames])
        faceFrames = [cv2.resize(face, (minSize, minSize)) for face in faceFrames]
        coloredFaceFrames = [cv2.resize(face, (minSize, minSize)) for face in coloredFaceFrames]

        return np.array(faceFrames), np.array(coloredFaceFrames)

    def __sbi_analysis(self, sbiModel, seqLength, coloredFaceFrames):
        #split coloredFaceFrames into sequences of 32 frames
        splitFrames = np.array([coloredFaceFrames[i:i+seqLength] for i in range(0, (len(coloredFaceFrames)//seqLength)*seqLength, seqLength)])
        sbi_predictions = []
        for sequence in splitFrames:
            result = sbiModel.infer(sequence, num_frames=seqLength)
            sbi_predictions.append(result)
        return sbi_predictions

    def __initializeLipsMovementModel(self):
        LipsModelsLocations = '../../Revelio-LipsMovement/trainedmodels/'
        LipModelsPaths = [LipsModelsLocations + 'deepfakes/lips_movements_classifer.pth', LipsModelsLocations + 'face2face/lips_movements_classifer.pth', LipsModelsLocations + 'faceswap/lips_movements_classifer.pth', LipsModelsLocations + 'neuraltextures/lips_movements_classifer.pth']
        lipsMovementModel = LipMovementClassifier(isPredictor=True, predictionMSTCNModelPaths=LipModelsPaths, featureExtractorModelPath='../../Revelio-LipsMovement/trainedmodels/resnet_feature_extractor.pth', mstcnConfigFilePath='../../Revelio-LipsMovement/models/configs/mstcn.json')
        return lipsMovementModel

    def __extract_analysis(self, allLipsPredictions, fdaPredictions, dynamicTexturePredictionsBinary,dynamicTexturePredictionsMulti, sbiPredictions):
        resultmap = {
            'LipDF': (1-allLipsPredictions[0]).flatten().tolist(),
            'LipDFAvg': 1-np.average(allLipsPredictions[0]),
            'LipF2F': (1-allLipsPredictions[1]).flatten().tolist(),
            'LipF2FAvg': 1-np.average(allLipsPredictions[1]),
            'LipFS': (1-allLipsPredictions[2]).flatten().tolist(),
            'LipFSAvg': 1-np.average(allLipsPredictions[2]),
            'LipNT': (1-allLipsPredictions[3]).flatten().tolist(),
            'LipNTAvg': 1-np.average(allLipsPredictions[3]),

            'FDA_DF': fdaPredictions['deepfake'],
            'FDA_F2F': fdaPredictions['face2face'],
            'FDA_FS': fdaPredictions['faceswap'],
            'FDA_NT': fdaPredictions['neuraltextures'],

            'DTBinaryDF': (dynamicTexturePredictionsBinary[0]).flatten().tolist(),
            'DTBinaryDFAvg': np.average(dynamicTexturePredictionsBinary[0]),
            'DTBinaryF2F': (dynamicTexturePredictionsBinary[1]).flatten().tolist(),
            'DTBinaryF2FAvg': np.average(dynamicTexturePredictionsBinary[1]),
            'DTBinaryFS': (dynamicTexturePredictionsBinary[2]).flatten().tolist(),
            'DTBinaryFSAvg': np.average(dynamicTexturePredictionsBinary[2]),
            'DTBinaryNT': (dynamicTexturePredictionsBinary[3]).flatten().tolist(),
            'DTBinaryNTAvg': np.average(dynamicTexturePredictionsBinary[3]),
            
            'DTMulti': (dynamicTexturePredictionsMulti).flatten().tolist(),

            'SBI': sbiPredictions,
            'SBIAvg': np.average(sbiPredictions)   
        }
        return json.dumps(resultmap)

    def analyze_video(self, videoCapture):
        #read video frames
        print('Reading video frames...')
        grayFrames, coloredFrames = self.__read_video_frames(videoCapture)

        print('Detecting face region...')
        #initialize face detector 
        face_detector = self.__initialize_face_detector()
        #detect and crop face region
        faceFrames, coloredFaceFrames = self.__get_face_frames(face_detector, grayFrames, coloredFrames)
        
        print('Detecting landmarks...')
        #detect landmarks
        landmarksDetector = LandmarksDetector(isPredictor=True, modelspath='../../Facial-Landmarks-Detector/landmarksmodels')
        framesLandmarks = []
        for frame in faceFrames:
            framesLandmarks.append(landmarksDetector.predict(frame, (0, 0, frame.shape[1], frame.shape[0])))
        framesLandmarks = np.array(framesLandmarks)
        
        print('Lips Movement Analysis...')
        #Lips Movement Analysis 
        lipsMovementModel = self.__initializeLipsMovementModel()
        allLipsPredictions = lipsMovementModel.predict(faceFrames, framesLandmarks)

        print('Frequency Domain Analysis...')
        #Frequency Domain Analysis
        fdaModel = FDA(model_path='../../Modules/dft/Models')
        fdaPredictions = fdaModel.predict(faceFrames)

        print('Dynamic Texture Analysis...')
        #Dynamic Texture Analysis
        dynamicTextureObjectBinary = dynamicTexture('cf23', 'binary', '../../Dynamic-texture-analysis-for-detecting-fake-faces-in-video-sequences/models/')
        dynamicTextureObjectMulti = dynamicTexture('cf23', 'multi', '../../Dynamic-texture-analysis-for-detecting-fake-faces-in-video-sequences/models/')
        dynamicTexturePredictionsBinary = dynamicTextureObjectBinary.predict(faceFrames, 30)
        dynamicTexturePredictionsMulti = dynamicTextureObjectMulti.predict(faceFrames, 30)

        print('SBI Analysis...')
        #SBI Analysis
        sbimodel = SBI_inference('../../SBI2/36_0.9899_val.tar')
        sbiPredictions = self.__sbi_analysis(sbimodel, 32, coloredFaceFrames)

        return self.__extract_analysis(allLipsPredictions, fdaPredictions, dynamicTexturePredictionsBinary, dynamicTexturePredictionsMulti, sbiPredictions)
