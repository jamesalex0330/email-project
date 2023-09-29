export default {

  dashboardQuery(data) {
    let paymentStatus = data['payment_status'] ?? []
    let transactionStatus = data['transaction_status'] ?? []
    let transactionTypeCode = data['transaction_type_code'] ?? []
    let canNumber = data['canNumber'] ?? null;
    let folioNumber = data['folio_number'] ?? null;
    let utrn = data['utrn'] ?? 0;

    return `SELECT id, units, ROUND(SUM(amount), 2) AS sum_amount
            FROM
                txn_response_transaction_rsps AS txnResponseTransactionRsp
            WHERE
                txnResponseTransactionRsp.folio_number IS NOT ${folioNumber}
                AND txnResponseTransactionRsp.utrn IN (${utrn})
                AND txnResponseTransactionRsp.payment_status IN (${paymentStatus})
                AND txnResponseTransactionRsp.transaction_status IN (${transactionStatus})
                AND txnResponseTransactionRsp.transaction_type_code IN (${transactionTypeCode})
                AND txnResponseTransactionRsp.can_number = '${canNumber}'
            GROUP BY id LIMIT 1;`;
  },

};
