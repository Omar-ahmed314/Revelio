import sys
sys.path.append('./utils/')
from flask import Flask, render_template, request
from flask_cors import CORS
from utils import JobsStatus
import time
import json
from threading import Thread

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

@app.route('/')
def index():
    return 'Hello World'

@app.route('/upload', methods=['POST'])
def upload():
    if request is not None:
        with open(request.headers['File-Name'], 'ab') as file:
            file.write(request.data)
        
    return 'Successfully Uploaded'

@app.route('/analyze', methods=['POST'])
def analyze():
    job_id = int(time.time())
    current_jobs[job_id] = JobsStatus.RUNNING
    response_body = {
        'job_id': job_id
    }
    t1 = Thread(target=run_process, args=(job_id,))
    t1.start()
    return json.dumps(response_body)

@app.route('/getAnalysis', methods=['GET'])
def getAnalysis():
    job_id = int(request.args.get('job_id'))
    if current_jobs.get(job_id) != JobsStatus.RUNNING:
        data = {'status': 'done', 'data': 50}
        return json.dumps(data)
    
    data = {'status': 'running', 'data': 0}
    return json.dumps(data)

def run_process(job_id):
    print('start job')
    time.sleep(10)
    print('end job')
    current_jobs[job_id] = JobsStatus.FINISHED


if __name__ == '__main__':
    app.run(port=8080)