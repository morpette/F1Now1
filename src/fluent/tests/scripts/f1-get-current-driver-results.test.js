/**
 * ATF server-side script — invokes the "F1: Get Current Season Driver Results"
 * action via the scriptable Flow runner and asserts a 200 JSON response
 * containing a top-level "driver" element.
 */
(function () {
    function fail(msg) {
        stepResult.setOutputMessage(msg);
        stepResult.setFailed();
    }

    var result = sn_fd.FlowAPI.getRunner()
        .action('x_1912467_f1now1.f1_get_current_driver_results')
        .inForeground()
        .withInputs({ driver_id: 'max_verstappen', limit: 5, offset: 0 })
        .run();
    var out = result.getOutputs();

    var status = parseInt(out.status_code, 10);
    var err = out.error_message || '';
    var body = out.response_body || '';

    if (status !== 200) return fail('Expected status 200, got ' + status + ' (error_message: ' + err + ')');
    if (err) return fail('Expected empty error_message, got: ' + err);

    var parsed;
    try {
        parsed = JSON.parse(body);
    } catch (e) {
        return fail('response_body is not valid JSON: ' + e);
    }
    if (!parsed || !parsed.driver) return fail('Expected top-level "driver" element in response');

    stepResult.setOutputMessage('OK: 200, valid JSON, "driver" present (season=' + parsed.season + ')');
})();