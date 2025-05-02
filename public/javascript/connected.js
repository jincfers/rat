let sqlData;
let startTimeL;
let startTimeC;
let LDTT;
let MLDTT;
let wait;

//get ID
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    // console.log(params.get('id'));
    return params.get('id');
}

async function sendUserData() {
    const data = sqlData
    console.log('sending: '+data)
    // console.log(JSON.stringify(data))
    const response = await fetch('/api/connectDataStream/' + getIdFromUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    // const result = await response.json();
    // console.log(result);
    LLDT = Date.now()
}

async function getUserData() {
    await fetch('/api/connectDataStream/' + getIdFromUrl())
        .then((response) => response.json())
        .then((data) => {
            sqlData = data.sqlData
            sqlData.activeKeys = []
            if (sqlData.mouseS != 1) {
                sqlData.mouseS = 0
            }
            console.log('Recieved: '+sqlData);
        })
}

function getScreen() {
    let displayImg = document.getElementById('display')
    let src = '/images/' + sqlData.ID + '.jpg'
    displayImg.setAttribute('src', src + '?ver=' + new Date().getTime());
}

// function sendMouse () {
//     document.addEventListener('mousemove', mouseTrack);
//     setTimeout(() => {
//       document.removeEventListener('mousemove', mouseTrack);
//     }, 25);
// }
async function mouseTrack(event) {
    if (Date.now() - MLDTT >= 5) {
        await getUserData()
        sqlData.mouseX = event.clientX * (65535 / sqlData.reciveScreenX)
        sqlData.mouseY = event.clientY * (65535 / sqlData.reciveScreenY)
        // console.log(sqlData)//debug ----Rm console.log----
        // console.log(sqlData.mouseX);//debug ----Rm console.log----
        // console.log(sqlData.mouseY);//debug ----Rm console.log----
        await sendUserData()
        MLDTT = Date.now()
    }
}

// function sendKeys () {
//     document.addEventListener('keypress', keyTrack)
//     setTimeout(() => {
//         document.removeEventListener('keypress', keyTrack);
//         // console.log(!sqlData.activeKeys[0])
//         if (!sqlData.activeKeys[0]) {
//             sqlData.activeKeys = ['Null2cHere']
//         }
//     }, 25);
// };
async function keyTrack(event) {
    if (Date.now() - LDTT >= wait) {
        await getUserData()
        console.log(typeof sqlData.activeKeys)
        sqlData.activeKeys.push(event.key)
        // if (!sqlData.activeKeys[0]) {
        //     sqlData.activeKeys = ['Null2cHere']
        // }
        await sendUserData()
        LDTT = Date.now()
    }
}

// function sendClick () {
//     document.addEventListener('mousedown', clickTrack)
//     setTimeout(() => {
//         document.removeEventListener('mousedown', clickTrack);
//         console.log(sqlData.mouseL)
//     }, 3000);
// }

// function sendClick () {
// document.addEventListener('mousedown', clickTrackDown)
// document.addEventListener('mouseup', clickTrackUp)
//     setTimeout(() => {
//         document.removeEventListener('mousedown', clickTrackDown)
//         document.removeEventListener('mouseup', clickTrackUp)
//         // console.log(sqlData.mouseL)
//     }, 25)
// }
async function clickTrackDown(event) {
    if (Date.now() - LDTT >= wait) {
        await getUserData()
        if (event.button == 0) {
            sqlData.mouseLD += 1
        }
        else if (event.button == 1) {
            sqlData.mouseS = 1
        } 
        else if (event.button == 2) {
            sqlData.mouseRD += 1
        }
        await sendUserData()
        LDTT = Date.now()
    }
}
async function clickTrackUp(event) {
    if (Date.now() - LDTT >= wait) {
        await getUserData()
        if (event.button == 0) {
            sqlData.MouseLU += 1
        }
        else if (event.button == 1) {
            sqlData.mouseS = 0
        }
        else if (event.button == 2) {
            sqlData.MouseRU += 1
        }
        await sendUserData()
        LDTT = Date.now()
    }
}
function pause(milliseconds) {
    let oldTime = Date.now()
    let go = true
    while (go) {
        if (oldTime + milliseconds <= Date.now()) {
            oldTime = Date.now()
            go = false
        }
    }
}
let oldScroll = 0;
async function scrollTrack(event) {
    if (Date.now() - LDTT >= 100) {
        await getUserData()
        if (event.deltaY > oldScroll) {
            sqlData.mouseS = 2;//scroll down
            oldScroll = event.deltaY;
        }
        else if (event.deltaY < oldScroll) {
            sqlData.mouseS = 3;//scroll up
            oldScroll = event.deltaY;
        }
        await sendUserData()
        LDTT = Date.now()
    }
}

function FPSlimit (limit) {
    limit = 1000 / limit
    if ((Date.now() - startTimeL) >= limit) {
        startTimeL = Date.now()
        return true;
    }
    else {
        return false;
    }
    
}

let frmCount = 0;
function FPScount() {
    frmCount += 1
    if ((Date.now() - startTimeC) >= 1000) {
        console.log('FPS: ' + frmCount)
        frmCount = 0
        startTimeC = Date.now()
    }
}

async function onLoad() {
    await getUserData();
    document.addEventListener('mousemove', mouseTrack);
    document.addEventListener('keypress', keyTrack);
    document.addEventListener('mousedown', clickTrackDown);
    document.addEventListener('mouseup', clickTrackUp);
    window.addEventListener('contextmenu', function (event) { event.preventDefault(); });
    document.addEventListener('wheel', scrollTrack);
    startTimeL = Date.now()
    startTimeC = Date.now()
    LDTT = Date.now()
    MLDTT = Date.now()
    wait = 10
    getScreen();
    (() => {
        let displayImg = document.getElementById('display');
        let w = window.innerWidth + 'px';
        let h = window.innerHeight + 'px';
        displayImg.setAttribute('width', w);
        displayImg.setAttribute('height', h);
        console.log(w+h)
    })();
    sqlData.reciveScreenX = window.innerWidth
    sqlData.reciveScreenY = window.innerHeight
    start() // --- Debug --- uncomment after release
}


// --------------------------------------------------------------------------~~'\  MAIN LOOP STARTS HERE  /'~~----------------------------------------------------------------------------------------------------

let intervalId;

function start() {
    if (intervalId) return; // Prevent multiple intervals

    intervalId = setInterval(async () => {
        FPScount()
        try {
            await getScreen();
        } catch (error) {
            console.error('Loop error:', error);
        }
    }, 1);
}

function stop() {
    clearInterval(intervalId);
    intervalId = null;
}

window.onload = onLoad;

