function Gui({imgPath, imgExt, nImg, feedbackDuration}={}) {
    // private Members (accessible in the whole function)
    // Should be accessed with a getter/setter
    this.feedbackDuration = feedbackDuration;
    this.imgPath = imgPath;
    this.imgExt = imgExt;
    this.nImg = nImg;
    this.images = [];

    /* =================== private methods ================= */

    this.loadImg = function () {
        for (let i = 1; i <= this.nImg; i++) {
            this.images[i] = new Image();
            this.images[i].src = this.imgPath + i + '.' + this.imgExt;
            this.images[i].className = "img-responsive center-block";
            this.images[i].style.border = "5px solid transparent";
            this.images[i].style.position = "relative";
            this.images[i].style.top = "0px";
        }
    };

    /* =================== public methods ================== */

    // main init method
    this.init = function () {
        this.loadImg();
    };

    this.getImg = function (idx) {
        return this.images[idx];
    };
}

// set to true to test the module
// using "$ node --experimental-modules myscript.mjs"
// /!\ can't be run using node because Image() is missing /!\
main({test: false});

function main({test}={}) {
    if (test) {
        console.log('Testing module...');

        let gui = new Gui(
            {
                imgPath: 'src/assets/images/cards_gif/stim/',
                imgExt: '.gif',
                nImg: 12,
                feedbackDuration: 2000
            }
        );
        gui.init();
    }
}

