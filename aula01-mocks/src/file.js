const { readFile } = require('fs/promises')
const { error } = require('./constants')

const DEFAULT_OPTION = {
    maxLines: 3,
    fields:[
        "id",
        "name",
        "profession",
        "age"
    ]
}

class File{
    static async csvToJson(filePath){
        const content = await File.getFileContent(filePath);
        const validation = File.isValid(content);
        if(!validation.valid){
            throw new Error(validation);
        }
        return content;
    }

    static async getFileContent(filePath){
        return (await readFile(filePath)).toString("utf8");
    }

    static isValid(csvString, options = DEFAULT_OPTION ){
        const [ header, ...fileWithoutHeader] = csvString.split('\n');
        const isHeaderValid = header === options.fields.join(',');
        if(!isHeaderValid){
            return{
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        const isContentLengthAccepted = (
            fileWithoutHeader.length > 0 &&
            fileWithoutHeader.length <= options.maxLines
        )

        if(!isContentLengthAccepted){
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        return {
            valid: true
        }
    }
}

(async () => {
    // const result = File.csvToJson('../mocks/emptyFile-invalid.csv');
    const result = await File.csvToJson('../mocks/fourItems-invalid.csv');

    console.log(result)
})()

module.exports = File