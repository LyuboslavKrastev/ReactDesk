const sorter = (arr, order, value) => {
    let sorted;
    if(order === 'DESC'){
        sorted = arr.sort(function (a, b) {
            let aVal = a[value];
            let bVal = b[value];
            if (aVal < bVal) return 1;
            if (aVal > bVal) return -1;
            if (aVal === bVal) return 0;
        });
    } else {
        sorted = arr.sort(function (a, b) {
            let aVal = a[value];
            let bVal = b[value];
            if (aVal > bVal) return 1;
            if (aVal < bVal) return -1;
            if (aVal === bVal) return 0;
        });
    }

    return sorted;
}

export default sorter;