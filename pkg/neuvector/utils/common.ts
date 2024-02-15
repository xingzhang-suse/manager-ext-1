export function arrayToCsv(array: any, title: string = '') {
    let line: string = '';
    let result: string = '';
    let columns: string[] = [];
    if (title.length > 0) {
      result += title + '\r\n';
    }
    let i: number = 0;
    for (let key in array[0]) {
      let keyString = key + ',';
      columns[i] = key;
      line += keyString;
      i++;
    }
  
    line = line.slice(0, -1);
    result += line + '\r\n';
  
    for (let i = 0; i < array.length; i++) {
      let line = '';
  
      for (let j = 0; j < columns.length; j++) {
        let value = array[i][columns[j]];
        if (value === undefined || value === null) value = '';
        line += `"${value}"` + ',';
      }
  
      line = line.slice(0, -1);
      result += line + '\r\n';
    }
    return result;
  }