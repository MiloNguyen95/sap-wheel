const canvas = document.getElementById('canvas');
const borderImg = document.getElementById('borderImg');
const billImageInput = document.getElementById('bill-image');
let prize;
const prizeMap = {
    0: {
        fullName: '01 Bịch Bánh Karamucho Xanh',
        name: 'xanh',
        minDegree: 0,
        maxDegree: 44
    },
    1: {
        fullName: '01 Voucher Got It trị giá 30,000vnđ',
        name: 'gotit',
        minDegree: 45,
        maxDegree: 89
    },
    2: {
        fullName: '01 Bịch Bánh Karamucho Đỏ',
        name: 'do',
        minDegree: 90,
        maxDegree: 134
    },
    3: {
        fullName: '01 Lon Bia Sapporo Premium 500ml',
        name: 'bia',
        minDegree: 135,
        maxDegree: 179
    },
    4: {
        fullName: '01 Bịch Bánh Karamucho Xanh',
        name: 'xanh',
        minDegree: 180,
        maxDegree: 224
    },
    5: {
        fullName: '01 Voucher Got It trị giá 30,000vnđ',
        name: 'gotit',
        minDegree: 225,
        maxDegree: 269
    },
    6: {
        fullName: '01 Bịch Bánh Karamucho Đỏ',
        name: 'do',
        minDegree: 270,
        maxDegree: 314
    },
    7: {
        fullName: '01 Lon Bia Sapporo Premium 500ml',
        name: 'bia',
        minDegree: 315,
        maxDegree: 359
    },
    8: {
        fullName: '01 Bịch Bánh Karamucho Xanh',
        name: 'xanh',
        minDegree: 0,
        maxDegree: 44
    },
    9: {
        fullName: '01 Bịch Bánh Karamucho Đỏ',
        name: 'do',
        minDegree: 90,
        maxDegree: 134
    },
    10: {
        fullName: '01 Lon Bia Sapporo Premium 500ml',
        name: 'bia',
        minDegree: 135,
        maxDegree: 179
    },
    11: {
        fullName: '01 Bịch Bánh Karamucho Xanh',
        name: 'xanh',
        minDegree: 0,
        maxDegree: 44
    },
    12: {
        fullName: '01 Bịch Bánh Karamucho Đỏ',
        name: 'do',
        minDegree: 90,
        maxDegree: 134
    },
    13: {
        fullName: '01 Bịch Bánh Karamucho Xanh',
        name: 'xanh',
        minDegree: 180,
        maxDegree: 224
    },
    14: {
        fullName: '01 Bịch Bánh Karamucho Đỏ',
        name: 'do',
        minDegree: 270,
        maxDegree: 314
    },
}

let theWheel = new Winwheel({
    'numSegments': 8,     // Specify number of segments.
    'drawMode': 'image',
    'responsive': true,
    'drawText': false,
    'animation':           // Specify the animation to use.
    {
        'type': 'spinToStop',
        'duration': 10,     // Duration in seconds.
        'spins': 16,     // Number of complete spins.
        'callbackFinished': alertPrize
    }
});

// Create new image object in memory.
let loadedImg = new Image(canvas.clientWidth, canvas.clientHeight);
borderImg.style.top = '-95px'
borderImg.style.left = '-84px'
borderImg.style.width = `${canvas.clientWidth + 170}px`;
borderImg.style.height = `${canvas.clientHeight + 170}px`;
// Create callback to execute once the image has finished loading.
loadedImg.onload = function () {
    theWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
    theWheel.draw();                    // Also call draw function to render the wheel.
}

// Set the image source, once complete this will trigger the onLoad callback (above).
loadedImg.src = "/assets/img/wheel.png";
function handleButtonClick() {
    billImageInput.click();
}

billImageInput.addEventListener('change', async () => {
    if ($('#userInfoModal').css('display') === 'none') {
        await startSpin();
    }
})

async function startSpin() {
    const response = await axios.get('http://sapwheel.ongdev.com/api/v1/getRandomItem');
    theWheel.stopAnimation(false);
    statusButton(2);

    theWheel.animation.stopAngle = response.data.data;

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
    let winningSegmentNumber = theWheel.getIndicatedSegmentNumber() -1;

    const prizeText = prizeMap[winningSegmentNumber].name;
    prize = prizeText
    alert(`Bạn đã trúng: ${prizeMap[winningSegmentNumber].fullName}`)
    $('#userInfoModal').modal()
}

userInfoForm.onsubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(userInfoForm)
    formData.append('prize', prize)
    try {
        const response = await axios.post('http://sapwheel.ongdev.com/api/v1/user', formData, {
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