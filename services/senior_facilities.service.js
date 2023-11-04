const { connection } = require("../config/db_conn.config");

let facilities = [];
let init_sql = "select * from senior_facility";

class SeniorFacilitiesService {
  constructor() {
    connection.query(init_sql, (err, result) => {
      if (err) throw err;
      facilities = result;
    });
  }
  findAll() {
    return facilities;
  }

  //�ݰ���� return
}

module.exports = SeniorFacilitiesService;
