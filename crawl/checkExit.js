const sql = require("../model/db");
var fs = require("fs");
exports.check = async function checkData(orderData) {
  await sql.query(
    `SELECT * FROM orders WHERE  order_id= "${orderData.order_id}" `,
    async function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        if (results.length > 0) {
          await updateOrder(orderData);
        } else {
          await insertOrder(orderData);
        }
      }
    }
  );
};

async function updateOrder(order) {
  await sql.query(
    `UPDATE orders SET merchant = "${order.merchant}", utm_source = "${order.utm_source}" , reality_commission = "${order.reality_commission}" ,is_confirmed = "${order.is_confirmed}" ,sales_time = "${order.sales_time}",order_status = "${order.order_status}",confirmed_time = "${order.confirmed_time}" ,click_time = "${order.click_time}" , user_agent = "${order.user_agent}"
    WHERE order_id = "${order.order_id}";
    ;`,
    function (error, results, fields) {
      if (error) {
        fs.appendFileSync(
           "/home/rb005/H_dev/3tmmo-webstite-backend-v2/log/error.txt",
          error + "\n"
        );
      } else {
        fs.appendFileSync(
          "/home/rb005/H_dev/3tmmo-webstite-backend-v2/log/update.txt",
          " update row recods" + order.order_id + "\n"
        );
      }
    }
  );
}

async function insertOrder(order) {
  await sql.query(
    `INSERT INTO orders (order_id ,  merchant, utm_source,  is_confirmed, pub_commission , reality_commission ,sales_time,order_status ,confirmed_time ,click_time , user_agent) VALUES ("${order.order_id}" ,"${order.merchant}", "${order.utm_source}","${order.is_confirmed}","${order.pub_commission}", "${order.reality_commission}","${order.sales_time}","${order.order_status}","${order.confirmed_time}","${order.click_time}" , "${order.user_agent}" );`,
    function (error, results, fields) {
      if (error) {
        fs.appendFileSync(
          "/home/rb005/H_dev/3tmmo-webstite-backend-v2/log/error.txt",
          error + "\n"
        );
      } else {
        fs.appendFileSync(
          "/home/rb005/H_dev/3tmmo-webstite-backend-v2/log/insert.txt",
          " insert row recods" + "\n"
        );
      }
    }
  );
}
