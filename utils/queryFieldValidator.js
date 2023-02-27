

module.exports.queryFieldValidator = (fields, query) => {
    const { missingFields } = Object.keys(query).reduce((acc, key) => {
        if (fields.includes(key.toLocaleLowerCase())) {
            return acc;
        } else {
            return { ...acc, missingFields: [...acc.missingFields, key] };
        }
    }, { missingFields: [] });

    return {
        response: missingFields.length === 0,
        err: missingFields.map(key => `${key} not defined in server`),
    };
};

