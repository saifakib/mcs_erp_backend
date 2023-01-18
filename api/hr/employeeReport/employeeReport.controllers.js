const { designationReport, designationReportCount } = require("./employeeReport.services.");

module.exports = {
    designationReports: (req, res) => {
        designationReport(req, (err, results) => {
            if (err) {
                return res.json({
                    message: err,
                    data: null,
                    error: 5000
                });
            }
            return res.json({
                message: "get Successfully",
                data: results,
                error: null
            });
        })
    },
    designationReportCounts: (req, res) => {
        designationReportCount(req, (err, results) => {
            if (err) {
                return res.json({
                    message: err,
                    data: null,
                    error: 5000
                });
            }
            return res.json({
                message: "get Successfully",
                data: results,
                error: null
            });
        })
    },

}