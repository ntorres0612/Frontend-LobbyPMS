
const debounce = (fn, delay) => {
    var timeoutID = null
    return function () {
        clearTimeout(timeoutID)
        var args = arguments
        var that = this
        timeoutID = setTimeout(function () {
            fn.apply(that, args)
        }, delay)
    }
}


const validateNumber = (number) => {
    if (isNaN(number)) {
        return false;
    } else {
        return true;
    }
}


export { debounce, validateNumber }
