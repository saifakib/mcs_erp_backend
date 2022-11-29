
const errorResponse = (error) => {
    const { details } = error;
    const message = details.map(i => i.message).join(',');
    let cmessage = message.replace(/"/g , '').split(" ");
    cmessage[0] = cmessage[0].replace(/_/, ' ');
    cmessage[0] =  cmessage[0].charAt(0).toUpperCase() + cmessage[0].slice(1);
    return cmessage.join(" ");
}

module.exports = {
    errorResponse
}
