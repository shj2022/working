coef = [[ 0.10963895,  0.02723599,  0.10535175,  0.19965075,  0.24600669,
         0.06394153, -0.15431845, -0.18816476, -0.02524695,  0.26378745,
         0.65108406,  0.14903605],
       [ 0.61551609, -1.31338941,  1.74271502, -0.49343831, -1.27864056,
         2.0784214 , -1.58883587, -0.7473317 , -1.22590301,  5.33397431,
         1.24201883,  1.79536266],
       [-6.10033167, -5.46986308,  5.09977553, -6.83294808, -4.28670549,
         0.15561244, -0.20547375,  0.93845263, -4.99083949, -6.8734065 ,
        -6.35737184, -3.81187896]]
k = [0.28474044,  -1.23337305, -14.93005065]
scaler_mean = [-177.49580002,  927.10854913, -163.72348515,  312.63142712,
        351.69002439,  359.27993714, -797.10036224,  288.60174728,
       -753.44470488,  426.20157682, 1529.88450884,  539.82356701]
scaler_sd = [125.91510909481914,
        156.49300940209812,
        174.79891444917297,
        325.09976546281416,
        338.7878326247359,
        435.92219514504393,
        656.7745575620055,
        755.5875313344801,
        782.2884878775202,
        715.0762613287798,
        421.59867159421276,
        736.7242516961014]

# run, stand, walk (sklearn encodes in alphabetic order)
activities = ['r', 's', 'w']

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
    to_return.append((average(listx)-scaler_mean[0])/scaler_sd[0])
    to_return.append((average(listy)-scaler_mean[1])/scaler_sd[1])
    to_return.append((average(listz)-scaler_mean[2])/scaler_sd[2])
    to_return.append((sd(listx)-scaler_mean[3])/scaler_sd[3])
    to_return.append((sd(listy)-scaler_mean[4])/scaler_sd[4])
    to_return.append((sd(listz)-scaler_mean[5])/scaler_sd[5])
    to_return.append((minimum(listx)-scaler_mean[6])/scaler_sd[6])
    to_return.append((minimum(listy)-scaler_mean[7])/scaler_sd[7])
    to_return.append((minimum(listz)-scaler_mean[8])/scaler_sd[8])
    to_return.append((maximum(listx)-scaler_mean[9])/scaler_sd[9])
    to_return.append((maximum(listy)-scaler_mean[10])/scaler_sd[10])
    to_return.append((maximum(listz)-scaler_mean[11])/scaler_sd[11])
    return to_return

# function that predicts class of newdata(array with 12 elements)
def predict(list5: List[number]):
    votingPool : List[number] = []
    for i in range(3):
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
    count = [0,0,0]
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