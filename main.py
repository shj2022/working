coef = [[-1.25559259e+00, -3.64287262e+00,  6.23931121e-01,
        -2.98794925e+00,  4.63243881e-01,  1.51791457e+01,
         3.32257870e+00, -1.65215245e+00, -2.62031387e+00,
        -4.54590336e+00,  2.83757446e-01, -9.23485276e+00],
       [-4.45286659e-01, -2.44126116e+00, -2.10854371e-02,
        -1.56872540e+00,  2.29116992e+00,  1.27184480e+00,
        -4.79484458e-01,  1.00925036e+00, -9.80969787e-01,
        -5.28261302e-01, -7.33210855e-01, -5.75732606e-01],
       [ 4.71966984e-01, -4.95658490e-01, -2.72628566e-01,
         1.06756085e-01,  2.37943589e-01,  1.91411055e-01,
        -1.16208288e-01, -4.21438699e-01, -1.91337364e-01,
         1.92180099e-01, -1.13539977e-02,  2.01927781e-01],
       [ 1.28446274e+00, -2.81572444e-01, -1.74115394e-01,
        -4.48268439e-03,  5.16905644e-01,  1.49862955e+00,
        -2.84969515e-01, -1.72261488e+00, -1.55150410e+00,
        -1.95601285e-01, -6.43299828e-01, -1.69429445e-01],
       [ 1.88408306e+00, -1.53047884e+00,  4.08225346e+00,
         7.35745378e-01,  5.55736318e+00, -5.90018721e+00,
        -7.98906290e-01,  4.94179309e-01, -1.28760594e+00,
        -1.47672109e+00, -3.43046930e-01,  1.08309550e+00],
       [ 2.14938745e-01, -1.72978332e-01, -8.40785145e-02,
         2.03108524e-01,  2.60658710e-01,  8.40343456e-02,
        -1.90437311e-01, -2.51931925e-01, -1.22987540e-01,
         2.08035651e-01,  2.99450082e-01,  1.06837773e-01],
       [ 5.71337237e-01,  4.46123048e-02,  8.68765380e-02,
         5.48343770e-01,  9.47958882e-01,  1.17638906e-01,
        -4.30218667e-01, -7.97367241e-01,  8.31381338e-02,
         4.23411869e-01,  4.47577241e-02,  3.16100112e-02],
       [ 1.01723199e-01, -1.38135005e-01, -1.06953349e-01,
         7.23306860e-02,  1.98532321e-01,  1.28571679e-01,
        -6.86410030e-02, -2.15069824e-01, -1.42902801e-01,
         1.11090551e-01,  4.78264366e-01,  1.65474443e-01],
       [ 1.17212916e+00,  5.81003894e-01, -6.60101063e-01,
         3.34741720e-01,  9.74755382e-01,  1.03317305e+00,
        -7.28746560e-01, -1.78033901e+00,  8.46354367e-01,
         3.81552200e-01,  4.24616016e-01,  2.00862903e-01],
       [-2.56381072e+00,  3.56478582e-01,  2.76057455e+00,
        -1.05145269e+01,  1.44091666e+00,  1.67809438e+00,
        -5.80544243e+00,  7.34287406e+00, -1.68369015e+00,
        -9.63797316e+00, -4.89779450e+00, -1.93717331e+00]]
k = [-9.14427219e+00, -3.28832520e+00,  9.74994008e-03, -1.16838421e+00,
               -1.14273751e+00,  6.73513776e-01,  3.55781141e-01,  6.52481403e-01,
                9.01483623e-01, -2.21033551e+01]
activities = ['dribble', 'golf', 'jj', 'stand', 'walk']

# raw accelerometer data collection by timestamp (100ms)
rawX: List[number] = []
rawY: List[number] = []
rawZ: List[number] = []

def average(list1: List[number]):
    sum = 0
    for value in list1:
        sum += value
    return sum/len(list1)

def sd(list2: List[number]):
    x = 0
    for value in list2:
        x += ((value - average(list2))**2)
    return (Math.sqrt(x/len(list2)))

def minimum(list3: List[number]):
    val = list3[0]
    for value in list3:
            val = min(val,value)
    return val

def maximum(list4: List[number]):
    val2 = list4[0]
    for value in list4:
            val2 = max(val2,value)
    return val2

#feature_package order: avg x,y,z, sd x,y,z, min x,y,z, max x,y,z
def feature_package(listx: List[number], listy: List[number], listz: List[number]):
    to_return = []
    to_return.append(average(listx))
    to_return.append(average(listy))
    to_return.append(average(listz))
    to_return.append(sd(listx))
    to_return.append(sd(listy))
    to_return.append(sd(listz))
    to_return.append(minimum(listx))
    to_return.append(minimum(listy))
    to_return.append(minimum(listz))
    to_return.append(maximum(listx))
    to_return.append(maximum(listy))
    to_return.append(maximum(listz))
    return to_return

# function that predicts class of newdata(array with 12 elements)
def predict(list5: List[number]):
    votingPool : List[number] = []
    for i in range(10):
        dot_product = 0
        for j in range(12):
            dot_product += coef[i][j] * list5[j]
        if (dot_product + k[i])>0:
            votingPool.append(1)
        else:
            votingPool.append(0)
    currentIndex = 0
    votes : List[number] = []
    for i in range(len(activities) - 1):
        for j in range(i + 1, len(activities)):
            if votingPool[currentIndex] == 1:
                votes.append(i)
            else:
                votes.append(j)
            currentIndex += 1
    count = [0,0,0,0,0]
    for i in range(len(votes)):
        count[votes[i]] +=1
    return count.index(maximum(count))

def on_forever():
    for index in range(19):
        rawX.append(input.acceleration(Dimension.X))
        rawY.append(input.acceleration(Dimension.Y))
        rawZ.append(input.acceleration(Dimension.Z))
        basic.pause(100)
    basic.show_string(activities[predict(feature_package(rawX, rawY, rawZ))])
    for i in range(19):
        rawX.removeAt(i)
        rawY.removeAt(i)
        rawZ.removeAt(i)

basic.forever(on_forever)