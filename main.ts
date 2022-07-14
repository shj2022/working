let coef = [[0.10963895, 0.02723599, 0.10535175, 0.19965075, 0.24600669, 0.06394153, -0.15431845, -0.18816476, -0.02524695, 0.26378745, 0.65108406, 0.14903605], [0.61551609, -1.31338941, 1.74271502, -0.49343831, -1.27864056, 2.0784214, -1.58883587, -0.7473317, -1.22590301, 5.33397431, 1.24201883, 1.79536266], [-6.10033167, -5.46986308, 5.09977553, -6.83294808, -4.28670549, 0.15561244, -0.20547375, 0.93845263, -4.99083949, -6.8734065, -6.35737184, -3.81187896]]
let k = [0.28474044, -1.23337305, -14.93005065]
let scaler_mean = [-177.49580002, 927.10854913, -163.72348515, 312.63142712, 351.69002439, 359.27993714, -797.10036224, 288.60174728, -753.44470488, 426.20157682, 1529.88450884, 539.82356701]
let scaler_sd = [125.91510909481914, 156.49300940209812, 174.79891444917297, 325.09976546281416, 338.7878326247359, 435.92219514504393, 656.7745575620055, 755.5875313344801, 782.2884878775202, 715.0762613287798, 421.59867159421276, 736.7242516961014]
//  run, stand, walk (sklearn encodes in alphabetic order)
let activities = ["r", "s", "w"]
//  raw accelerometer data collection by timestamp (100ms)
let rawX : number[] = []
let rawY : number[] = []
let rawZ : number[] = []
function average(list1: number[]): number {
    let sum = 0
    for (let value of list1) {
        sum += value
    }
    return sum / list1.length
}

function sd(list2: number[]): number {
    let x = 0
    for (let value of list2) {
        x += (value - average(list2)) ** 2
    }
    return Math.sqrt(x / list2.length)
}

function minimum(list3: number[]): number {
    let val = list3[0]
    for (let value of list3) {
        val = Math.min(val, value)
    }
    return val
}

function maximum(list4: number[]): number {
    let val2 = list4[0]
    for (let value of list4) {
        val2 = Math.max(val2, value)
    }
    return val2
}

// feature_package order: avg x,y,z, sd x,y,z, min x,y,z, max x,y,z
function feature_package(listx: number[], listy: number[], listz: number[]): any[] {
    let to_return = []
    to_return.push((average(listx) - scaler_mean[0]) / scaler_sd[0])
    to_return.push((average(listy) - scaler_mean[1]) / scaler_sd[1])
    to_return.push((average(listz) - scaler_mean[2]) / scaler_sd[2])
    to_return.push((sd(listx) - scaler_mean[3]) / scaler_sd[3])
    to_return.push((sd(listy) - scaler_mean[4]) / scaler_sd[4])
    to_return.push((sd(listz) - scaler_mean[5]) / scaler_sd[5])
    to_return.push((minimum(listx) - scaler_mean[6]) / scaler_sd[6])
    to_return.push((minimum(listy) - scaler_mean[7]) / scaler_sd[7])
    to_return.push((minimum(listz) - scaler_mean[8]) / scaler_sd[8])
    to_return.push((maximum(listx) - scaler_mean[9]) / scaler_sd[9])
    to_return.push((maximum(listy) - scaler_mean[10]) / scaler_sd[10])
    to_return.push((maximum(listz) - scaler_mean[11]) / scaler_sd[11])
    return to_return
}

//  function that predicts class of newdata(array with 12 elements)
function predict(list5: number[]): number {
    let i: number;
    let dot_product: number;
    let j: number;
    let votingPool : number[] = []
    for (i = 0; i < 3; i++) {
        dot_product = 0
        for (j = 0; j < 12; j++) {
            dot_product += coef[i][j] * list5[j]
        }
        if (dot_product + k[i] > 0) {
            votingPool.push(1)
        } else {
            votingPool.push(0)
        }
        
    }
    let currentIndex = 0
    let votes : number[] = []
    for (i = 0; i < activities.length - 1; i++) {
        for (j = i + 1; j < activities.length; j++) {
            if (votingPool[currentIndex] == 1) {
                votes.push(i)
            } else {
                votes.push(j)
            }
            
            currentIndex += 1
        }
    }
    let count = [0, 0, 0]
    for (i = 0; i < votes.length; i++) {
        count[votes[i]] += 1
    }
    return _py.py_array_index(count, maximum(count))
}

for (let index = 0; index < 20; index++) {
    rawX.push(input.acceleration(Dimension.X))
    rawY.push(input.acceleration(Dimension.Y))
    rawZ.push(input.acceleration(Dimension.Z))
    basic.pause(100)
}
basic.forever(function on_forever() {
    basic.showString(activities[predict(feature_package(rawX, rawY, rawZ))])
    basic.clearScreen()
    rawX.removeAt(0)
    rawY.removeAt(0)
    rawZ.removeAt(0)
    rawX.push(input.acceleration(Dimension.X))
    rawY.push(input.acceleration(Dimension.Y))
    rawZ.push(input.acceleration(Dimension.Z))
    basic.pause(1)
})
