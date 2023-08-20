export const parseLineSeparatedList = (text) => {
    let list = text.split("\n");
    for (let i = 0; i < list.length; i++) {
        if (list[i] === "") {
            list.splice(i, 2);
            i -= 2;
        } 
        
    }
    console.log(list);
    return list;
}

const removeListNumber = (text) => {
    return text.substring(text.indexOf(".") + 1).trim();

}

