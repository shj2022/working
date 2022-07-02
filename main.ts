let coef = [[-3.48139847e-01, -8.06256250e00, 1.79910707e-01, -5.93177299e00, 4.81471444e00, 3.96997942e00, -3.17260372e00, 5.24102901e00, 1.05594195e00, 5.56153691e00, -1.82321149e00, 3.11302786e00], [-2.28996821e-01, -9.84611438e-01, 8.87331988e-01, -1.33460164e-01, 2.22799300e-01, -4.32220695e-01, -1.00327021e-01, -4.35300821e-01, 6.06842509e-01, -2.29237265e-01, -5.07552657e-01, -2.36787949e-01], [-1.44074647e-02, -3.47321237e-01, -5.55747451e-02, 1.25667501e-01, 1.59474025e-01, 1.22328764e-01, -9.63767437e-02, -1.87808900e-01, -1.19943660e-01, 9.13172877e-02, 7.88469482e-03, 8.88160611e-02], [-4.67224263e-03, -5.96000756e-01, 9.13535674e-02, 1.35092059e-01, 1.39495672e-01, 1.80487778e-01, -9.81179133e-02, -1.83684098e-01, -1.14023123e-01, 3.92913471e-02, -1.61734935e-01, 1.94218811e-01], [-1.25732316e00, -1.10062785e00, -3.07539792e-01, 2.33686438e00, -4.02577370e00, -6.43225583e00, 5.62606911e-02, -4.02297729e00, -2.52321946e-01, -3.19470424e00, 1.39736746e00, 1.39754740e00], [-4.73278868e-01, -3.66163519e-01, -2.00650209e-01, 2.44775550e-01, 2.69820544e-01, 2.03628783e-01, -3.47518924e-01, -2.77037666e-01, -2.03291108e-01, 1.61520722e-02, 1.91197209e-01, 1.60936868e-01], [-4.13909495e00, -2.08895361e00, -1.07273209e00, 6.85926260e-01, 1.34095742e00, 2.96784446e00, -1.14621644e00, 2.36587756e-01, -1.85353449e00, 2.85641216e00, 1.40697017e-01, 7.84987578e-01], [5.21515609e-02, 1.07866999e-02, 7.63895649e-02, 2.23653173e-01, 2.37960960e-01, 6.25594410e-02, -1.54366043e-01, -1.74556859e-01, -1.39901464e-02, 2.94869761e-01, 7.06936696e-01, 1.47095912e-01], [1.56095082e00, -2.20223979e00, 2.25161305e00, -5.78703350e-01, -1.21566031e00, 3.41341454e00, -1.14804248e00, -1.25199189e00, -3.34754411e-01, 5.64648784e00, 9.98539073e-01, 2.44551537e00], [-5.05885711e00, -4.47155613e00, 5.62777917e00, -6.74361389e00, -4.22412841e00, 7.77687276e-01, -4.24945147e00, 1.85369889e00, -3.77601693e00, -7.43468823e00, -5.16760172e00, -2.55433421e00]]
let k = [-15.03947674, -0.92686819, 0.13567945, -0.51305996, -0.05371239, 1.25690401, 2.31000514, 0.76393525, 2.03026214, -11.67985798]
let activities = ["d", "g", "r", "s", "w"]
//  raw accelerometer data collection by timestamp (100ms)
let rawX : number[] = []
let rawY : number[] = []
let rawZ : number[] = []
function collect_xyz_data() {
    rawX.push(input.acceleration(Dimension.X))
    rawY.push(input.acceleration(Dimension.Y))
    rawZ.push(input.acceleration(Dimension.Z))
}

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
function feature_package(listx: any[], listy: any[], listz: any[]): any[] {
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
        if (dot_product > 0) {
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
    let rawX: number[];
    let rawY: number[];
    let rawZ: number[];
    if (rawZ.length == 19) {
        basic.showString(activities[predict(feature_package(rawX, rawY, rawZ))])
        rawX = []
        rawY = []
        rawZ = []
    } else {
        for (let index = 0; index < 19; index++) {
            collect_xyz_data()
            basic.pause(100)
        }
    }
    
})
