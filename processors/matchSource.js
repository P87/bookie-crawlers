/**
 * Get the source of a live match page from our queue and store the
 * odds/stats.
 */

var projectConfig = require('../config/project');
var dataDriver = require('../utils/data/' + projectConfig.dataDriver);
var queueDriver = require('../utils/queue/' + projectConfig.queueDriver);

var MatchSource = {
    run: function() {
        queueDriver.get('matchSourceQueue', function(msg, ch) {
            var data = JSON.parse(msg.content.toString());
            var parser = require('../parsers/' + data.site + '/match');

            var teams = parser.getTeams(data.content);
            var score = parser.getScore(data.content);
            var stats = teams && score ?
                parser.getStats(data.content) :
                false;

            log.info(teams);
            log.info(score);
            log.info(stats);

            dataDriver.saveMatchInfo(teams, score, stats, function() {
                ch.ack(msg);
            });
            // @todo parse the odds
        });
    }
}

module.exports = MatchSource;
