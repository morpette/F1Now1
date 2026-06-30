/**
 * ATF server-side script (negative path) — invokes the "F1: Get Driver by ID"
 * action with an unknown driver id and asserts the action handles the upstream
 * failure gracefully: it surfaces the HTTP 404 status without throwing, leaving
 * error_message empty (the action's try/catch only fires on thrown exceptions,
 * and RESTMessageV2 returns a 404 response rather than throwing).
 */
(function () {
    function fail(msg) {
        stepResult.setOutputMessage(msg);
        stepResult.setFailed();
    }

    var result = sn_fd.FlowAPI.getRunner()
        .action('x_1912467_f1now1.f1_get_driver_by_id')
        .inForeground()
        .withInputs({ driver_id: 'no_such_driver_xyz' })
        .run();
    var out = result.getOutputs();

    var status = parseInt(out.status_code, 10);
    var err = out.error_message || '';

    if (err) return fail('Action captured an exception instead of surfacing the HTTP status: ' + err);
    if (status !== 404) return fail('Expected upstream 404 for an unknown driver id, got ' + status);

    stepResult.setOutputMessage('OK: action surfaced upstream 404 gracefully (error_message empty)');
})();
