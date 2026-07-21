/**
 * Parses a f1api.dev /api/circuits-style JSON body ({ circuits: [...] }) and
 * upserts each entry into x_1912467_f1now1_circuit, matched by circuit_id.
 * fastestLapDriverId/fastestLapTeamId are resolved against the Driver/Team
 * tables (by their business id) and left blank if no match is found.
 */
(function execute(inputs, outputs) {
    var created = 0;
    var updated = 0;
    try {
        var parsed = JSON.parse(inputs.circuits_json);
        var circuits = (parsed && parsed.circuits) || [];
        for (var i = 0; i < circuits.length; i++) {
            var c = circuits[i];
            if (!c || !c.circuitId) continue;

            var gr = new GlideRecord('x_1912467_f1now1_circuit');
            gr.addQuery('circuit_id', c.circuitId);
            gr.query();

            var isUpdate = gr.next();
            if (!isUpdate) {
                gr.initialize();
                gr.setValue('circuit_id', c.circuitId);
            }
            gr.setValue('name', c.circuitName || '');
            gr.setValue('country', c.country || '');
            gr.setValue('city', c.city || '');
            gr.setValue('lap_record', c.lapRecord || '');
            gr.setValue('url', c.url || '');
            if (c.circuitLength !== undefined && c.circuitLength !== null) {
                gr.setValue('circuit_length', String(c.circuitLength));
            }
            if (c.numberOfCorners !== undefined && c.numberOfCorners !== null) {
                gr.setValue('number_of_corners', c.numberOfCorners);
            }
            if (c.firstParticipationYear !== undefined && c.firstParticipationYear !== null) {
                gr.setValue('first_participation_year', c.firstParticipationYear);
            }
            if (c.fastestLapYear !== undefined && c.fastestLapYear !== null) {
                gr.setValue('fastest_lap_year', c.fastestLapYear);
            }

            if (c.fastestLapDriverId) {
                var driverGr = new GlideRecord('x_1912467_f1now1_driver');
                driverGr.addQuery('driver_id', c.fastestLapDriverId);
                driverGr.query();
                if (driverGr.next()) {
                    gr.setValue('fastest_lap_driver', driverGr.getUniqueValue());
                }
            }

            if (c.fastestLapTeamId) {
                var teamGr = new GlideRecord('x_1912467_f1now1_team');
                teamGr.addQuery('team_id', c.fastestLapTeamId);
                teamGr.query();
                if (teamGr.next()) {
                    gr.setValue('fastest_lap_team', teamGr.getUniqueValue());
                }
            }

            if (isUpdate) {
                gr.update();
                updated++;
            } else {
                gr.insert();
                created++;
            }
        }
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.error_message = '';
    } catch (ex) {
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.error_message = '' + ex;
    }
})(inputs, outputs);
