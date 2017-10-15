from flask import Flask, make_response, request, current_app
from functools import update_wrapper
from flask_cors import CORS, cross_origin

##fetch time information
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/calc_error', methods=['GET','POST'])
def calc_error():
    #read priors from somewhere
    P0 = 0.6
    P1 = 0.3

    f_r = open('test_data.csv')
    cnt = 0
    #task id, label 1, label 2, label 3
    #each task is assigned to three agents; if not, we will simply skip this line of data
    p1 = []
    p2 = []
    p3 = []

    for line in f_r:
            cnt = cnt+1
            if cnt>1: #first line is description
                    line = line.split(" ")
                    p1.append(float(line[1]))
                    if float(line[1]) == float(line[2]):
                            p2.append(1)
                            if (float(line[1]) == float(line[3])) & (float(line[3]) == 1):
                                    p3.append(1)
                    else:
                            p2.append(0)


    f_r.close()


    rho = P0/P1
    P0_norm = (1-np.mean(p1))/P1
    q_norm = np.mean(p2)/P1
    q3 = np.mean(p3)

    a = 2*rho**2+2*rho
    b = -4*rho**2-4*rho+4*rho*P0_norm
    c = (rho+1-P0_norm)**2+(P0_norm-rho)**2+rho-q_norm

    #initialization
    p0_est = 0.5
    p1_est = 0.5
    p0_est1 = 0.5
    p1_est1 = 0.5
    p0_est2 = 0.5
    p1_est2 = 0.5

    if b**2-4*a*c >= 0:
            p0_est1 = (-b-(b**2-4*a*c)**0.5)/(2*a)
            p1_est1 = P0_norm - rho*(1-p0_est1)
            p0_est2 = (-b+(b**2-4*a*c)**0.5)/(2*a)
            p1_est2 = P0_norm - rho*(1-p0_est2)



    err_root1 = np.abs(P0*(p0_est1)**3+P1*(1-p1_est1)**3-q3)
    err_root2 = np.abs(P0*(p0_est2)**3+P1*(1-p1_est2)**3-q3)

    if err_root1 <= err_root2:
            p0_est = p0_est1
            p1_est = p1_est1
    else:
            p0_est = p0_est2
            p1_est = p1_est2

    if request.method == 'POST':
        print(request.form)


