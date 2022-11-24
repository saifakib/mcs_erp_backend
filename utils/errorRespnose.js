
module.exports.errorResponse = (error) => {
    const { details } = error;
    const message = details.map(i => i.message).join(',')
    return message.replace(/"/g , '');
}
