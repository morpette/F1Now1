/**
 * Parses a f1api.dev /api/{year}/drivers-championship-style JSON body
 * ({ championshipId, drivers_championship: [{ driverId, teamId, position,
 * points, wins, ... }] }) and upserts each entry into
 * x_1912467_f1now1_driver_stand, matched on the (championship, driver)
 * unique index. Entries whose championship, driver, or team can't be
 * resolved by business id are skipped, not errored.
 */
(function execute(inputs, outputs) {
    var created = 0;
    var updated = 0;
    var skipped = 0;
    try {
        var parsed = JSON.parse(inputs.driver_standings_json);
        var championshipId = parsed && parsed.championshipId;
        var standings = (parsed && parsed.drivers_championship) || [];

        var championshipSysId = '';
        if (championshipId) {
            var champGr = new GlideRecord('x_1912467_f1now1_championship');
            champGr.addQuery('championship_id', championshipId);
            champGr.query();
            if (champGr.next()) {
                championshipSysId = champGr.getUniqueValue();
            }
        }

        if (!championshipSysId) {
            outputs.created_count = 0;
            outputs.updated_count = 0;
            outputs.skipped_count = standings.length;
            outputs.error_message = 'Championship not found: ' + championshipId;
            return;
        }

        for (var i = 0; i < standings.length; i++) {
            var s = standings[i];
            if (!s || !s.driverId || !s.teamId) {
                skipped++;
                continue;
            }

            var driverGr = new GlideRecord('x_1912467_f1now1_driver');
            driverGr.addQuery('driver_id', s.driverId);
            driverGr.query();
            if (!driverGr.next()) {
                skipped++;
                continue;
            }

            var teamGr = new GlideRecord('x_1912467_f1now1_team');
            teamGr.addQuery('team_id', s.teamId);
            teamGr.query();
            if (!teamGr.next()) {
                skipped++;
                continue;
            }

            var gr = new GlideRecord('x_1912467_f1now1_driver_stand');
            gr.addQuery('championship', championshipSysId);
            gr.addQuery('driver', driverGr.getUniqueValue());
            gr.query();

            var isUpdate = gr.next();
            if (!isUpdate) {
                gr.initialize();
                gr.setValue('championship', championshipSysId);
                gr.setValue('driver', driverGr.getUniqueValue());
            }
            gr.setValue('team', teamGr.getUniqueValue());
            if (typeof s.position === 'number') gr.setValue('position', s.position);
            if (typeof s.points === 'number') gr.setValue('points', s.points);
            if (typeof s.wins === 'number') gr.setValue('wins', s.wins);

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
        outputs.skipped_count = skipped;
        outputs.error_message = '';
    } catch (ex) {
        outputs.created_count = created;
        outputs.updated_count = updated;
        outputs.skipped_count = skipped;
        outputs.error_message = '' + ex;
    }
})(inputs, outputs);
