import sys

sys.path.append("../../Facial-Landmarks-Detector/")
sys.path.append("../../Revelio-LipsMovement/")
sys.path.append(
    "../../Dynamic-texture-analysis-for-detecting-fake-faces-in-video-sequences/"
)
sys.path.append("../../Modules/dft/lib/")
sys.path.append("../../SBI2/")
sys.path.append("../../FaceDetection/")
sys.path.append("utils/")
from flask import Flask, render_template, request
from flask_cors import CORS
import time
from enum import Enum
import json
from threading import Thread
from revelio import *


class JobsStatus(Enum):
    RUNNING = 1
    FINISHED = 2


# initialize the application
app = Flask(__name__)

# initialize cors
cors = CORS(app)

# create jobs ids container
# The variable cosists of key-value as
# key is the job id running now
# value is the status of the jobs
current_jobs = {}

# This variable consists of key-value
# key is the job id running now
# value is the data of this job once finished
current_jobs_results = {}


@app.route("/")
def index():
    return "Hello World"


@app.route("/upload", methods=["POST"])
def upload():
    if request is not None:
        with open(request.headers["File-Name"], "ab") as file:
            file.write(request.data)

    return "Successfully Uploaded"


@app.route("/analyze", methods=["GET"])
def analyze():
    job_id = int(time.time())
    current_jobs[job_id] = JobsStatus.RUNNING
    response_body = {"job_id": job_id}
    filename = request.args.get("filename")
    t1 = Thread(target=run_process, args=(job_id, filename))
    t1.start()
    return json.dumps(response_body)


@app.route("/getAnalysis", methods=["GET"])
def getAnalysis():
    job_id = int(request.args.get("job_id"))
    if current_jobs.get(job_id) != JobsStatus.RUNNING:
        data = {"status": "done", "data": current_jobs_results.get(job_id)}
        return json.dumps(data)

    data = {"status": "running", "data": 0}
    return json.dumps(data)


def run_process(job_id, filename):
    print(" ================== Start job ===================== ")
    revelioAnalysis = Revelio().analyze_video(filename)
    # time.sleep(5)
    print(" ================== End job ===================== ")
    current_jobs[job_id] = JobsStatus.FINISHED
    current_jobs_results[job_id] = revelioAnalysis


if __name__ == "__main__":
    app.run(port=8080)
