const canvas = document.getElementById('canvas');
const borderImg = document.getElementById('borderImg');
const billImageInput = document.getElementById('bill-image');
let prize;
const prizeMap = {
    0: {
        name: '01 Bịch Bánh Karamucho Xanh',
        minDegree: 0,
        maxDegree:44
    },
    1: {
        name: '01 Voucher Got It trị giá 30,000vnđ',
        minDegree: 45,
        maxDegree: 89
    },
    2: {
        name: '01 Bịch Bánh Karamucho Đỏ',
        minDegree: 90,
        maxDegree:134
    },
    3: {
        name: '01 Lon Bia Sapporo Premium 500ml',
        minDegree: 135,
        maxDegree: 179
    },
    4: {
        name: '01 Bịch Bánh Karamucho Xanh',
        minDegree: 180,
        maxDegree: 224
    },
    5: {
        name: '01 Voucher Got It trị giá 30,000vnđ',
        minDegree: 225,
        maxDegree: 269
    },
    6: {
        name: '01 Bịch Bánh Karamucho Đỏ',
        minDegree: 270,
        maxDegree: 314
    },
    7: {
        name: '01 Lon Bia Sapporo Premium 500ml',
        minDegree: 315,
        maxDegree: 359
    },
    8: {
        name: '01 Bịch Bánh Karamucho Xanh',
        minDegree: 0,
        maxDegree:44
    },
    9: {
        name: '01 Bịch Bánh Karamucho Đỏ',
        minDegree: 90,
        maxDegree:134
    },
    10: {
        name: '01 Lon Bia Sapporo Premium 500ml',
        minDegree: 135,
        maxDegree: 179
    },
    11: {
        name: '01 Bịch Bánh Karamucho Xanh',
        minDegree: 0,
        maxDegree:44
    },
    12: {
        name: '01 Bịch Bánh Karamucho Đỏ',
        minDegree: 90,
        maxDegree:134
    },
    13: {
        name: '01 Bịch Bánh Karamucho Xanh',
        minDegree: 180,
        maxDegree: 224
    },
    14: {
        name: '01 Bịch Bánh Karamucho Đỏ',
        minDegree: 270,
        maxDegree: 314
    },
}

let theWheel = new Winwheel({
    'numSegments': 8,     // Specify number of segments.
    'drawMode': 'image',
    'responsive'   : true,
    'drawText': false,
    'animation':           // Specify the animation to use.
    {
        'type': 'spinToStop',
        'duration': 5,     // Duration in seconds.
        'spins': 8,     // Number of complete spins.
        'callbackFinished': alertPrize
    }
});

// Create new image object in memory.
let loadedImg = new Image(canvas.clientWidth, canvas.clientHeight);
borderImg.style.top = '-95px'
borderImg.style.left = '-84px'
borderImg.style.width = `${canvas.clientWidth+170}px`;
borderImg.style.height = `${canvas.clientHeight+170}px`;
// Create callback to execute once the image has finished loading.
loadedImg.onload = function()
{
    theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
    theWheel.draw();                    // Also call draw function to render the wheel.
}

// Set the image source, once complete this will trigger the onLoad callback (above).
loadedImg.src = "/assets/img/wheel.png";
function handleButtonClick() {
    billImageInput.click();
}

billImageInput.addEventListener('change', async () => {
    if($('#userInfoModal').css('display') === 'none'){
        await startSpin();
    }
})

async function startSpin() {
    const response = await fetch('http://sapwheel.ongdev.com/api/v1/getRandomItem', {
            method: 'GET'
        });
        const degree = await response.json()
    theWheel.stopAnimation(false);
    statusButton(2);

    theWheel.animation.stopAngle = degree;

    // Start animation.
    theWheel.startAnimation();
}

function statusButton(status) {
    if (status == 1) {
        document.getElementById('spin_start').disabled = false;
    } else {
        document.getElementById('spin_start').disabled = true;
    }
}
statusButton(1);

function alertPrize() {
    let winningSegmentNumber = theWheel.getIndicatedSegmentNumber();

    const prizeText = prizeMap[winningSegmentNumber].name;
    console.log(prizeText)
    prize = prizeText
    $('#userInfoModal').modal()
}

userInfoForm.onsubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(userInfoForm)
    formData.append('prize', prize)
    try {
        const response = await axios.post('http://sapwheel.ongdev.com/api/v1/user', formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
              },
            cache: false
        })
        if (response.status === 500 || response.status === 406) {
            alert("Gửi thông tin không thành công")
        } else {
            alert("Gửi thông tin thành công")
        }
        $('#userInfoModal').modal('hide')
        statusButton(1);
    } catch (error) {
        alert("Gửi thông tin không thành công")
        $('#userInfoModal').modal('hide')
        statusButton(1);
    }
}