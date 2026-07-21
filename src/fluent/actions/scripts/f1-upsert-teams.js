/**
 * Parses a f1api.dev /api/teams-style JSON body ({ teams: [...] }) and
 * upserts each entry into x_1912467_f1now1_team, matched by team_id.
 */
(function execute(inputs, outputs) {
    var created = 0;
    var updated = 0;
    try {
        var parsed = JSON.parse(inputs.teams_json);
        var teams = (parsed && parsed.teams) || [];
        for (var i = 0; i < teams.length; i++) {
            var t = teams[i];
            if (!t || !t.teamId) continue;

            var gr = new GlideRecord('x_1912467_f1now1_team');
            gr.addQuery('team_id', t.teamId);
            gr.query();

            var isUpdate = gr.next();
            if (!isUpdate) {
                gr.initialize();
                gr.setValue('team_id', t.teamId);
            }
            gr.setValue('name', t.teamName || '');
            gr.setValue('nationality', t.teamNationality || '');
            gr.setValue('url', t.url || '');
            if (t.firstAppeareance !== undefined && t.firstAppeareance !== null) {
                gr.setValue('first_appearance', t.firstAppeareance);
            }
            if (t.constructorsChampionships !== undefined && t.constructorsChampionships !== null) {
                gr.setValue('constructors_championships', t.constructorsChampionships);
            }
            if (t.driversChampionships !== undefined && t.driversChampionships !== null) {
                gr.setValue('drivers_championships', t.driversChampionships);
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
