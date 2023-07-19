export const parseLineSeparatedList = (text) => {
    let list = text.split("\n");
    for (let i = 0; i < list.length; i++) {
        list[i] = removeListNumber(list[i]);
    }
    return list;
}

const removeListNumber = (text) => {
    return text.substring(text.indexOf(".") + 2)
}

