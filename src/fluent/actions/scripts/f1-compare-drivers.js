/**
 * Thin invoker for F1 API REST function `compareDrivers`
 * (GET /api/{year}/compare/{driverId1}/{driverId2}).
 */
(function execute(inputs, outputs) {
    try {
        var rm = new sn_ws.RESTMessageV2('F1 API Driver Endpoints', 'compareDrivers');
        rm.setStringParameterNoEscape('year', String(inputs.year));
        rm.setStringParameterNoEscape('driverId1', inputs.driver_id_1);
        rm.setStringParameterNoEscape('driverId2', inputs.driver_id_2);
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