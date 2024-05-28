var model;

async function loadModel() {
    model = await tf.loadGraphModel('/tfjs/model.json');
}

function predictImage() {
    let image = cv.imread(canvas);  // let --> Only exists in the function
    
    // MAKE IT GREYSCALE & INCREASE CONTRAST
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0)
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY)

    // CROP THE REGION OF INTEREST
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cont = contours.get(0);
    rectangle = cv.boundingRect(cont);
    image = image.roi(rectangle)

    // RESIZING
    var height = image.rows;
    var width = image.cols;

    if (height > width) {
        height = 20;
        const scaleFactor = image.rows / 20;
        width = Math.round(image.cols / scaleFactor);
    }
    else {
        const scaleFactor = image.cols / 20;
        width = 20;
        height = Math.round(image.rows / scaleFactor);
    }
    
    let dsize = new cv.Size(width, height);
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    // PADDING
    const leftPad = Math.ceil(4 + (20 - width) / 2);
    const rightPad = Math.floor(4 + (20 - width) / 2);
    const topPad = Math.ceil(4 + (20 - height) / 2);
    const bottomPad = Math.floor(4 + (20 - height) / 2);
    const padColor = new cv.Scalar(0, 0, 0, 255);
    
    // console.log(leftPad, rightPad, topPad, bottomPad);

    cv.copyMakeBorder(image, image, topPad, bottomPad, leftPad, rightPad, cv.BORDER_CONSTANT, padColor);

    // CENTER OF MASS
    cv.findContours(image,  contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cont = contours.get(0);
    const Moments = cv.moments(cont, false);
    const cx = Moments.m10 / Moments.m00;  // m00 ~ area
    const cy = Moments.m01 / Moments.m00;
    
    // console.log(Moments.m00, cx, cy);

    // SHIFT (WARP AFFINE)
    const X_SHIFT = Math.round(image.cols/2.0 - cx);
    const Y_SHIFT = Math.round(image.rows/2.0 - cy);
    const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    dsize = new cv.Size(image.rows, image.cols);
    cv.warpAffine(image, image, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, padColor);

    // NORMALIZE PIXEL DATA
    let pixelValues = Float32Array.from(image.data).map(function(item){
        return item / 255.0;
    });
    // console.log(pixelValues);

    // CREATE TENSOR
    const X = tf.tensor([pixelValues]);
    // console.log(X.shape, X.dtype);

    // PREDICT
    const resultReal = model.predict(X);
    resultReal.print();
    const output = resultReal.dataSync()[0];
    
    // CHECK MEMORY ISSUES
    // console.log(tf.memory());

    // TESTING CANVAS
    // const testCanvas = document.createElement("canvas");
    // cv.imshow(testCanvas, image);
    // document.body.appendChild(testCanvas);

    // CLEANUP
    image.delete();
    contours.delete();
    hierarchy.delete();
    cont.delete();
    M.delete();
    resultReal.dispose();
    X.dispose();

    return output;

}