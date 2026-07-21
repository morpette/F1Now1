/**
 * Thin invoker for F1 API REST function `getDriverById`
 * (GET /api/drivers/{driverId}).
 */
(function execute(inputs, outputs) {
    try {
        var rm = new sn_ws.RESTMessageV2('F1 API Driver Endpoints', 'getDriverById');
        rm.setStringParameterNoEscape('driverId', inputs.driver_id);
        var response = rm.execute();
        outputs.status_code = response.getStatusCode();
        outputs.response_body = response.getBody();
        outputs.error_message = '';
    } catch (ex) {
        outputs.status_code = 0;
        outputs.response_body = '';
        outputs.error_message = '' + ex;
    }
})(inputs, outputs);