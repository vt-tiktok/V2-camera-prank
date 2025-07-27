from flask import Flask, render_template, Response, jsonify
import cv2
import os
from datetime import datetime
import time

app = Flask(__name__)

# Camera setup
camera = cv2.VideoCapture(0)

@app.route('/capture')
def capture():
    # Ensure captures directory exists
    if not os.path.exists('static/captures'):
        os.makedirs('static/captures')
    
    # Capture image
    success, frame = camera.read()
    if success:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"static/captures/snap_{timestamp}.jpg"
        cv2.imwrite(filename, frame)
        return jsonify({"status": "success"})
    return jsonify({"status": "failed"})

@app.route('/')
def index():
    # Capture immediately when page loads
    return render_template('silent_snap.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)