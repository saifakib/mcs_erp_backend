const { ExecuteHR } = require("../../../utils/hrDynamicController");
const _ = require("lodash");
module.exports = {
    designationReport: async (data, callBack) => {
        const results = await ExecuteHR(`SELECT E.EMPLOYE_ID,DG.DESIGNATION,D.DEPARTEMENT,E.EMPLOYE_REGISTRATION_NUMBER, E.NAME_ENGLISH,E.MOBILE_PHONE,G.GRADE, E.PHOTO_PATH,
        case 
        when INSTR(DG.DESIGNATION, '(') > 0 then SUBSTR(DG.DESIGNATION,0,INSTR(DG.DESIGNATION, '(') - 2) 
        else DG.DESIGNATION 
        end as EMP_DES,
        CASE
    WHEN   TO_NUMBER(G.GRADE) <= 9 AND TO_NUMBER(G.GRADE) > 0 THEN '1st Class'
    WHEN  TO_NUMBER(G.GRADE) <= 12 AND TO_NUMBER(G.GRADE) > 9 THEN '2nd Class'
    WHEN  TO_NUMBER(G.GRADE) <= 16 AND TO_NUMBER(G.GRADE) > 12 THEN '3rd Class'
    ELSE '4th Class'
END AS grade_class
        FROM EMPLOYEE E LEFT OUTER JOIN DEPARTMENT_LIST D
        ON D.DEPARTEMENT_ID = E.DEPARTEMENT_ID
        LEFT OUTER JOIN DESIGNATION DG ON
        DG.DESIGNATION_ID = E.DESIGNATION_ID
        LEFT OUTER JOIN GRADES G ON G.GRADE_ID = DG.GRADE_ID
        WHERE E.ACTIVE = 1
        ORDER BY TO_NUMBER(G.GRADE) asc
        `, [], 1);
        if (results?.data) {
            const designationData = results?.data.rows;
            let designationGroupData = _.groupBy(designationData, 'EMP_DES')
            callBack(null, designationGroupData)
        }
        else {
            callBack(results?.error)
        }

    },
    designationReportCount: async (data, callBack) => {
        const results = await ExecuteHR(`SELECT  TO_NUMBER(G.GRADE) as GRADE_NO,INSTR(DG.DESIGNATION, '(') as test ,case when INSTR(DG.DESIGNATION, '(') > 0 then SUBSTR(DG.DESIGNATION,0,INSTR(DG.DESIGNATION, '(') - 2) 
        else DG.DESIGNATION end as emp_des FROM EMPLOYEE E
        LEFT OUTER JOIN DESIGNATION DG ON DG.DESIGNATION_ID = E.DESIGNATION_ID
        LEFT OUTER JOIN GRADES G ON G.GRADE_ID = DG.GRADE_ID
        ORDER BY TO_NUMBER(G.GRADE) asc`, [], 1);
        if (results.data) {
            const designationData = results?.data.rows;
            callBack(null, designationData)
        }
        else {
            callBack(results.error)
        }

    },

}