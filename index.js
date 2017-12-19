// post2slack
var url   = require('url');
var https = require('https');

var channel_name = process.env.SLACK_CHANNEL;
var channel_url = process.env.SLACK_WEBHOOK_URL;

var post = function(data, context) {
    var fields = [];
    //fields.push({title: "Message from AWS", value: "Lambda", short: true});
    //fields.push({title: data.title, value: JSON.stringify(data), short: true});
    var message = {
        channel: channel_name,
        attachments: data.attachements
    };
    var body = JSON.stringify(message);
    var options = url.parse(channel_url);
    options.method = 'POST';
    options.header = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
    };

    var statusCode;
    var postReq = https.request(options, function(res) {
        var chunks = [];
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            return chunks.push(chunk);
        });
        res.on('end', function() {
            var body = chunks.join('');
            statusCode = res.statusCode;
        });
        return res;
    });
    postReq.write(body);
    postReq.end();
    if (statusCode < 400) {
      context.succeed();
    }
}

exports.handler = (event, context, callback) => {
    post(event, context);
    callback(null, 'Hello from Lambda');
};
