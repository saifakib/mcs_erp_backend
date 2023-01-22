module.exports.queryFieldValidator = (fields, query) => {
    console.log(fields, query);
    let response = true;
    let err = [];
    return Object.keys(query).forEach(key => {
        fields.includes(`${key}`) ? {
            response: response,
        } : {
            response: !response,
            err: [...err, `${key} not defined in server`]
        }
    })
}
