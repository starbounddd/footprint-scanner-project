from flask import Flask, request, jsonify
import cv2
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/orb-match', methods=['POST'])
def orb_match():
    file1 = request.files['image1']
    file2 = request.files['image2']
    img1 = cv2.imdecode(np.frombuffer(file1.read(), np.uint8), cv2.IMREAD_GRAYSCALE)
    img2 = cv2.imdecode(np.frombuffer(file2.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

    orb = cv2.ORB_create(nfeatures=1000)
    kp1, des1 = orb.detectAndCompute(img1, None)
    kp2, des2 = orb.detectAndCompute(img2, None)
    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    matches = bf.match(des1, des2)
    matches = sorted(matches, key=lambda x: x.distance)
    good_matches = [m for m in matches if m.distance < 50]
    similarity_score = len(good_matches)
    return jsonify({'similarity_score': similarity_score})

if __name__ == '__main__':
    app.run(port=5000)