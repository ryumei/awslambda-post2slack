var aws   = require('aws-sdk');
var url   = require('url');
var https = require('https');
var cw    = new aws.CloudWatch({region: 'ap-northeast-1', endpoint: 'https://monitoring.ap-northeast-1.amazonaws.com'});

var channel_name = process.env.SLACK_CHANNEL;
var channel_url = process.env.SLACK_WEBHOOK_URL;

var post = function(data, context) {
    var fields = [];
    fields.push({title: "hello", value: "slack", short: true});
    var message = {
        channel: channel_name,
        attachments: [{
            fallback: 'hello',
            pretext: 'heiio',
            color: 'good',
            fields: fields
        }]
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
    post(null, context);
    callback(null, 'Hello from Lambda');
};
