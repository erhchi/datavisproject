import numpy as np
import pandas as pd
from sklearn.preprocessing import minmax_scale
from numpy import linalg as la
from collections import defaultdict




def get_course_idx_by_concentration(idx):
    c_df = pd.read_csv('./data/courses.csv')
    res = {level:[] for level in set(c_df.level.tolist())}
    for i in idx:
        course_id = c_df.iloc[i].dept+str(c_df.iloc[i].cno)
        for j in range(c_df.shape[0]):
            if course_id == c_df.iloc[j].dept+str(c_df.iloc[j].cno):
                res[c_df.iloc[j].level].append(i)
    return res


def cosSim(inA,inB):
    num = np.dot(inA, inB)
    denom = la.norm(inA)*la.norm(inB)
    return num / denom

def get_job_sim(idx):
    ## Load the Course matrix
    c_mat = np.array(pd.read_csv('./data/course_mat.csv'))

    ## Load the Job matrix
    j_mat = np.array(pd.read_csv('./data/job_mat.csv'))

    ## normalize the Job matrix
    j_mat = minmax_scale(j_mat, feature_range=(0,1), axis=0)

    ## create a Selection vector
    selected = np.sum(c_mat[idx,], axis= 0).reshape(1, c_mat.shape[1])

    ## concate the Selection vector and the Course matrix
    conbined = np.concatenate((selected, c_mat), axis=0)
    ## normalize the conbined matrix
    conbined = minmax_scale(conbined, feature_range=(0,1), axis=0)
    selected = conbined[0]

    ## Run selected course on every job to find similarities
    sims = [cosSim(selected,j_mat[i]) for i in range(j_mat.shape[0])]
    adjusted_sims = np.argsort(sims)
    ## print(adjusted_sims)
    return adjusted_sims.tolist()

def get_group_sim(idx):
    dic = get_course_idx_by_concentration(idx)
    return {k:get_job_sim(dic[k]) if dic[k] else 0 for k in dic}