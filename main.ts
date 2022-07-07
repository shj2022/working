let coef = [[-1.25559259e+00, -3.64287262e+00, 6.23931121e-01, -2.98794925e+00, 4.63243881e-01, 1.51791457e+01, 3.32257870e+00, -1.65215245e+00, -2.62031387e+00, -4.54590336e+00, 2.83757446e-01, -9.23485276e+00], [-4.45286659e-01, -2.44126116e+00, -2.10854371e-02, -1.56872540e+00, 2.29116992e+00, 1.27184480e+00, -4.79484458e-01, 1.00925036e+00, -9.80969787e-01, -5.28261302e-01, -7.33210855e-01, -5.75732606e-01], [4.71966984e-01, -4.95658490e-01, -2.72628566e-01, 1.06756085e-01, 2.37943589e-01, 1.91411055e-01, -1.16208288e-01, -4.21438699e-01, -1.91337364e-01, 1.92180099e-01, -1.13539977e-02, 2.01927781e-01], [1.28446274e+00, -2.81572444e-01, -1.74115394e-01, -4.48268439e-03, 5.16905644e-01, 1.49862955e+00, -2.84969515e-01, -1.72261488e+00, -1.55150410e+00, -1.95601285e-01, -6.43299828e-01, -1.69429445e-01], [1.88408306e+00, -1.53047884e+00, 4.08225346e+00, 7.35745378e-01, 5.55736318e+00, -5.90018721e+00, -7.98906290e-01, 4.94179309e-01, -1.28760594e+00, -1.47672109e+00, -3.43046930e-01, 1.08309550e+00], [2.14938745e-01, -1.72978332e-01, -8.40785145e-02, 2.03108524e-01, 2.60658710e-01, 8.40343456e-02, -1.90437311e-01, -2.51931925e-01, -1.22987540e-01, 2.08035651e-01, 2.99450082e-01, 1.06837773e-01], [5.71337237e-01, 4.46123048e-02, 8.68765380e-02, 5.48343770e-01, 9.47958882e-01, 1.17638906e-01, -4.30218667e-01, -7.97367241e-01, 8.31381338e-02, 4.23411869e-01, 4.47577241e-02, 3.16100112e-02], [1.01723199e-01, -1.38135005e-01, -1.06953349e-01, 7.23306860e-02, 1.98532321e-01, 1.28571679e-01, -6.86410030e-02, -2.15069824e-01, -1.42902801e-01, 1.11090551e-01, 4.78264366e-01, 1.65474443e-01], [1.17212916e+00, 5.81003894e-01, -6.60101063e-01, 3.34741720e-01, 9.74755382e-01, 1.03317305e+00, -7.28746560e-01, -1.78033901e+00, 8.46354367e-01, 3.81552200e-01, 4.24616016e-01, 2.00862903e-01], [-2.56381072e+00, 3.56478582e-01, 2.76057455e+00, -1.05145269e+01, 1.44091666e+00, 1.67809438e+00, -5.80544243e+00, 7.34287406e+00, -1.68369015e+00, -9.63797316e+00, -4.89779450e+00, -1.93717331e+00]]
let k = [-9.14427219e+00, -3.28832520e+00, 9.74994008e-03, -1.16838421e+00, -1.14273751e+00, 6.73513776e-01, 3.55781141e-01, 6.52481403e-01, 9.01483623e-01, -2.21033551e+01]
let activities = ["dribble", "golf", "jj", "stand", "walk"]
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
    to_return.push(average(listx))
    to_return.push(average(listy))
    to_return.push(average(listz))
    to_return.push(sd(listx))
    to_return.push(sd(listy))
    to_return.push(sd(listz))
    to_return.push(minimum(listx))
    to_return.push(minimum(listy))
    to_return.push(minimum(listz))
    to_return.push(maximum(listx))
    to_return.push(maximum(listy))
    to_return.push(maximum(listz))
    return to_return
}

//  function that predicts class of newdata(array with 12 elements)
function predict(list5: number[]): number {
    let i: number;
    let dot_product: number;
    let j: number;
    let votingPool : number[] = []
    for (i = 0; i < 10; i++) {
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
    let count = [0, 0, 0, 0, 0]
    for (i = 0; i < votes.length; i++) {
        count[votes[i]] += 1
    }
    return _py.py_array_index(count, maximum(count))
}

basic.forever(function on_forever() {
    for (let index = 0; index < 19; index++) {
        rawX.push(input.acceleration(Dimension.X))
        rawY.push(input.acceleration(Dimension.Y))
        rawZ.push(input.acceleration(Dimension.Z))
        basic.pause(100)
    }
    basic.showString(activities[predict(feature_package(rawX, rawY, rawZ))])
    for (let i = 0; i < 19; i++) {
        rawX.removeAt(i)
        rawY.removeAt(i)
        rawZ.removeAt(i)
    }
})
